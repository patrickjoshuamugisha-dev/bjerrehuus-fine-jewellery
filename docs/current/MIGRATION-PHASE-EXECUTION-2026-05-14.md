# Migration Phase Execution - 2026-05-14

Executed Phase 1 local and target-store steps from `docs/current/MIGRATION-PHASE-PLAN.md`.

## Correction: Target Store

The correct collaboration store is `dvzxta-0m.myshopify.com`.

Earlier Phase 1 theme pushes and the Admin API backup used the Bjerrehuus repo `.env`, which pointed to `bjerrehuus-fine-jewelry.myshopify.com`. That store currently has the unpublished themes created during the first pass, but it is not the collaboration store visible in the client's admin.

Correct collaboration-store state verified by Shopify CLI:

- Store: `dvzxta-0m.myshopify.com`
- Live theme: `Horizon` (`195850142083`)
- Draft theme: `Bjerrehuus Draft` (`196345627011`)
- Preview: `https://dvzxta-0m.myshopify.com?preview_theme_id=196345627011`
- Editor: `https://dvzxta-0m.myshopify.com/admin/themes/196345627011/editor`

## Completed

- Fixed the two blocking Theme Check errors by adding explicit dimensions to external fallback images in:
  - `bjerrehuus-theme/sections/feature-images-pair.liquid`
  - `bjerrehuus-theme/sections/universe-story-next-wish.liquid`
- Ran `shopify theme check --path bjerrehuus-theme`.
  - Result: 0 errors, 21 warnings.
- Validated the two edited Liquid files with Shopify theme validation.
  - Result: valid.
- Verified target theme access with `shopify theme list`.
- Exported and normalized the May 2 target-store admin backup into:
  - `exports/store-transfer-2026-05-14/target-before/admin-export.json`
  - `exports/store-transfer-2026-05-14/target-before/admin-normalized.json`
- Target backup counts:
  - Products: 17
  - Collections: 9
  - Pages: 21
  - Menus: 5
  - Policies: 6
  - URL redirects: 0
- Created Phase 1 migration workspace:
  - `exports/store-transfer-2026-05-14/source/`
  - `exports/store-transfer-2026-05-14/target-before/`
  - `exports/store-transfer-2026-05-14/target-after/`
  - `exports/store-transfer-2026-05-14/screenshots/`
  - `exports/store-transfer-2026-05-14/import-logs/`
- Created local migration manifest:
  - `exports/store-transfer-2026-05-14/migration-manifest.json`
- Created URL replacement audit:
  - `exports/store-transfer-2026-05-14/url-replacement-map.json`
  - Found 20 frozen-store CDN or Squarespace references during the first pass.
- Removed active Squarespace dependencies from theme templates after confirming the Squarespace site is no longer visible:
  - Homepage feature pair now falls back to local theme assets.
  - Pillow inspiration hero now falls back to a local theme asset.
  - Universe index/story imagery now falls back to local theme assets.
  - Regenerated `url-replacement-map.json`; active external audit is now 14 references, all frozen-store CDN references.
  - Re-pushed unpublished theme `Bjerrehuus Dawn Rebuild` (`196842848590`) after removing Squarespace dependencies.
- Prepared dry-run migration scripts:
  - `tools/migration/export-admin-data.mjs`
  - `tools/migration/normalize-admin-data.mjs`
  - `tools/migration/import-metafield-definitions.mjs`
  - `tools/migration/import-content-dry-run.mjs`
  - `tools/migration/diff-admin-data.mjs`
  - `tools/migration/build-url-replacement-map.mjs`
- Ran `node --check` across migration scripts.
- Ran dry-run metafield definition import and logged it to:
  - `exports/store-transfer-2026-05-14/import-logs/import-metafield-definitions.log`
- Pushed local theme to the May 2 target store as unpublished:
  - Theme: `Bjerrehuus Dawn Rebuild`
  - Theme ID: `196842848590`
  - Preview: `https://bjerrehuus-fine-jewelry.myshopify.com?preview_theme_id=196842848590`
  - Editor: `https://bjerrehuus-fine-jewelry.myshopify.com/admin/themes/196842848590/editor`
- Replaced the empty unpublished `Horizon` theme slot with a fresh unpublished draft:
  - Deleted `Horizon` (`196177133902`)
  - Created `Bjerrehuus Draft`
  - Theme ID: `196843307342`
  - Preview: `https://bjerrehuus-fine-jewelry.myshopify.com?preview_theme_id=196843307342`
  - Editor: `https://bjerrehuus-fine-jewelry.myshopify.com/admin/themes/196843307342/editor`

## Still Manual / Waiting

- Manual screenshots of target settings still need to be captured:
  - Domain
  - Payment/KYC
  - Tax/VAT
  - Shipping and delivery
  - Store details
  - Checkout
  - Notifications
  - Customer accounts
- Do not publish the new theme until Phase 2 source reconciliation and QA are complete.
- Do not use Squarespace URLs as temporary fallbacks; use local theme assets or target-store Files.
- Wait for restored source store before exact product/media/SEO/policy diff and import.
