#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { EXPORT_ROOT, ROOT, parseArgs, writeJson } from './shared.mjs';

const args = parseArgs();
const themePath = path.join(ROOT, args.theme || 'bjerrehuus-theme');
const output = args.output || path.join(EXPORT_ROOT, 'url-replacement-map.json');
const urlPattern = /https?:\/\/[^"')\s]+/g;
const frozenPrefix = 'https://cdn.shopify.com/s/files/1/1032/3004/6542/';
const scanDirs = ['config', 'templates', 'sections', 'snippets'];
const entries = [];

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(filePath);
    } else if (/\.(json|liquid)$/.test(entry.name)) {
      const text = await fs.readFile(filePath, 'utf8');
      const urls = text.match(urlPattern) || [];
      for (const url of urls) {
        const source = url.startsWith(frozenPrefix)
          ? 'frozen-store-cdn'
          : url.includes('squarespace')
            ? 'squarespace'
            : 'other';
        if (source === 'other') continue;
        entries.push({
          file: path.relative(ROOT, filePath),
          url,
          source,
          proposedReplacement: '',
          status: source === 'frozen-store-cdn' ? 'replace-before-publish' : 'unavailable-replace-now',
        });
      }
    }
  }
}

for (const dir of scanDirs) {
  await walk(path.join(themePath, dir));
}

const unique = Array.from(new Map(entries.map((entry) => [`${entry.file}:${entry.url}`, entry])).values());
await writeJson(output, {
  generatedAt: new Date().toISOString(),
  theme: path.relative(ROOT, themePath),
  frozenStoreCdnPrefix: frozenPrefix,
  entries: unique,
});

console.log(`Wrote ${output} (${unique.length} URL references)`);
