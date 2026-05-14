#!/usr/bin/env node
/**
 * Full content import: pages, collections, products (with variants/media/metafields), menus.
 * Reads from target-before/admin-export.json (frozen-store snapshot).
 * Writes to the store configured in MYSHOPIFY_DOMAIN + SHOPIFY_ACCESS_TOKEN.
 *
 * Usage:
 *   node --env-file=.env tools/migration/import-content.mjs             # dry run
 *   node --env-file=.env tools/migration/import-content.mjs --apply     # live import
 *   node --env-file=.env tools/migration/import-content.mjs --apply --kind=pages
 *   node --env-file=.env tools/migration/import-content.mjs --apply --kind=collections
 *   node --env-file=.env tools/migration/import-content.mjs --apply --kind=products
 *   node --env-file=.env tools/migration/import-content.mjs --apply --kind=menus
 *   node --env-file=.env tools/migration/import-content.mjs --apply --kind=policies
 */

import path from 'node:path';
import process from 'node:process';
import { parseArgs, isApply, EXPORT_ROOT, appendLog, storeConfig, requireStoreConfig } from './shared.mjs';

const args = parseArgs();
const apply = isApply(args);
const kind = args.kind || 'all';

console.log(`import-content:${kind} [${apply ? 'APPLY' : 'DRY-RUN'}]`);

const sourceFile = path.join(EXPORT_ROOT, 'target-before/admin-export.json');
const source = JSON.parse(await (await import('node:fs/promises')).readFile(sourceFile, 'utf8'));

const cfg = storeConfig('target');
requireStoreConfig(cfg);

const BASE = `https://${cfg.domain}/admin/api/2026-04`;
const HEADERS = { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': cfg.token };

async function gql(query, variables = {}) {
  const res = await fetch(`https://${cfg.domain}/admin/api/2026-04/graphql.json`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function rest(method, endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`REST ${method} ${endpoint} ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function getExistingHandles(resource) {
  // Returns a Set of existing handles via REST
  let handles = new Set();
  let url = `${BASE}/${resource}.json?limit=250&fields=id,handle`;
  while (url) {
    const res = await fetch(url, { headers: HEADERS });
    const json = await res.json();
    const items = json[resource] || [];
    for (const item of items) handles.add(item.handle);
    const link = res.headers.get('link') || '';
    const next = link.match(/<([^>]+)>;\s*rel="next"/)?.[1];
    url = next || null;
  }
  return handles;
}

// ── Pages ────────────────────────────────────────────────────────────────────

async function importPages() {
  const skip = new Set(['contact']); // already exists as default
  const pages = source.pages.filter(p => !skip.has(p.handle));
  const existing = apply ? await getExistingHandles('pages') : new Set();

  let created = 0, skipped = 0, errors = [];
  for (const page of pages) {
    if (existing.has(page.handle)) { skipped++; continue; }
    const payload = {
      page: {
        handle: page.handle,
        title: page.title,
        body_html: page.body || '',
        template_suffix: page.templateSuffix || '',
        published: page.isPublished ?? true,
      }
    };
    if (!apply) { console.log(`  [dry] PAGE ${page.handle}`); skipped++; continue; }
    try {
      await rest('POST', '/pages.json', payload);
      console.log(`  CREATED page: ${page.handle}`);
      created++;
    } catch (e) {
      console.error(`  ERROR page ${page.handle}:`, e.message);
      errors.push(`page:${page.handle}: ${e.message}`);
    }
  }
  console.log(`Pages: ${created} created, ${skipped} skipped, ${errors.length} errors`);
  return errors;
}

// ── Policies ─────────────────────────────────────────────────────────────────

const POLICY_FIELD_MAP = {
  'Privacy policy': 'privacy_policy',
  'Refund policy': 'refund_policy',
  'Shipping policy': 'shipping_policy',
  'Terms of service': 'terms_of_service',
  'Contact information': 'contact_information',
  'Legal notice': 'legal_notice',
};

const POLICY_TYPE_MAP = {
  'Privacy policy': 'PRIVACY_POLICY',
  'Refund policy': 'REFUND_POLICY',
  'Shipping policy': 'SHIPPING_POLICY',
  'Terms of service': 'TERMS_OF_SERVICE',
  'Contact information': 'CONTACT_INFORMATION',
  'Legal notice': 'LEGAL_NOTICE',
};

async function importPolicies() {
  let created = 0, errors = [];
  const policies = source.policies.filter(p => POLICY_TYPE_MAP[p.title] && p.body);
  if (!apply) {
    console.log('  [dry] POLICIES:', policies.map(p => p.title).join(', '));
    return [];
  }
  for (const policy of policies) {
    const type = POLICY_TYPE_MAP[policy.title];
    try {
      const mutation = `
        mutation shopPolicyUpdate($shopPolicy: ShopPolicyInput!) {
          shopPolicyUpdate(shopPolicy: $shopPolicy) {
            shopPolicy { id type }
            userErrors { field message }
          }
        }`;
      const result = await gql(mutation, { shopPolicy: { type, body: policy.body } });
      const errs = result.shopPolicyUpdate?.userErrors || [];
      if (errs.length) throw new Error(errs.map(e => e.message).join('; '));
      console.log(`  UPDATED policy: ${policy.title}`);
      created++;
    } catch (e) {
      console.error(`  ERROR policy ${policy.title}:`, e.message);
      errors.push(`policy:${policy.title}: ${e.message}`);
    }
  }
  console.log(`Policies: ${created} set, ${errors.length} errors`);
  return errors;
}

// ── Collections ──────────────────────────────────────────────────────────────

const SKIP_COLLECTIONS = new Set(['frontpage']); // auto-created by Shopify

async function importCollections() {
  const colls = source.collections.filter(c => !SKIP_COLLECTIONS.has(c.handle));
  const existing = apply ? await getExistingHandles('custom_collections') : new Set();
  // Also check smart collections
  const existingSmart = apply ? await getExistingHandles('smart_collections') : new Set();
  const allExisting = new Set([...existing, ...existingSmart]);

  let created = 0, skipped = 0, errors = [];
  for (const coll of colls) {
    if (allExisting.has(coll.handle)) { skipped++; continue; }

    const isAutomated = coll.ruleSet != null;
    const base = {
      handle: coll.handle,
      title: coll.title,
      body_html: coll.descriptionHtml || '',
      sort_order: (coll.sortOrder || 'BEST_SELLING').toLowerCase().replace('_', '-'),
      template_suffix: coll.templateSuffix || '',
    };
    if (coll.seo?.title) base.metafields = base.metafields || [];

    if (!apply) { console.log(`  [dry] COLLECTION ${coll.handle} (${isAutomated ? 'smart' : 'custom'})`); skipped++; continue; }

    try {
      if (isAutomated) {
        const rules = coll.ruleSet.rules.map(r => ({
          column: r.column.toLowerCase(),
          relation: r.relation.toLowerCase(),
          condition: r.condition,
        }));
        await rest('POST', '/smart_collections.json', {
          smart_collection: { ...base, rules, disjunctive: coll.ruleSet.appliedDisjunctively ?? false }
        });
      } else {
        await rest('POST', '/custom_collections.json', { custom_collection: base });
      }
      console.log(`  CREATED collection: ${coll.handle}`);
      created++;
    } catch (e) {
      console.error(`  ERROR collection ${coll.handle}:`, e.message);
      errors.push(`collection:${coll.handle}: ${e.message}`);
    }
  }
  console.log(`Collections: ${created} created, ${skipped} skipped, ${errors.length} errors`);
  return errors;
}

// ── Products ─────────────────────────────────────────────────────────────────

async function importProducts() {
  const existing = apply ? await getExistingHandles('products') : new Set();
  let created = 0, skipped = 0, errors = [];

  for (const product of source.products) {
    if (existing.has(product.handle)) { skipped++; continue; }
    if (!apply) { console.log(`  [dry] PRODUCT ${product.handle} (${product.variants?.nodes?.length || 0} variants)`); skipped++; continue; }

    // Build variants
    const variants = (product.variants?.nodes || []).map(v => {
      const opt = {};
      v.selectedOptions?.forEach((o, i) => { opt[`option${i + 1}`] = o.value; });
      return {
        price: v.price,
        compare_at_price: v.compareAtPrice || null,
        sku: v.sku || null,
        barcode: v.barcode || null,
        taxable: v.taxable ?? true,
        inventory_management: v.inventoryItem?.tracked ? 'shopify' : null,
        inventory_policy: (v.inventoryPolicy || 'DENY').toLowerCase(),
        ...opt,
      };
    });

    // Build options — REST API expects array of {name:} objects
    const options = (product.options || []).map(o => ({ name: o.name }));

    // Build images from media
    const images = (product.media?.nodes || [])
      .filter(m => m.mediaContentType === 'IMAGE' && m.image?.url)
      .map(m => ({ src: m.image.url, alt: m.alt || m.image?.altText || '' }));

    const payload = {
      product: {
        handle: product.handle,
        title: product.title,
        body_html: product.descriptionHtml || '',
        vendor: product.vendor || 'Bjerrehuus Fine Jewellery',
        product_type: product.productType || '',
        tags: (product.tags || []).join(', '),
        status: (product.status || 'ACTIVE').toLowerCase(),
        template_suffix: product.templateSuffix || '',
        options,
        variants,
        images,
      }
    };

    try {
      const created_product = await rest('POST', '/products.json', payload);
      const newId = created_product.product.id;
      console.log(`  CREATED product: ${product.handle} (id ${newId})`);
      created++;

      // Set metafields
      const mfs = product.metafields?.nodes || [];
      for (const mf of mfs) {
        try {
          await rest('POST', `/products/${newId}/metafields.json`, {
            metafield: {
              namespace: mf.namespace,
              key: mf.key,
              type: mf.type,
              value: mf.value,
            }
          });
        } catch (e) {
          console.warn(`    WARN metafield ${mf.namespace}.${mf.key} on ${product.handle}:`, e.message);
        }
      }
    } catch (e) {
      console.error(`  ERROR product ${product.handle}:`, e.message);
      errors.push(`product:${product.handle}: ${e.message}`);
    }
  }
  console.log(`Products: ${created} created, ${skipped} skipped, ${errors.length} errors`);
  return errors;
}

// ── Menus ─────────────────────────────────────────────────────────────────────

const IMPORT_MENUS = new Set(['main-menu', 'footer-menu-brand', 'footer-menu-care']);

async function importMenus() {
  const menus = source.menus.filter(m => IMPORT_MENUS.has(m.handle));
  let created = 0, skipped = 0, errors = [];

  // Check existing via GraphQL
  let existingHandles = new Set();
  if (apply) {
    const data = await gql(`{ menus(first: 50) { nodes { handle } } }`);
    existingHandles = new Set((data.menus?.nodes || []).map(m => m.handle));
  }

  for (const menu of menus) {
    if (existingHandles.has(menu.handle)) { skipped++; continue; }
    if (!apply) { console.log(`  [dry] MENU ${menu.handle} (${menu.items?.length || 0} items)`); skipped++; continue; }

    function buildItems(items) {
      return (items || []).map(item => ({
        title: item.title,
        type: item.type || 'HTTP',
        url: item.url || '/',
        items: buildItems(item.items),
      }));
    }

    try {
      const mutation = `
        mutation menuCreate($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
          menuCreate(title: $title, handle: $handle, items: $items) {
            menu { id handle title }
            userErrors { field message }
          }
        }`;
      const result = await gql(mutation, {
        title: menu.title,
        handle: menu.handle,
        items: buildItems(menu.items),
      });
      const errs = result.menuCreate?.userErrors || [];
      if (errs.length) throw new Error(errs.map(e => e.message).join('; '));
      console.log(`  CREATED menu: ${menu.handle}`);
      created++;
    } catch (e) {
      console.error(`  ERROR menu ${menu.handle}:`, e.message);
      errors.push(`menu:${menu.handle}: ${e.message}`);
    }
  }
  console.log(`Menus: ${created} created, ${skipped} skipped, ${errors.length} errors`);
  return errors;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const allErrors = [];

if (kind === 'all' || kind === 'pages') allErrors.push(...await importPages());
if (kind === 'all' || kind === 'policies') allErrors.push(...await importPolicies());
if (kind === 'all' || kind === 'collections') allErrors.push(...await importCollections());
if (kind === 'all' || kind === 'products') allErrors.push(...await importProducts());
if (kind === 'all' || kind === 'menus') allErrors.push(...await importMenus());

if (allErrors.length) {
  console.log(`\n${allErrors.length} total error(s):`);
  allErrors.forEach(e => console.log(' -', e));
  await appendLog('import-content', [`ERRORS:\n${allErrors.join('\n')}`]);
} else {
  console.log('\nAll done, no errors.');
  await appendLog('import-content', [`${kind} import completed successfully [${apply ? 'APPLY' : 'DRY-RUN'}]`]);
}
