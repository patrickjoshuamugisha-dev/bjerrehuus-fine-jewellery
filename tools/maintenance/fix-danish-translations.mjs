import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envText = fs.readFileSync(path.join(root, '.env'), 'utf8');
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx), line.slice(idx + 1)];
    }),
);

const domain = env.MYSHOPIFY_DOMAIN || env.SHOPIFY_FLAG_STORE;
const token = env.SHOPIFY_ACCESS_TOKEN;
const apiVersion = '2024-10';
const themeId = '196302537038';

if (!domain || !token) {
  throw new Error('Missing MYSHOPIFY_DOMAIN/SHOPIFY_FLAG_STORE or SHOPIFY_ACCESS_TOKEN in .env');
}

async function shopify(pathname, options = {}) {
  const res = await fetch(`https://${domain}/admin/api/${apiVersion}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
      ...(options.headers || {}),
    },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${pathname} failed: ${JSON.stringify(body, null, 2)}`);
  }
  return body;
}

async function updateProductHandle(oldHandle, newHandle) {
  const data = await shopify(`/products.json?handle=${encodeURIComponent(oldHandle)}&fields=id,handle,title`);
  const product = data.products?.[0];
  if (!product) {
    console.log(`Product not found for handle ${oldHandle}; skipping`);
    return;
  }
  await shopify(`/products/${product.id}.json`, {
    method: 'PUT',
    body: JSON.stringify({ product: { id: product.id, handle: newHandle } }),
  });
  console.log(`Updated product handle: ${oldHandle} -> ${newHandle}`);
}

async function updateProductImageAlt(productHandle, oldAlt, newAlt) {
  const data = await shopify(`/products.json?handle=${encodeURIComponent(productHandle)}&fields=id,handle,title,images`);
  const product = data.products?.[0];
  if (!product) {
    console.log(`Product not found for image alt update: ${productHandle}; skipping`);
    return;
  }
  const image = product.images?.find((candidate) => candidate.alt === oldAlt || /tennisarmbånd/i.test(candidate.alt || ''));
  if (!image) {
    console.log(`Image alt already clean or image not found for ${productHandle}; skipping`);
    return;
  }
  await shopify(`/products/${product.id}/images/${image.id}.json`, {
    method: 'PUT',
    body: JSON.stringify({ image: { id: image.id, alt: newAlt } }),
  });
  console.log(`Updated image alt on ${productHandle}: ${oldAlt} -> ${newAlt}`);
}

async function updateCollection(oldHandle, newHandle, newTitle) {
  for (const type of ['custom_collections', 'smart_collections']) {
    const data = await shopify(`/${type}.json?handle=${encodeURIComponent(oldHandle)}&fields=id,handle,title`);
    const collection = data[type]?.[0];
    if (!collection) continue;
    const singular = type === 'custom_collections' ? 'custom_collection' : 'smart_collection';
    await shopify(`/${type}/${collection.id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ [singular]: { id: collection.id, handle: newHandle, title: newTitle } }),
    });
    console.log(`Updated ${singular}: ${oldHandle} -> ${newHandle}; title -> ${newTitle}`);
    return;
  }
  console.log(`Collection not found for handle ${oldHandle}; skipping`);
}

async function uploadThemeAsset(key, localPath) {
  const value = fs.readFileSync(path.join(root, localPath), 'utf8');
  await shopify(`/themes/${themeId}/assets.json`, {
    method: 'PUT',
    body: JSON.stringify({ asset: { key, value } }),
  });
  console.log(`Uploaded theme asset: ${key}`);
}

await updateProductHandle('classic-pave-tennisarmband', 'classic-pave-tennis-bracelet');
await updateProductImageAlt('classic-pave-tennis-bracelet', 'Classic pavé tennisarmbånd', 'Classic pavé tennis bracelet');
await updateProductHandle('classic-solitaire-tennisarmband', 'classic-solitaire-tennis-bracelet');
await updateCollection('classic-alliancering', 'classic-wedding-bands', 'Classic – Wedding Bands');

await uploadThemeAsset('sections/shop-layout.liquid', 'bjerrehuus-theme/sections/shop-layout.liquid');
await uploadThemeAsset('assets/email-order-confirmation.html', 'bjerrehuus-theme/assets/email-order-confirmation.html');
await uploadThemeAsset('assets/email-shipping-confirmation.html', 'bjerrehuus-theme/assets/email-shipping-confirmation.html');
