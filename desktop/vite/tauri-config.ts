/**
 * Validate `src-tauri/tauri.conf.json` against the schema the installed Tauri CLI ships, when a
 * build starts.
 *
 * Why this exists: `tauri.conf.json` rejects UNKNOWN FIELDS outright, and the rejection happens
 * inside tauri-build - which needed the MSVC linker the development machine did not have. So a
 * one-character mistake in that file was only discoverable in CI, ten minutes at a time. It cost
 * three CI cycles on 2026-09-05: a Cargo feature with no matching allowlist entry, a resource glob
 * that matched directories rather than files, and a comment key added in good faith which the
 * schema refuses.
 *
 * It reads `node_modules/@tauri-apps/cli/config.schema.json`, so it checks against the exact CLI
 * version installed rather than a copy that can drift. Deliberately dependency-free: it walks the
 * schema for the two things that actually bite - unknown properties, and a required property that
 * is missing - rather than pulling in a JSON-Schema validator for one file.
 *
 * It moved here from `scripts/check-tauri-config.mjs` (TASK-019, 2026-09-26: the house rules forbid
 * a scripts folder). The old `--self-check` flag is now a guard on every build: a planted unknown
 * field must be reported by name, or the build stops as BLIND rather than passing on a checker
 * that no longer sees anything (a CLI schema whose shape changed, say).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Logger, Plugin } from 'vite';

/** A JSON-Schema node, as far as this checker reads one. */
interface SchemaNode {
  $ref?: string;
  properties?: Record<string, SchemaNode>;
  additionalProperties?: boolean | SchemaNode;
  required?: string[];
  allOf?: SchemaNode[];
  anyOf?: SchemaNode[];
  oneOf?: SchemaNode[];
}
interface RootSchema extends SchemaNode {
  definitions?: Record<string, SchemaNode>;
  $defs?: Record<string, SchemaNode>;
}
type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Follow a `$ref`, and flatten the allOf/anyOf/oneOf a schema may hide behind. */
function resolveNode(
  schema: RootSchema,
  node: SchemaNode | undefined,
  seen: Set<string> = new Set()
): SchemaNode | null {
  if (!node || typeof node !== 'object') return null;
  if (node.$ref) {
    if (seen.has(node.$ref)) return null;
    seen.add(node.$ref);
    const name = node.$ref.replace('#/definitions/', '').replace('#/$defs/', '');
    const defs = schema.definitions ?? schema.$defs ?? {};
    return resolveNode(schema, defs[name], seen);
  }
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const branches = node[key];
    if (!Array.isArray(branches)) continue;
    const properties: Record<string, SchemaNode> = { ...(node.properties ?? {}) };
    const merged: SchemaNode = { ...node, properties };
    let anyOpen = node.additionalProperties;
    for (const branch of branches) {
      const r = resolveNode(schema, branch, new Set(seen));
      if (r?.properties) Object.assign(properties, r.properties);
      if (r && r.additionalProperties !== false && r.additionalProperties !== undefined) {
        anyOpen = r.additionalProperties;
      }
    }
    merged.additionalProperties = anyOpen;
    /* 🔴 `required` is DELIBERATELY not merged across a union. anyOf/oneOf are
       alternatives, so a value satisfying one branch need not satisfy another's
       required list. Merging them made this checker report
       `bundle.windows.webviewInstallMode.path: required and missing` on a
       perfectly valid config - `path` is required only by the fixedRuntime
       variant. A checker whose first three findings are its own bugs is the
       normal case; the fix is to correct the instrument before believing the
       number. Union-required is left unchecked rather than checked wrongly, and
       that is stated rather than hidden. */
    if (key === 'allOf') {
      for (const branch of branches) {
        const r = resolveNode(schema, branch, new Set(seen));
        if (r?.required) merged.required = [...(merged.required ?? []), ...r.required];
      }
    } else {
      delete merged.required;
    }
    return merged;
  }
  return node;
}

/** Walk `value` against `node`, recording every unknown field and missing required one. */
function walk(
  schema: RootSchema,
  value: unknown,
  node: SchemaNode | undefined,
  path: string,
  problems: string[]
): void {
  const s = resolveNode(schema, node);
  if (!s || !isObject(value)) return;
  const props = s.properties ?? {};
  const extra = s.additionalProperties;
  /* An OBJECT here means the schema is a free-form map whose values follow that
     subschema - `bundle.resources` and `plugins` both are. Treating it as "no
     properties declared, therefore every key is unknown" is what made this
     checker report two more phantom problems on its first run. */
  const isOpenMap = extra !== undefined && extra !== false;
  for (const key of Object.keys(value)) {
    if (key === '$schema') continue;
    if (!Object.hasOwn(props, key)) {
      if (isOpenMap) {
        if (typeof extra === 'object') walk(schema, value[key], extra, `${path}${key}.`, problems);
        continue;
      }
      // Tauri's deserializer denies unknown fields, so an absent
      // additionalProperties is as strict as an explicit false.
      problems.push(
        `${path}${key}: unknown field. The schema allows: ${Object.keys(props).sort().join(', ')}`
      );
      continue;
    }
    walk(schema, value[key], props[key], `${path}${key}.`, problems);
  }
  for (const need of s.required ?? []) {
    if (!Object.hasOwn(value, need)) problems.push(`${path}${need}: required and missing`);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
 * A SEMANTIC check the schema cannot make: a GLOB resource key FLATTENS the tree.
 *
 * 🔴 This shipped. On 2026-09-07 the installed app could not run its own engine,
 * because `bundle.resources` was `{"resources/windowsweep/**\/*": "windowsweep/"}`
 * and every one of the 38 engine files landed in ONE directory - no `bin/`, no
 * `lib/`, no `modules/` - so `windowsweep.ps1` could not dot-source
 * `lib/constants.ps1`. The config is SCHEMA-VALID, the build is green, CI passes,
 * and the file count is right. Only installing the app and running the engine
 * shows it.
 *
 * The rule comes from the bundler's own source, not from a guess
 * (tauri-utils/src/resources.rs, `resource_from_path`):
 *
 *   key contains '*'  -> the Glob branch  -> dest.join(path.file_name())
 *                        "we put all globbed paths under current_dest
 *                         PRESERVING THE FILE NAME AS IT IS"   <- flattens
 *
 *   key is a directory -> the Walk branch -> dest.join(strip_prefix(pattern))
 *                        "if processing a directory, preserve directory
 *                         structure under current_dest"        <- correct
 *
 * So a glob key is safe only when the tree it matches is FLAT. Name the
 * directory instead and the bundler walks it.
 *
 * ⚠️ Three forms of the same mistake have now been made here: a trailing `**`
 * matched only directories and yielded no files at all; `**\/*` matched the files
 * and flattened them; the directory form is the answer.
 * ───────────────────────────────────────────────────────────────────────────── */
function checkResourceGlobs(root: string, resources: unknown, problems: string[]): void {
  if (!isObject(resources)) return;
  for (const key of Object.keys(resources)) {
    if (!key.includes('*')) continue;
    // The literal prefix before the first wildcard is the tree it reaches into.
    const prefix = key.slice(0, key.indexOf('*')).replace(/[/\\][^/\\]*$/, '');
    const abs = join(root, 'src-tauri', prefix);
    if (!existsSync(abs)) {
      problems.push(
        `bundle.resources["${key}"]: a glob key whose source tree "${prefix}" does not exist - the bundler will fail late with a message about a glob`
      );
      continue;
    }
    let subdirs: string[] = [];
    try {
      subdirs = readdirSync(abs, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {
      continue;
    }
    if (subdirs.length > 0) {
      problems.push(
        `bundle.resources["${key}"]: a GLOB key FLATTENS the tree. "${prefix}" has subdirectories (${subdirs.sort().join(', ')}) and the bundler's Glob branch joins only each file's NAME onto the destination, so all of them land in one folder and any script that loads a sibling by relative path breaks at runtime. Use the DIRECTORY as the key instead - {"${prefix}": "<dest>"} - which takes the Walk branch and preserves the structure.`
      );
    }
  }
}

/** Whether the walk reports a planted unknown field by name - the proof it is not blind. */
function plantedFieldIsCaught(schema: RootSchema, conf: JsonObject): boolean {
  const planted = structuredClone(conf);
  const bundle = planted['bundle'];
  if (!isObject(bundle)) return false;
  bundle['_notAField'] = 'x';
  const problems: string[] = [];
  walk(schema, planted, schema, '', problems);
  return problems.some((p) => p.startsWith('bundle._notAField: unknown field'));
}

/** The result of one check: its findings, the CLI whose schema judged them, and whether it is blind. */
export interface TauriConfigCheck {
  problems: string[];
  cliVersion: string;
  blind: boolean;
}

/**
 * Check `src-tauri/tauri.conf.json` against the installed CLI's schema and the resource-glob rule.
 *
 * @param root - the desktop app's root (the folder holding `src-tauri/` and `node_modules/`).
 */
export function checkTauriConfig(root: string): TauriConfigCheck {
  const cliDir = join(root, 'node_modules', '@tauri-apps', 'cli');
  const schemaPath = join(cliDir, 'config.schema.json');
  if (!existsSync(schemaPath)) {
    return {
      problems: ['the Tauri config schema is missing - run `yarn install` first'],
      cliVersion: '',
      blind: false,
    };
  }
  const conf = JSON.parse(
    readFileSync(join(root, 'src-tauri', 'tauri.conf.json'), 'utf8')
  ) as unknown;
  if (!isObject(conf)) {
    return { problems: ['tauri.conf.json is not a JSON object'], cliVersion: '', blind: false };
  }
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as RootSchema;
  const cliVersion = (
    JSON.parse(readFileSync(join(cliDir, 'package.json'), 'utf8')) as { version: string }
  ).version;
  const problems: string[] = [];
  walk(schema, conf, schema, '', problems);
  const bundle = conf['bundle'];
  checkResourceGlobs(root, isObject(bundle) ? bundle['resources'] : undefined, problems);
  return { problems, cliVersion, blind: !plantedFieldIsCaught(schema, conf) };
}

/**
 * The Vite plugin: at the start of a build, refuse a `tauri.conf.json` the bundler would refuse
 * later - or one this checker can no longer judge.
 *
 * @param root - the desktop app's root.
 */
export function tauriConfigPlugin(root: string): Plugin {
  let logger: Logger | undefined;
  return {
    name: 'windowsweep-desktop:tauri-config',
    apply: 'build',
    configResolved(config) {
      logger = config.logger;
    },
    buildStart() {
      const check = checkTauriConfig(root);
      if (check.blind) {
        this.error(
          '[tauri-config] BLIND: a planted unknown field (bundle._notAField) was not reported, so this checker cannot be trusted against the installed CLI schema'
        );
      }
      if (check.problems.length > 0) {
        this.error(
          `[tauri-config] tauri.conf.json: ${String(check.problems.length)} problem(s)\n  ${check.problems.join('\n  ')}`
        );
      }
      logger?.info(
        `[tauri-config] tauri.conf.json validates against @tauri-apps/cli ${check.cliVersion}`
      );
    },
  };
}
