#!/usr/bin/env node
import path from 'node:path';
import { EXPORT_ROOT, parseArgs, readJson, writeJson } from './shared.mjs';

const args = parseArgs();
const input = args.input || path.join(EXPORT_ROOT, 'source/admin-export.json');
const output = args.output || path.join(EXPORT_ROOT, 'source/admin-normalized.json');
const data = await readJson(input);

const byHandle = (items = []) => [...items].sort((a, b) => (a.handle || '').localeCompare(b.handle || ''));

const normalized = {
  normalizedAt: new Date().toISOString(),
  sourceFile: input,
  counts: {
    products: data.products?.length || 0,
    collections: data.collections?.length || 0,
    pages: data.pages?.length || 0,
    menus: data.menus?.length || 0,
    policies: data.policies?.length || 0,
    urlRedirects: data.urlRedirects?.length || 0,
  },
  productHandles: byHandle(data.products).map((product) => product.handle),
  collectionHandles: byHandle(data.collections).map((collection) => collection.handle),
  pageHandles: byHandle(data.pages).map((page) => page.handle),
  menuHandles: byHandle(data.menus).map((menu) => menu.handle),
  policyTypes: [...(data.policies || [])].map((policy) => policy.type).sort(),
  products: byHandle(data.products).map((product) => ({
    handle: product.handle,
    title: product.title,
    status: product.status,
    productType: product.productType,
    vendor: product.vendor,
    templateSuffix: product.templateSuffix,
    variantCount: product.variants?.nodes?.length || 0,
    mediaCount: product.media?.nodes?.length || 0,
    metafields: (product.metafields?.nodes || []).map(({ namespace, key, type, value }) => ({ namespace, key, type, value })),
  })),
};

await writeJson(output, normalized);
console.log(`Wrote ${output}`);
