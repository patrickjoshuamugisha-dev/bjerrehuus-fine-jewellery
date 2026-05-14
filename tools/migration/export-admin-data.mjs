#!/usr/bin/env node
import path from 'node:path';
import { EXPORT_ROOT, collectConnection, parseArgs, printMode, shopifyGraphql, storeConfig, writeJson } from './shared.mjs';

const args = parseArgs();
const role = args.role === 'source' ? 'source' : 'target';
const config = storeConfig(role);
const folder = role === 'source' ? 'source' : 'target-before';
const output = args.output || path.join(EXPORT_ROOT, folder, 'admin-export.json');

const SHOP_QUERY = `#graphql
query ShopSnapshot {
  shop {
    name
    myshopifyDomain
    primaryDomain {
      url
      host
    }
    currencyCode
  }
}`;

const METAFIELD_DEFINITIONS_QUERY = `#graphql
query ProductMetafieldDefinitions($first: Int!, $after: String) {
  metafieldDefinitions(first: $first, after: $after, ownerType: PRODUCT) {
    nodes {
      id
      namespace
      key
      name
      description
      type {
        name
        category
      }
      validations {
        name
        value
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const PRODUCTS_QUERY = `#graphql
query ProductsSnapshot($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    nodes {
      id
      handle
      title
      descriptionHtml
      vendor
      productType
      tags
      status
      templateSuffix
      seo {
        title
        description
      }
      options {
        name
        values
      }
      media(first: 50) {
        nodes {
          alt
          mediaContentType
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          barcode
          price
          compareAtPrice
          taxable
          inventoryPolicy
          selectedOptions {
            name
            value
          }
          inventoryItem {
            id
            tracked
          }
        }
      }
      metafields(first: 100, namespace: "custom") {
        nodes {
          namespace
          key
          type
          value
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const COLLECTIONS_QUERY = `#graphql
query CollectionsSnapshot($first: Int!, $after: String) {
  collections(first: $first, after: $after) {
    nodes {
      id
      handle
      title
      descriptionHtml
      updatedAt
      sortOrder
      templateSuffix
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      ruleSet {
        appliedDisjunctively
        rules {
          column
          relation
          condition
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const PAGES_QUERY = `#graphql
query PagesSnapshot($first: Int!, $after: String) {
  pages(first: $first, after: $after) {
    nodes {
      id
      handle
      title
      body
      templateSuffix
      isPublished
      publishedAt
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const MENUS_QUERY = `#graphql
query MenusSnapshot($first: Int!) {
  menus(first: $first) {
    nodes {
      id
      handle
      title
      items {
        id
        title
        type
        url
        resourceId
        items {
          id
          title
          type
          url
          resourceId
        }
      }
    }
  }
}`;

const URL_REDIRECTS_QUERY = `#graphql
query UrlRedirectsSnapshot($first: Int!, $after: String) {
  urlRedirects(first: $first, after: $after) {
    nodes {
      id
      path
      target
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const POLICIES_QUERY = `#graphql
query ShopPoliciesSnapshot {
  shop {
    shopPolicies {
      id
      url
      body
      type
      title
      createdAt
      updatedAt
    }
  }
}`;

printMode('export-admin-data', false);

const snapshot = {
  exportedAt: new Date().toISOString(),
  role,
  domain: config.domain,
  shop: (await shopifyGraphql(config, SHOP_QUERY)).shop,
  metafieldDefinitions: await collectConnection(config, METAFIELD_DEFINITIONS_QUERY, 'metafieldDefinitions'),
  products: await collectConnection(config, PRODUCTS_QUERY, 'products'),
  collections: await collectConnection(config, COLLECTIONS_QUERY, 'collections'),
  pages: await collectConnection(config, PAGES_QUERY, 'pages'),
  menus: (await shopifyGraphql(config, MENUS_QUERY, { first: 100 })).menus.nodes,
  policies: (await shopifyGraphql(config, POLICIES_QUERY)).shop.shopPolicies,
  urlRedirects: await collectConnection(config, URL_REDIRECTS_QUERY, 'urlRedirects'),
};

await writeJson(output, snapshot);
console.log(`Wrote ${output}`);
