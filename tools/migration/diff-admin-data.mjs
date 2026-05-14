#!/usr/bin/env node
import path from 'node:path';
import { EXPORT_ROOT, parseArgs, readJson, writeJson } from './shared.mjs';

const args = parseArgs();
const sourcePath = args.source || path.join(EXPORT_ROOT, 'source/admin-normalized.json');
const targetPath = args.target || path.join(EXPORT_ROOT, 'target-after/admin-normalized.json');
const output = args.output || path.join(EXPORT_ROOT, 'target-after/admin-diff.json');

const source = await readJson(sourcePath);
const target = await readJson(targetPath);

function diffList(name, sourceItems = [], targetItems = []) {
  const sourceSet = new Set(sourceItems);
  const targetSet = new Set(targetItems);
  return {
    name,
    missingInTarget: sourceItems.filter((item) => !targetSet.has(item)),
    extraInTarget: targetItems.filter((item) => !sourceSet.has(item)),
  };
}

const diff = {
  diffedAt: new Date().toISOString(),
  source: sourcePath,
  target: targetPath,
  counts: {
    source: source.counts,
    target: target.counts,
  },
  lists: [
    diffList('products', source.productHandles, target.productHandles),
    diffList('collections', source.collectionHandles, target.collectionHandles),
    diffList('pages', source.pageHandles, target.pageHandles),
    diffList('menus', source.menuHandles, target.menuHandles),
  ],
};

await writeJson(output, diff);
console.log(`Wrote ${output}`);

