#!/usr/bin/env node
// Static site build for mitchgainey.com. No dependencies.
//
//   node build.mjs                 → dist/  (production, for Cloudflare Pages)
//   node build.mjs --preview       → site/  (noindex preview, for GitHub Pages)
//
// Pages live in src/pages/*.html. Each starts with a JSON front-matter comment:
//   <!--{ "title": "...", "description": "...", "path": "about/", "nav": "about" }-->
// Use {{root}} inside page content for links to other pages and assets.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const PREVIEW = args.includes('--preview');
const OUT = join(ROOT, args.includes('--out') ? args[args.indexOf('--out') + 1] : PREVIEW ? 'site' : 'dist');
const DOMAIN = 'https://www.mitchgainey.com';
const VERSION = Date.now().toString(36);

const layout = readFileSync(join(ROOT, 'src/layout.html'), 'utf8');
const pagesDir = join(ROOT, 'src/pages');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'src/assets'), join(OUT, 'assets'), { recursive: true });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const pages = [];

for (const file of readdirSync(pagesDir).filter(f => f.endsWith('.html')).sort()) {
  const raw = readFileSync(join(pagesDir, file), 'utf8');
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->\s*/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const fm = JSON.parse(m[1]);
  const body = raw.slice(m[0].length);
  const path = fm.path;                       // '' | 'about/' | 'resources/post/' | '404.html'
  const is404 = path === '404.html';
  const depth = is404 ? 0 : path.split('/').filter(Boolean).length;
  const root = is404 ? (PREVIEW ? './' : '/') : depth ? '../'.repeat(depth) : './';
  const canonical = DOMAIN + '/' + (is404 ? '' : path);

  const navKeys = ['about', 'services', 'ebeft', 'focusing', 'resources', 'contact'];
  let html = layout
    .replace('{{content}}', body)
    .replace(/\{\{cur:(\w+)\}\}/g, (_, k) => (fm.nav === k ? ' aria-current="page"' : ''))
    .replace('{{ddcur}}', ['ebeft', 'focusing'].includes(fm.nav) ? ' current' : '')
    .replace('{{robots}}', PREVIEW || is404 ? '<meta name="robots" content="noindex, nofollow">\n' : '')
    .replace('{{schema}}', fm.schema ? `<script type="application/ld+json">${JSON.stringify(fm.schema)}</script>\n` : '')
    .replaceAll('{{title}}', esc(fm.title))
    .replaceAll('{{description}}', esc(fm.description))
    .replaceAll('{{canonical}}', canonical)
    .replaceAll('{{og_type}}', fm.og_type || 'website')
    .replaceAll('{{og_image}}', DOMAIN + '/assets/img/' + (fm.og_image || 'hero-street.jpg'))
    .replaceAll('{{footer_class}}', fm.footer_class ? ' ' + fm.footer_class : '')
    .replaceAll('{{slug}}', fm.slug || (path.replace(/\/$/, '').replace(/\//g, '-') || 'home'))
    .replaceAll('{{year}}', new Date().getFullYear())
    .replaceAll('{{version}}', VERSION)
    .replaceAll('{{root}}', root);

  const leftover = html.match(/\{\{[^}]+\}\}/);
  if (leftover) throw new Error(`${file}: unreplaced token ${leftover[0]}`);

  const dest = is404 ? join(OUT, '404.html') : join(OUT, path, 'index.html');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html);
  if (!is404) pages.push({ path, priority: fm.priority ?? (depth === 0 ? 1 : 0.7), lastmod: fm.lastmod });
}

// Cloudflare Pages extras
writeFileSync(join(OUT, '_redirects'), readFileSync(join(ROOT, 'src/_redirects'), 'utf8'));
writeFileSync(join(OUT, '_headers'), readFileSync(join(ROOT, 'src/_headers'), 'utf8'));
writeFileSync(join(OUT, 'robots.txt'), PREVIEW
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);
if (!PREVIEW) {
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(OUT, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages.map(p => `  <url><loc>${DOMAIN}/${p.path}</loc><lastmod>${p.lastmod || today}</lastmod><priority>${p.priority}</priority></url>`).join('\n') +
    '\n</urlset>\n');
}

const size = d => readdirSync(d).reduce((n, f) => { const p = join(d, f); return n + (statSync(p).isDirectory() ? size(p) : 1); }, 0);
console.log(`Built ${pages.length} pages + 404 → ${OUT.replace(ROOT + '/', '')}/ (${size(OUT)} files, ${PREVIEW ? 'preview/noindex' : 'production'})`);
