#!/usr/bin/env node
import path from 'node:path';
import { EXPORT_ROOT, appendLog, isApply, parseArgs, printMode, readJson } from './shared.mjs';

const args = parseArgs();
const apply = isApply(args);
const kind = args.kind || 'all';
const input = args.input || path.join(EXPORT_ROOT, 'source/admin-normalized.json');
const data = await readJson(input);

printMode(`import-content-dry-run:${kind}`, apply);

if (apply) {
  throw new Error('Content import mutations are intentionally locked until restored source data is reviewed. Run without --apply for the Phase 1 checklist.');
}

const lines = [
  `Input: ${input}`,
  `Products queued: ${data.counts?.products || 0}`,
  `Collections queued: ${data.counts?.collections || 0}`,
  `Pages queued: ${data.counts?.pages || 0}`,
  `Menus queued: ${data.counts?.menus || 0}`,
  `Redirects queued: ${data.counts?.urlRedirects || 0}`,
  'Import order: pages/policies -> collections -> products/media/metafields -> menus -> redirects',
];

const logPath = await appendLog(`import-content-${kind}`, lines);
console.log(lines.join('\n'));
console.log(`Logged ${logPath}`);

