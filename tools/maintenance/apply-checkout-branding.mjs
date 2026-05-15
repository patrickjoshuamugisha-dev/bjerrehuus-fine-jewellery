/**
 * Applies Bjerrehuus brand theme to Shopify checkout branding (affects Apple Pay sheet + checkout).
 * Run:  node --env-file=../../.env tools/maintenance/apply-checkout-branding.mjs
 *   or: node --env-file=../../.env tools/maintenance/apply-checkout-branding.mjs --apply
 *
 * Without --apply: dry-run (queries only, prints what would change).
 * With    --apply: writes branding to the store.
 */

import { storeConfig, shopifyGraphql, parseArgs, printMode } from '../migration/shared.mjs';

const args = parseArgs();
const apply = args.apply === true;
const target = storeConfig('target');

// ── Brand tokens ──────────────────────────────────────────────────────────────
const CREAM    = '#FAF8F5';
const CREAM_ALT = '#F1ECE5';
const DARK     = '#1A1A1A';
const MUTED    = '#6E6862';
const BURGUNDY = '#6B1F2A';
const BORDER   = '#E8E4DD';

// ── Queries ───────────────────────────────────────────────────────────────────
const GET_PROFILES = `
  query GetCheckoutProfiles {
    checkoutProfiles(first: 5) {
      nodes { id name isPublished }
    }
  }
`;

const GET_BRANDING = `
  query GetCheckoutBranding($profileId: ID!) {
    checkoutBranding(checkoutProfileId: $profileId) {
      designSystem {
        cornerRadius { small base large }
        colors {
          global { brand }
          schemes {
            scheme1 {
              base { background text border icon decorative }
              primaryButton { background text border }
              secondaryButton { background text border }
            }
            scheme2 {
              base { background text border }
              primaryButton { background text border }
            }
          }
        }
      }
    }
  }
`;

const UPSERT_BRANDING = `
  mutation UpsertCheckoutBranding($checkoutProfileId: ID!, $checkoutBrandingInput: CheckoutBrandingInput!) {
    checkoutBrandingUpsert(
      checkoutProfileId: $checkoutProfileId,
      checkoutBrandingInput: $checkoutBrandingInput
    ) {
      checkoutBranding {
        designSystem {
          cornerRadius { small base large }
          colors {
            global { brand }
            schemes {
              scheme1 {
                base { background text }
                primaryButton { background text }
              }
            }
          }
        }
      }
      userErrors { field message code }
    }
  }
`;

// ── Brand input ───────────────────────────────────────────────────────────────
const brandingInput = {
  designSystem: {
    colors: {
      global: {
        brand: BURGUNDY,
      },
      schemes: {
        scheme1: {
          base: {
            background: CREAM,
            text: DARK,
            border: BORDER,
            icon: MUTED,
            decorative: BURGUNDY,
          },
          primaryButton: {
            background: BURGUNDY,
            text: CREAM,
            border: BURGUNDY,
          },
          secondaryButton: {
            background: CREAM,
            text: DARK,
            border: BORDER,
          },
        },
        scheme2: {
          base: {
            background: CREAM_ALT,
            text: DARK,
            border: BORDER,
            icon: MUTED,
          },
          primaryButton: {
            background: BURGUNDY,
            text: CREAM,
            border: BURGUNDY,
          },
          secondaryButton: {
            background: CREAM_ALT,
            text: DARK,
            border: BORDER,
          },
        },
      },
    },
    cornerRadius: {
      small: 'NONE',
      base: 'NONE',
      large: 'NONE',
    },
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
printMode('apply-checkout-branding', apply);

// Get checkout profiles
const profilesData = await shopifyGraphql(target, GET_PROFILES);
const profiles = profilesData.checkoutProfiles.nodes;

if (profiles.length === 0) {
  console.error('No checkout profiles found.');
  process.exit(1);
}

const published = profiles.find(p => p.isPublished) ?? profiles[0];
console.log(`\nCheckout profiles:`);
profiles.forEach(p => console.log(`  ${p.isPublished ? '✓' : ' '} ${p.name} (${p.id})`));
console.log(`\nUsing: ${published.name} (${published.id})`);

// Fetch current branding
const currentData = await shopifyGraphql(target, GET_BRANDING, { profileId: published.id });
console.log('\nCurrent branding:');
console.log(JSON.stringify(currentData.checkoutBranding?.designSystem ?? {}, null, 2));

// Show what we'll apply
console.log('\nBrand tokens to apply:');
console.log(`  Background:      ${CREAM}  (warm cream)`);
console.log(`  Alt background:  ${CREAM_ALT}  (beige panels)`);
console.log(`  Text:            ${DARK}  (deep black)`);
console.log(`  Primary button:  ${BURGUNDY}  (burgundy)`);
console.log(`  Button text:     ${CREAM}  (cream on burgundy)`);
console.log(`  Border:          ${BORDER}  (light taupe)`);
console.log(`  Brand/accent:    ${BURGUNDY}  (burgundy)`);
console.log(`  Corner radius:   NONE  (sharp edges)`);

if (!apply) {
  console.log('\n[DRY RUN] Pass --apply to write these changes to the store.');
  process.exit(0);
}

// Apply branding
console.log('\nApplying branding...');
const result = await shopifyGraphql(target, UPSERT_BRANDING, {
  checkoutProfileId: published.id,
  checkoutBrandingInput: brandingInput,
});

const errors = result.checkoutBrandingUpsert.userErrors;
if (errors.length > 0) {
  console.error('\nErrors:');
  errors.forEach(e => console.error(`  [${e.field}] ${e.message} (${e.code})`));
  process.exit(1);
}

const applied = result.checkoutBrandingUpsert.checkoutBranding;
console.log('\nApplied branding:');
console.log(JSON.stringify(applied?.designSystem ?? {}, null, 2));
console.log('\nDone. Verify at: Admin → Themes → Customize → Checkout');
