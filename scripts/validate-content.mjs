#!/usr/bin/env node
/**
 * validate-content.mjs — Content collection frontmatter validator.
 *
 * Reads every .md and .yaml file under src/content/ and asserts the
 * frontmatter has non-empty values for the schema-critical fields.
 * This is a regression test for the kind of bug seen in
 * partners-vs-pirates.md (C4) where the category, title, and excerpt
 * were malformed.
 *
 * We don't import astro:content (that only works in the Astro runtime).
 * Instead we replicate the schema checks inline. If src/content.config.ts
 * changes, update the schemas below to match.
 *
 * Usage:  node scripts/validate-content.mjs
 * Exit:   0 if all valid, 1 if any invalid.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = posix.join(__dirname, '..');
const CONTENT_DIR = posix.join(ROOT, 'src', 'content');

const SCHEMAS = {
  'case-studies': {
    ext: '.md',
    required: ['title', 'category', 'description', 'publishDate', 'client'],
    optional: ['services', 'cover'],
    types: { services: 'array', publishDate: 'date' },
  },
  services: {
    ext: '.md',
    // 'anchor' is required by src/content.config.ts (z.string(), no .optional()).
    // It MUST be in this required list or check:content will pass a service
    // markdown file that's missing `anchor:` — only for `astro build` to
    // fail later with a less-friendly Zod error. Round-5 F4 fix.
    required: ['title', 'category', 'description', 'anchor'],
    optional: ['offerings'],
    types: { offerings: 'array' },
  },
  articles: {
    ext: '.md',
    required: ['title', 'category', 'excerpt', 'publishDate'],
    optional: ['author'],
    types: { publishDate: 'date' },
  },
  testimonials: {
    ext: '.yaml',
    required: ['quote', 'author', 'role'],
    optional: ['company'],
    types: {},
  },
};

/**
 * Parse YAML-like frontmatter from a markdown file.
 * Only handles the simple `key: value` and `key:` + `  - item` forms used
 * in this repo. For more complex YAML, use a proper parser — but we don't
 * want to add a dependency.
 * @param {string} body
 * @returns {Record<string, any>} parsed frontmatter
 */
function parseMarkdownFrontmatter(body) {
  if (!body.startsWith('---')) return {};
  const end = body.indexOf('\n---', 3);
  if (end === -1) return {};
  const yaml = body.slice(3, end);
  return parseSimpleYaml(yaml);
}

/**
 * Parse a YAML file (testimonials). Handles:
 *   key: value
 *   key: "value"
 *   key: 'value'
 *   key: "value with: colon"
 *   key:
 *     - item
 * @param {string} text
 */
function parseSimpleYaml(text) {
  /** @type {Record<string, any>} */
  const out = {};
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }
    // List item under a key
    if (line.startsWith(' ') && line.trim().startsWith('- ')) {
      // Attach to the last key as an array
      const lastKey = Object.keys(out).pop();
      if (lastKey) {
        if (!Array.isArray(out[lastKey])) out[lastKey] = [];
        const item = line.trim().slice(2).trim();
        out[lastKey].push(stripQuotes(item));
      }
      i++;
      continue;
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (value === '') {
      // Could be a multi-line list — peek ahead
      const nextLines = [];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith(' ') && lines[j].trim().startsWith('- ')) {
        nextLines.push(stripQuotes(lines[j].trim().slice(2).trim()));
        j++;
      }
      if (nextLines.length > 0) {
        out[key] = nextLines;
        i = j;
        continue;
      }
      out[key] = '';
      i++;
      continue;
    }
    out[key] = stripQuotes(value);
    i++;
  }
  return out;
}

function stripQuotes(s) {
  if (typeof s !== 'string') return s;
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

/**
 * Coerce a parsed YAML scalar to the expected type.
 * Handles `[]` → empty array, `""` → empty string, etc.
 * @param {any} v
 * @param {string} type
 */
function coerceType(v, type) {
  if (type === 'array') {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed === '' || trimmed === '[]') return [];
      return [v];
    }
    return [];
  }
  if (type === 'date') {
    return v; // leave as string — Date.parse will validate
  }
  return v;
}

/**
 * Validate a frontmatter object against a schema.
 * @param {Record<string, any>} fm
 * @param {object} schema
 * @returns {string[]} list of error messages (empty if valid)
 */
function validate(fm, schema) {
  const errors = [];
  // Coerce types first so empty arrays are recognized
  for (const [key, type] of Object.entries(schema.types)) {
    if (key in fm) fm[key] = coerceType(fm[key], type);
  }
  for (const key of schema.required) {
    if (!(key in fm)) {
      errors.push(`missing required field: ${key}`);
      continue;
    }
    const v = fm[key];
    if (v === '' || v === null || v === undefined) {
      errors.push(`empty required field: ${key}`);
    } else if (typeof v === 'string' && v.trim() === '') {
      errors.push(`whitespace-only required field: ${key}`);
    } else if (typeof v === 'string' && schema.types[key] !== 'date' && v.startsWith(' ')) {
      errors.push(`leading whitespace in field: ${key} (value: "${v.slice(0, 40)}…")`);
    }
  }
  for (const [key, type] of Object.entries(schema.types)) {
    if (!(key in fm)) continue;
    const v = fm[key];
    if (type === 'array') {
      if (!Array.isArray(v)) {
        errors.push(`field ${key} should be an array, got ${typeof v}`);
      }
    } else if (type === 'date') {
      if (typeof v === 'string' && isNaN(Date.parse(v))) {
        errors.push(`field ${key} is not a valid date: "${v}"`);
      }
    }
  }
  return errors;
}

async function listFiles(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(path, ext);
      if (entry.isFile() && extname(entry.name) === ext) return [path];
      return [];
    })
  );
  return files.flat();
}

// === Main ===
if (!existsSync(CONTENT_DIR)) {
  console.error(`✗ content directory not found: ${CONTENT_DIR}`);
  process.exit(2);
}

let totalFiles = 0;
let totalErrors = 0;
/** @type {Map<string, string[]>} */
const errorsByFile = new Map();

for (const [collectionName, schema] of Object.entries(SCHEMAS)) {
  const collDir = posix.join(CONTENT_DIR, collectionName);
  if (!existsSync(collDir)) {
    console.warn(`! collection directory missing: ${collDir}`);
    continue;
  }
  const files = await listFiles(collDir, schema.ext);
  for (const file of files) {
    totalFiles++;
    const body = await readFile(file, 'utf8');
    const fm =
      schema.ext === '.yaml'
        ? parseSimpleYaml(body)
        : parseMarkdownFrontmatter(body);
    const errors = validate(fm, schema);
    if (errors.length > 0) {
      errorsByFile.set(posix.relative(ROOT, file), errors);
      totalErrors += errors.length;
    }
  }
}

console.log(`\nContent validation complete.`);
console.log(`  Collections: ${Object.keys(SCHEMAS).length}`);
console.log(`  Files:       ${totalFiles}`);
console.log(`  Errors:      ${totalErrors}\n`);

if (errorsByFile.size === 0) {
  console.log('✓ All content files valid.');
  process.exit(0);
}

for (const [file, errors] of errorsByFile) {
  console.log(`✗ ${file}`);
  for (const err of errors) {
    console.log(`   ${err}`);
  }
}

process.exit(1);
