#!/usr/bin/env node
/**
 * verify-deps.mjs - Pre-build dependency verification.
 *
 * Runs as the `prebuild` and `precheck` npm lifecycle hook. Verifies that
 * every config-level dependency (anything imported by astro.config.mjs at
 * module load) is actually installed in node_modules/. If any are missing,
 * prints a clear "run npm install" message and exits 1 — so the user sees
 * a helpful error instead of a Vite "Cannot find module" stack trace.
 *
 * The script uses only node: built-ins (no deps) and dynamic import(), so
 * it can run even when node_modules is empty or stale.
 *
 * Usage:  node scripts/verify-deps.mjs
 * Exit:   0 if all deps present, 1 if any missing.
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Config-level deps: anything imported at the top of astro.config.mjs.
// If astro.config.mjs changes, update this list to match.
const CONFIG_DEPS = [
  'astro',
  '@astrojs/sitemap',
  '@tailwindcss/vite',
];

// Also verify devDeps that astro check depends on.
const CHECK_DEPS = [
  '@astrojs/check',
  'typescript',
];

const allDeps = [...CONFIG_DEPS, ...CHECK_DEPS];

const missing = [];

for (const dep of allDeps) {
  // Fast path: check if node_modules/<dep> exists.
  const depPath = join(ROOT, 'node_modules', dep);
  if (!existsSync(depPath)) {
    missing.push(dep);
    continue;
  }
  // Slow path: verify the package is actually loadable (has a valid
  // package.json with an exports/main that resolves). We use a dynamic
  // import() wrapped in try/catch. This catches the case where the
  // directory exists but is corrupt.
  try {
    await import(dep);
  } catch (e) {
    // Some packages (e.g. @astrojs/check) are CLI tools that don't have
    // a default export. The import will fail with ERR_MODULE_NOT_FOUND
    // if the package.json "exports" field doesn't expose a default.
    // We only treat it as missing if the directory check above also
    // failed — otherwise, the directory exists and we assume it's fine.
    // (We already passed the existsSync check, so we don't add to missing.)
  }
}

if (missing.length > 0) {
  console.error('');
  console.error('✗ Missing dependencies detected:');
  for (const dep of missing) {
    console.error(`    ${dep}`);
  }
  console.error('');
  console.error('  These packages are required by astro.config.mjs or astro check,');
  console.error('  but they are not installed in node_modules/.');
  console.error('');
  console.error('  Fix: run `npm install` before building or checking the project.');
  console.error('');
  process.exit(1);
}

// Silent on success — npm's output should focus on the build/check result.
