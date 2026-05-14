import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
export const EXPORT_ROOT = path.join(ROOT, 'exports/store-transfer-2026-05-14');
export const MANIFEST_PATH = path.join(EXPORT_ROOT, 'migration-manifest.json');

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith('--')) {
      args._.push(arg);
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split('=');
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    if (inlineValue !== undefined) {
      args[key] = inlineValue;
    } else if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      args[key] = argv[i + 1];
      i += 1;
    } else {
      args[key] = true;
    }
  }

  return args;
}

export function isApply(args) {
  return args.apply === true;
}

export async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (fallback !== null && error.code === 'ENOENT') return fallback;
    throw error;
  }
}

export async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

export async function appendLog(name, lines) {
  const filePath = path.join(EXPORT_ROOT, 'import-logs', `${name}.log`);
  const body = Array.isArray(lines) ? lines.join('\n') : String(lines);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `[${new Date().toISOString()}]\n${body}\n\n`);
  return filePath;
}

export function storeConfig(role) {
  const source = role === 'source';
  const domain = source
    ? process.env.SOURCE_MYSHOPIFY_DOMAIN || process.env.SOURCE_SHOPIFY_FLAG_STORE
    : process.env.MYSHOPIFY_DOMAIN || process.env.SHOPIFY_FLAG_STORE;
  const token = source ? process.env.SOURCE_SHOPIFY_ACCESS_TOKEN : process.env.SHOPIFY_ACCESS_TOKEN;

  return { role, domain, token };
}

export function requireStoreConfig(config) {
  const missing = [];
  if (!config.domain) missing.push(config.role === 'source' ? 'SOURCE_MYSHOPIFY_DOMAIN' : 'MYSHOPIFY_DOMAIN');
  if (!config.token) missing.push(config.role === 'source' ? 'SOURCE_SHOPIFY_ACCESS_TOKEN' : 'SHOPIFY_ACCESS_TOKEN');
  if (missing.length > 0) {
    throw new Error(`Missing ${config.role} store env: ${missing.join(', ')}`);
  }
}

export async function shopifyGraphql(config, query, variables = {}) {
  requireStoreConfig(config);

  const response = await fetch(`https://${config.domain}/admin/api/2026-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': config.token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    throw new Error(JSON.stringify({ status: response.status, errors: payload.errors || payload }, null, 2));
  }

  return payload.data;
}

export async function collectConnection(config, query, rootKey, variables = {}, pageSize = 100) {
  const nodes = [];
  let after = null;

  do {
    const data = await shopifyGraphql(config, query, { ...variables, first: pageSize, after });
    const connection = data[rootKey];
    nodes.push(...connection.nodes);
    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);

  return nodes;
}

export function printMode(scriptName, apply) {
  console.log(`${scriptName}: ${apply ? 'APPLY' : 'DRY RUN'}`);
}
