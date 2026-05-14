#!/usr/bin/env node
import { MANIFEST_PATH, appendLog, isApply, parseArgs, printMode, readJson, shopifyGraphql, storeConfig } from './shared.mjs';

const args = parseArgs();
const apply = isApply(args);
const manifest = await readJson(args.manifest || MANIFEST_PATH);
const config = storeConfig('target');

const METAFIELD_DEFINITION_CREATE = `#graphql
mutation MetafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
      namespace
      key
      type {
        name
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

printMode('import-metafield-definitions', apply);

const lines = [];
for (const definition of manifest.productMetafieldDefinitions) {
  const payload = {
    name: definition.name,
    namespace: definition.namespace,
    key: definition.key,
    type: definition.type,
    ownerType: definition.ownerType || 'PRODUCT',
  };

  if (definition.description) payload.description = definition.description;

  if (!apply) {
    lines.push(`DRY RUN create/update ${payload.ownerType} ${payload.namespace}.${payload.key} (${payload.type})`);
    continue;
  }

  const result = await shopifyGraphql(config, METAFIELD_DEFINITION_CREATE, { definition: payload });
  const errors = result.metafieldDefinitionCreate.userErrors;

  if (errors.length > 0) {
    lines.push(`ERROR ${payload.namespace}.${payload.key}: ${JSON.stringify(errors)}`);
  } else {
    lines.push(`CREATED ${payload.namespace}.${payload.key}: ${result.metafieldDefinitionCreate.createdDefinition.id}`);
  }
}

const logPath = await appendLog('import-metafield-definitions', lines);
console.log(lines.join('\n'));
console.log(`Logged ${logPath}`);

