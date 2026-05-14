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

if (!domain || !token) {
  throw new Error('Missing MYSHOPIFY_DOMAIN/SHOPIFY_FLAG_STORE or SHOPIFY_ACCESS_TOKEN in .env');
}

const danishWords = [
  'guld',
  'hvidguld',
  'rosaguld',
  'brillantslebne',
  'diamant',
  'diamanter',
  'armbånd',
  'armband',
  'ørering',
  'halskæde',
  'smykke',
  'smykker',
  'retur',
  'levering',
  'nyhedsbrev',
  'tilføj',
  'kurv',
  'tak',
  'køb',
  'vælg',
  'udsolgt',
  'venstre',
  'højre',
  'københavn',
  'alliancering',
  'vielsesring',
  'forlovelsesring',
  'kundeservice',
  'størrelse',
  'størrelser',
  'beskrivelse',
  'materiale',
  'diamantspecifikation',
  'lager',
  'betal',
  'betaling',
  'fragt',
  'afhentning',
  'forsendelse',
  'varer',
  'vare',
  'pris',
  'inkl',
  'moms',
];

const wordPattern = new RegExp(`\\b(${danishWords.join('|')})\\b`, 'iu');
const slugPattern = /(alliancering|tennisarmband|armband|hvidguld|rosaguld|oerering|orering|halskaede|smykke|smykker|guld)/iu;
const charPattern = /[æøåÆØÅ]/u;

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inspectText(area, object, field, value, results) {
  if (value == null) return;
  const text = stripHtml(value);
  if (!text) return;
  if (charPattern.test(text) || wordPattern.test(text) || slugPattern.test(text)) {
    const match = text.match(charPattern) || text.match(wordPattern) || text.match(slugPattern);
    results.push({ area, object, field, match: match?.[0] || '', text });
  }
}

async function graphql(query, variables = {}) {
  const res = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (!res.ok || body.errors) {
    throw new Error(JSON.stringify(body.errors || body, null, 2));
  }
  return body.data;
}

async function rest(pathname) {
  const res = await fetch(`https://${domain}/admin/api/${apiVersion}${pathname}`, {
    headers: { 'X-Shopify-Access-Token': token },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(body, null, 2));
  }
  return body;
}

async function paginate(connectionName, query, variables = {}, pageSize = 50) {
  const out = [];
  let after = null;
  while (true) {
    const data = await graphql(query, { ...variables, first: pageSize, after });
    const conn = data[connectionName];
    out.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return out;
}

const productQuery = `
query Products($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    nodes {
      title
      handle
      descriptionHtml
      productType
      vendor
      tags
      seo { title description }
      options { name values }
      variants(first: 250) {
        nodes {
          title
          sku
          selectedOptions { name value }
        }
      }
      metafields(first: 250) {
        nodes { namespace key value type }
      }
      media(first: 100) {
        nodes {
          alt
          ... on MediaImage { image { altText } }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const collectionQuery = `
query Collections($first: Int!, $after: String) {
  collections(first: $first, after: $after) {
    nodes {
      title
      handle
      descriptionHtml
      seo { title description }
      image { altText }
      metafields(first: 250) { nodes { namespace key value type } }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const pageQuery = `
query Pages($first: Int!, $after: String) {
  pages(first: $first, after: $after) {
    nodes {
      title
      handle
      body
      metafields(first: 250) { nodes { namespace key value type } }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const menuQuery = `
query Menus($first: Int!, $after: String) {
  menus(first: $first, after: $after) {
    nodes {
      title
      handle
      items {
        title
        url
        items {
          title
          url
          items {
            title
            url
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const blogQuery = `
query Blogs($first: Int!, $after: String) {
  blogs(first: $first, after: $after) {
    nodes {
      title
      handle
      articles(first: 50) {
        nodes {
          title
          handle
          body
          summary
          tags
          image { altText }
          metafields(first: 50) { nodes { namespace key value type } }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const metaobjectDefinitionQuery = `
query MetaobjectDefinitions($first: Int!, $after: String) {
  metaobjectDefinitions(first: $first, after: $after) {
    nodes { type name }
    pageInfo { hasNextPage endCursor }
  }
}`;

const metaobjectQuery = `
query Metaobjects($type: String!, $first: Int!, $after: String) {
  metaobjects(type: $type, first: $first, after: $after) {
    nodes {
      type
      handle
      displayName
      fields { key value type }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const localThemeDirs = [
  'bjerrehuus-theme/config',
  'bjerrehuus-theme/templates',
  'bjerrehuus-theme/sections',
  'bjerrehuus-theme/snippets',
  'bjerrehuus-theme/assets',
  'bjerrehuus-theme/layout',
].map((dir) => path.join(root, dir));

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(liquid|json|js|css|html|yml|txt)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function inspectLocal(results) {
  for (const file of localThemeDirs.flatMap((dir) => walk(dir))) {
    const rel = path.relative(root, file);
    if (/bjerrehuus-theme\/locales\/(?!en\.default\b)/.test(rel)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (charPattern.test(line) || wordPattern.test(line)) {
        inspectText('Local theme files', rel, `line ${i + 1}`, line, results);
      }
    });
  }
}

async function inspectRemoteTheme(results, themeId) {
  const listing = await rest(`/themes/${themeId}/assets.json?fields=key`);
  const textAssets = (listing.assets || [])
    .map((asset) => asset.key)
    .filter((key) => /\.(liquid|json|js|css|html|yml|txt)$/i.test(key))
    .filter((key) => !/^locales\/(?!en\.default\b)/.test(key));

  for (const key of textAssets) {
    const asset = await rest(`/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    const value = asset.asset?.value || '';
    value.split(/\r?\n/).forEach((line, i) => {
      if (charPattern.test(line) || wordPattern.test(line)) {
        inspectText('Remote dev theme files', key, `line ${i + 1}`, line, results);
      }
    });
  }
}

function inspectMenuItems(menu, items, results, prefix = '') {
  items.forEach((item, idx) => {
    const label = `${menu.title} ${prefix}${idx + 1}`;
    inspectText('Navigation menus', label, 'item title', item.title, results);
    if (item.items?.length) inspectMenuItems(menu, item.items, results, `${idx + 1}.`);
  });
}

async function main() {
  const results = [];
  const checked = [];

  inspectLocal(results);
  checked.push('Local theme files');

  await inspectRemoteTheme(results, '196302537038');
  checked.push('Remote dev theme files');

  const shopData = await graphql(`{
    shop {
      name
      email
      contactEmail
      myshopifyDomain
      currencyCode
      primaryDomain { host url }
    }
    shopLocales { locale name primary published }
  }`);
  inspectText('Shop settings', 'Shop', 'name', shopData.shop.name, results);
  inspectText('Shop settings', 'Shop', 'email', shopData.shop.email, results);
  inspectText('Shop settings', 'Shop', 'contactEmail', shopData.shop.contactEmail, results);
  for (const locale of shopData.shopLocales) {
    inspectText('Store locales', locale.locale, 'name', locale.name, results);
    if (locale.locale.toLowerCase().startsWith('da') || /danish|dansk/i.test(locale.name)) {
      results.push({
        area: 'Store locales',
        object: locale.locale,
        field: 'published/primary',
        match: locale.locale,
        text: JSON.stringify(locale),
      });
    }
  }
  checked.push('Shop settings', 'Store locales');

  const products = await paginate('products', productQuery, {}, 50);
  for (const product of products) {
    const obj = `Product ${product.handle}`;
    inspectText('Products', obj, 'handle', product.handle, results);
    inspectText('Products', obj, 'title', product.title, results);
    inspectText('Products', obj, 'descriptionHtml', product.descriptionHtml, results);
    inspectText('Products', obj, 'productType', product.productType, results);
    inspectText('Products', obj, 'vendor', product.vendor, results);
    inspectText('Products', obj, 'seo.title', product.seo?.title, results);
    inspectText('Products', obj, 'seo.description', product.seo?.description, results);
    product.tags?.forEach((tag) => inspectText('Products', obj, 'tag', tag, results));
    product.options?.forEach((opt) => {
      inspectText('Products', obj, 'option name', opt.name, results);
      opt.values?.forEach((value) => inspectText('Products', obj, `option ${opt.name} value`, value, results));
    });
    product.variants?.nodes?.forEach((variant) => {
      inspectText('Products', `${obj} variant ${variant.sku || variant.title}`, 'variant title', variant.title, results);
      variant.selectedOptions?.forEach((opt) => {
        inspectText('Products', `${obj} variant ${variant.sku || variant.title}`, `selected option ${opt.name}`, opt.value, results);
      });
    });
    product.metafields?.nodes?.forEach((field) => {
      inspectText('Products', obj, `metafield ${field.namespace}.${field.key}`, field.value, results);
    });
    product.media?.nodes?.forEach((media, idx) => {
      inspectText('Products', obj, `media ${idx + 1} alt`, media.alt || media.image?.altText, results);
    });
  }
  checked.push('Products');

  const collections = await paginate('collections', collectionQuery, {}, 50);
  for (const collection of collections) {
    const obj = `Collection ${collection.handle}`;
    inspectText('Collections', obj, 'handle', collection.handle, results);
    inspectText('Collections', obj, 'title', collection.title, results);
    inspectText('Collections', obj, 'descriptionHtml', collection.descriptionHtml, results);
    inspectText('Collections', obj, 'seo.title', collection.seo?.title, results);
    inspectText('Collections', obj, 'seo.description', collection.seo?.description, results);
    inspectText('Collections', obj, 'image.altText', collection.image?.altText, results);
    collection.metafields?.nodes?.forEach((field) => {
      inspectText('Collections', obj, `metafield ${field.namespace}.${field.key}`, field.value, results);
    });
  }
  checked.push('Collections');

  const pages = await paginate('pages', pageQuery, {}, 50);
  for (const page of pages) {
    const obj = `Page ${page.handle}`;
    inspectText('Pages', obj, 'handle', page.handle, results);
    inspectText('Pages', obj, 'title', page.title, results);
    inspectText('Pages', obj, 'body', page.body, results);
    page.metafields?.nodes?.forEach((field) => {
      inspectText('Pages', obj, `metafield ${field.namespace}.${field.key}`, field.value, results);
    });
  }
  checked.push('Pages');

  const menus = await paginate('menus', menuQuery, {}, 50);
  for (const menu of menus) {
    inspectText('Navigation menus', `Menu ${menu.handle}`, 'title', menu.title, results);
    inspectMenuItems(menu, menu.items || [], results);
  }
  checked.push('Navigation menus');

  const blogs = await paginate('blogs', blogQuery, {}, 50);
  for (const blog of blogs) {
    inspectText('Blog articles', `Blog ${blog.handle}`, 'title', blog.title, results);
    for (const article of blog.articles?.nodes || []) {
      const obj = `Article ${blog.handle}/${article.handle}`;
      inspectText('Blog articles', obj, 'title', article.title, results);
      inspectText('Blog articles', obj, 'body', article.body, results);
      inspectText('Blog articles', obj, 'summary', article.summary, results);
      inspectText('Blog articles', obj, 'image.altText', article.image?.altText, results);
      article.tags?.forEach((tag) => inspectText('Blog articles', obj, 'tag', tag, results));
      article.metafields?.nodes?.forEach((field) => {
        inspectText('Blog articles', obj, `metafield ${field.namespace}.${field.key}`, field.value, results);
      });
    }
  }
  checked.push('Blog articles');

  const definitions = await paginate('metaobjectDefinitions', metaobjectDefinitionQuery, {}, 50);
  for (const def of definitions) {
    inspectText('Metaobjects', `Definition ${def.type}`, 'name', def.name, results);
    const metaobjects = await paginate('metaobjects', metaobjectQuery, { type: def.type }, 50);
    for (const metaobject of metaobjects) {
      const obj = `Metaobject ${metaobject.type}/${metaobject.handle}`;
      inspectText('Metaobjects', obj, 'displayName', metaobject.displayName, results);
      metaobject.fields?.forEach((field) => {
        inspectText('Metaobjects', obj, `field ${field.key}`, field.value, results);
      });
    }
  }
  checked.push('Metaobjects');

  const policies = await rest('/policies.json');
  for (const policy of policies.policies || []) {
    inspectText('Shop policies', policy.title || policy.handle, 'title', policy.title, results);
    inspectText('Shop policies', policy.title || policy.handle, 'body', policy.body, results);
  }
  checked.push('Shop policies');

  const grouped = results.reduce((acc, row) => {
    acc[row.area] ||= [];
    acc[row.area].push(row);
    return acc;
  }, {});
  console.log(JSON.stringify({
    checked,
    counts: {
      products: products.length,
      collections: collections.length,
      pages: pages.length,
      menus: menus.length,
      blogs: blogs.length,
      metaobjectDefinitions: definitions.length,
      policies: policies.policies?.length || 0,
      violations: results.length,
    },
    shopLocales: shopData.shopLocales,
    violations: grouped,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
