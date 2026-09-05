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
import { readFileSync, existsSync } from 'node:fs';
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
