#!/usr/bin/env node
/**
 * link-check.mjs - Static link checker for the built Astro site.
 *
 * Walks dist and all .html files, extracts every href/src that points to a
 * same-origin URL (relative path or absolute https://astro.jesspete.shop/...),
 * and verifies each one resolves to a file in dist/. Reports broken links
 * grouped by source file with the offending href + line number.
 *
 * External links (https other origins, mailto:, tel:, etc.) are skipped -
 * we don't want network calls in a static check.
 *
 * Anchor links (#foo) are verified against the destination file's id list
 * when the file exists; if the file doesn't exist, the link is already
 * reported as a 404.
 *
 * Usage:  node scripts/link-check.mjs [--dist path/to/dist]
 * Exit:   0 if no broken links, 1 if any found.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = posix.join(__dirname, '..');

// Parse --dist flag (default: ROOT/dist)
const args = process.argv.slice(2);
let distDir = posix.join(ROOT, 'dist');
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dist' && args[i + 1]) {
    distDir = posix.resolve(args[i + 1]);
  }
}

if (!existsSync(distDir)) {
  console.error(`✗ dist directory not found: ${distDir}`);
  console.error(`  Run \`npm run build\` first.`);
  process.exit(2);
}

/**
 * Recursively list all .html files under a directory.
 * @param {string} dir
 * @returns {Promise<string[]>} absolute paths
 */
async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listHtmlFiles(path);
      if (entry.isFile() && extname(entry.name) === '.html') return [path];
      return [];
    })
  );
  return files.flat();
}

/**
 * Extract all href and src attribute values from an HTML string.
 * Returns an array of { value, line } objects.
 * @param {string} html
 * @returns {{ value: string, line: number }[]}
 */
function extractLinks(html) {
  const links = [];
  const lines = html.split('\n');
  const attrRe = /\b(?:href|src)\s*=\s*"([^"]*)"/g;
  for (let i = 0; i < lines.length; i++) {
    let m;
    while ((m = attrRe.exec(lines[i])) !== null) {
      links.push({ value: m[1], line: i + 1 });
    }
  }
  return links;
}

/**
 * Determine if a URL is internal (should be checked) or external (skip).
 * @param {string} url
 * @returns {boolean}
 */
function isInternal(url) {
  if (!url) return false;
  if (url.startsWith('#')) return false; // pure anchor — checked separately
  if (url.startsWith('mailto:')) return false;
  if (url.startsWith('tel:')) return false;
  if (url.startsWith('javascript:')) return false;
  if (url.startsWith('data:')) return false;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Only same-origin (astro.jesspete.shop) is checked
    return url.includes('astro.jesspete.shop');
  }
  // Relative URL — internal
  return true;
}

/**
 * Split a URL into { path, hash }.
 * @param {string} url
 */
function splitUrl(url) {
  const hashIdx = url.indexOf('#');
  if (hashIdx === -1) return { path: url, hash: null };
  return { path: url.slice(0, hashIdx), hash: url.slice(hashIdx + 1) };
}

/**
 * Resolve a relative URL against the source HTML file's path to find the
 * target file in dist/.
 * @param {string} href
 * @param {string} sourceFile absolute path to the .html file containing the link
 * @returns {string|null} absolute path to the target file, or null if not found
 */
function resolveTargetFile(href, sourceFile) {
  // Strip query string
  let clean = href.split('?')[0];
  const { path: urlPath, hash } = splitUrl(clean);

  // If empty path (e.g. href="#foo"), target is the source file itself
  if (urlPath === '') {
    return { file: sourceFile, hash };
  }

  // Normalize: remove leading slash, decode
  let relPath = urlPath;
  if (relPath.startsWith('/')) relPath = relPath.slice(1);

  // Astro static output: /about/ → about/index.html, /about → about/index.html
  // /work/marker-48/ → work/marker-48/index.html
  // /favicon.svg → favicon.svg (asset)
  // /sitemap-index.xml → sitemap-index.xml (asset)
  // /robots.txt → robots.txt (asset)
  let candidate;
  if (relPath.endsWith('/')) {
    // Directory-style URL (e.g. /about/ → about/index.html)
    candidate = posix.join(distDir, relPath, 'index.html');
    if (!existsSync(candidate)) {
      // Fall back to /foo.html for the directory-style URL (rare, e.g. /404/)
      const trimmed = relPath.replace(/\/$/, '');
      if (trimmed) {
        candidate = posix.join(distDir, trimmed + '.html');
      }
    }
  } else if (relPath === '') {
    candidate = posix.join(distDir, 'index.html');
  } else if (
    extname(relPath) === '.html' ||
    extname(relPath) === '.xml' ||
    extname(relPath) === '.txt' ||
    extname(relPath) === '.svg' ||
    extname(relPath) === '.png' ||
    extname(relPath) === '.jpg' ||
    extname(relPath) === '.webp' ||
    extname(relPath) === '.ico'
  ) {
    candidate = posix.join(distDir, relPath);
  } else {
    // Try as directory first (e.g. /work/marker-48 → /work/marker-48/index.html)
    candidate = posix.join(distDir, relPath, 'index.html');
    if (!existsSync(candidate)) {
      // Try as exact file
      candidate = posix.join(distDir, relPath);
    }
    if (!existsSync(candidate)) {
      // Try as .html file (e.g. /404 → /404.html, common for static hosts)
      candidate = posix.join(distDir, relPath + '.html');
    }
  }

  if (!existsSync(candidate)) return null;
  return { file: candidate, hash };
}

/**
 * Verify a hash anchor exists in the target HTML file's id attributes.
 * @param {string} file absolute path to HTML file
 * @param {string} hash anchor id (without #)
 * @returns {Promise<boolean>}
 */
async function hashExists(file, hash) {
  if (!hash) return true; // no hash — fine
  try {
    const html = await readFile(file, 'utf8');
    // Match id="..." or id='...' (case-sensitive)
    const idRe = /\bid\s*=\s*["']([^"']+)["']/g;
    let m;
    while ((m = idRe.exec(html)) !== null) {
      if (m[1] === hash) return true;
    }
    return false;
  } catch {
    return false;
  }
}

// === Main ===
const htmlFiles = await listHtmlFiles(distDir);
if (htmlFiles.length === 0) {
  console.error(`✗ no .html files found in ${distDir}`);
  process.exit(2);
}

/** @type {Map<string, { href: string, line: number, source: string }[]>} */
const broken = new Map();
let checked = 0;
let skipped = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const links = extractLinks(html);
  for (const link of links) {
    if (!isInternal(link.value)) {
      skipped++;
      continue;
    }
    // Strip protocol/host if same-origin
    let href = link.value;
    if (href.startsWith('https://astro.jesspete.shop')) {
      href = href.slice('https://astro.jesspete.shop'.length);
    }
    const resolved = resolveTargetFile(href, file);
    if (!resolved) {
      const rel = posix.relative(ROOT, file);
      if (!broken.has(rel)) broken.set(rel, []);
      broken.get(rel).push({ href: link.value, line: link.line, source: file });
      checked++;
      continue;
    }
    if (resolved.hash) {
      const ok = await hashExists(resolved.file, resolved.hash);
      if (!ok) {
        const rel = posix.relative(ROOT, file);
        if (!broken.has(rel)) broken.set(rel, []);
        broken.get(rel).push({
          href: link.value,
          line: link.line,
          source: file,
          reason: `anchor #${resolved.hash} not found in target`,
        });
      }
    }
    checked++;
  }
}

console.log(`\nLink check complete.`);
console.log(`  Dist:     ${distDir}`);
console.log(`  Files:    ${htmlFiles.length}`);
console.log(`  Links checked: ${checked}`);
console.log(`  Links skipped (external): ${skipped}`);
console.log(`  Broken:   ${[...broken.values()].reduce((n, arr) => n + arr.length, 0)}\n`);

if (broken.size === 0) {
  console.log('✓ All internal links resolve.');
  process.exit(0);
}

for (const [source, links] of broken) {
  console.log(`✗ ${source}`);
  for (const link of links) {
    console.log(`   line ${link.line}: ${link.href}${link.reason ? ` — ${link.reason}` : ''}`);
  }
}

process.exit(1);
