/**
 * Validate `tauri.conf.json` against the schema the installed CLI ships.
 *
 * Why this exists: `tauri.conf.json` rejects UNKNOWN FIELDS outright, and the
 * rejection happens inside tauri-build - which needs the MSVC linker, which is not
 * installed on the development machine. So a one-character mistake in that file
 * was only discoverable in CI, ten minutes at a time. It cost three CI cycles on
 * 2026-09-05: a Cargo feature with no matching allowlist entry, a resource glob
 * that matched directories rather than files, and a comment key added in good
 * faith which the schema refuses.
 *
 * This reads `node_modules/@tauri-apps/cli/config.schema.json`, so it checks
 * against the exact CLI version installed rather than a copy that can drift.
 *
 * Deliberately dependency-free: it walks the schema for the two things that
 * actually bite - unknown properties, and a required property that is missing -
 * rather than pulling in a JSON-Schema validator for one file.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const confPath = join(root, 'src-tauri', 'tauri.conf.json');
const schemaPath = join(root, 'node_modules', '@tauri-apps', 'cli', 'config.schema.json');

if (!existsSync(schemaPath)) {
  console.error('the Tauri config schema is missing - run `yarn install` first');
  process.exit(1);
}

const conf = JSON.parse(readFileSync(confPath, 'utf8'));
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

/** Follow a `$ref`, and flatten the allOf/anyOf/oneOf a schema may hide behind. */
function resolve(node, seen = new Set()) {
  if (!node || typeof node !== 'object') return null;
  if (node.$ref) {
    if (seen.has(node.$ref)) return null;
    seen.add(node.$ref);
    const name = node.$ref.replace('#/definitions/', '').replace('#/$defs/', '');
    const defs = schema.definitions ?? schema.$defs ?? {};
    return resolve(defs[name], seen);
  }
  for (const key of ['allOf', 'anyOf', 'oneOf']) {
    const branches = node[key];
    if (!Array.isArray(branches)) continue;
    const merged = { ...node, properties: { ...(node.properties ?? {}) } };
    let anyOpen = node.additionalProperties;
    for (const b of branches) {
      const r = resolve(b, new Set(seen));
      if (r?.properties) Object.assign(merged.properties, r.properties);
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
      for (const b of branches) {
        const r = resolve(b, new Set(seen));
        if (r?.required) merged.required = [...(merged.required ?? []), ...r.required];
      }
    } else {
      delete merged.required;
    }
    return merged;
  }
  return node;
}

const problems = [];

function walk(value, node, path) {
  const s = resolve(node);
  if (!s || typeof value !== 'object' || value === null || Array.isArray(value)) return;
  const props = s.properties ?? {};
  const extra = s.additionalProperties;
  /* An OBJECT here means the schema is a free-form map whose values follow that
     subschema - `bundle.resources` and `plugins` both are. Treating it as "no
     properties declared, therefore every key is unknown" is what made this
     checker report two more phantom problems on its first run. */
  const isOpenMap = extra !== undefined && extra !== false;
  for (const key of Object.keys(value)) {
    if (key === '$schema') continue;
    if (!(key in props)) {
      if (isOpenMap) {
        if (typeof extra === 'object') walk(value[key], extra, `${path}${key}.`);
        continue;
      }
      // Tauri's deserializer denies unknown fields, so an absent
      // additionalProperties is as strict as an explicit false.
      problems.push(
        `${path}${key}: unknown field. The schema allows: ${Object.keys(props).sort().join(', ')}`,
      );
      continue;
    }
    walk(value[key], props[key], `${path}${key}.`);
  }
  for (const need of s.required ?? []) {
    if (!(need in value)) problems.push(`${path}${need}: required and missing`);
  }
}

walk(conf, schema, '');

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
function checkResourceGlobs(resources, reportTo) {
  if (!resources || typeof resources !== 'object' || Array.isArray(resources)) return;
  for (const key of Object.keys(resources)) {
    if (!key.includes('*')) continue;
    // The literal prefix before the first wildcard is the tree it reaches into.
    const prefix = key.slice(0, key.indexOf('*')).replace(/[/\\][^/\\]*$/, '');
    const abs = join(root, 'src-tauri', prefix);
    if (!existsSync(abs)) {
      reportTo.push(
        `bundle.resources["${key}"]: a glob key whose source tree "${prefix}" does not exist - run \`yarn sync:cli\` first, or the bundler will fail late with a message about a glob`,
      );
      continue;
    }
    let subdirs = [];
    try {
      subdirs = readdirSync(abs, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    } catch {
      continue;
    }
    if (subdirs.length > 0) {
      reportTo.push(
        `bundle.resources["${key}"]: a GLOB key FLATTENS the tree. "${prefix}" has subdirectories (${subdirs.sort().join(', ')}) and the bundler's Glob branch joins only each file's NAME onto the destination, so all of them land in one folder and any script that loads a sibling by relative path breaks at runtime. Use the DIRECTORY as the key instead - {"${prefix}": "<dest>"} - which takes the Walk branch and preserves the structure.`,
      );
    }
  }
}

checkResourceGlobs(conf.bundle?.resources, problems);

// The plant that proves this checker is not vacuous: a field the schema cannot
// know about must be reported. Run with --self-check to see it fail on purpose.
if (process.argv.includes('--self-check')) {
  const planted = structuredClone(conf);
  planted.bundle._notAField = 'x';
  const before = problems.length;
  walk(planted, schema, '');
  const caught = problems.length > before;
  console.log(caught ? 'self-check: a planted unknown field WAS caught' : 'self-check: *** BLIND ***');
  process.exit(caught ? 0 : 1);
}

if (problems.length > 0) {
  console.error(`tauri.conf.json: ${String(problems.length)} problem(s)`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`tauri.conf.json validates against @tauri-apps/cli ${String(JSON.parse(readFileSync(join(root, 'node_modules', '@tauri-apps', 'cli', 'package.json'), 'utf8')).version)}`);
