# Bjerrehuus Rebuild on New Collaboration Store — Audit & Build Plan

## Context

The original client-transfer store `bjerrehuus-fine-jewelry.myshopify.com` got frozen during an accidental store-transfer (Shopify wanted the client to start a new subscription to claim it, which we don't want — the client already owns a collaboration store, `dvzxta-0m.myshopify.com`, with their domain attached). Shopify Support will return the frozen store to us later for read-only export. In the meantime, we rebuild **everything possible** on `dvzxta-0m` so the client launch isn't blocked.

Codex began this work on 2026-05-14 before running out of usage. This plan captures the current state and a full build sequence for getting `dvzxta-0m` to 100% launch-ready before the frozen store comes back.

The Squarespace site that previously held some product imagery is **gone** — the domain was moved to the collaboration store. So our only sources of truth are: the captured admin export (which contains the frozen-store data), the local theme code, repo docs, brand assets, and screenshots.

---

## Where We Are (Audit Result)

### Stores

| Role | Domain | State |
|---|---|---|
| **Frozen source** | `bjerrehuus-fine-jewelry.myshopify.com` | Inaccessible. Shopify Support will restore for export later. |
| **New target (rebuild here)** | `dvzxta-0m.myshopify.com` | Client-owned collab store. Live theme: `Horizon` (`195850142083`). Draft theme: `Bjerrehuus Draft` (`196345627011`). |

### What Codex + this session completed

1. Theme Check: **0 errors, 21 warnings**. Fixed missing `width`/`height` on `feature-images-pair.liquid` and `universe-story-next-wish.liquid`.
2. Stripped Squarespace dependencies from theme — homepage, Pillow inspiration hero, Universe imagery now fall back to local theme assets.
3. Created migration workspace `exports/store-transfer-2026-05-14/` with `source/`, `target-before/`, `target-after/`, `import-logs/`, `screenshots/`.
4. Built `migration-manifest.json` documenting 6 metafield definitions, 9 collections, 12 pages, 3 menus, 17 products.
5. Built `url-replacement-map.json` (currently 0 unresolved theme refs — clean).
6. Wrote 7 migration scripts in `tools/migration/`: `shared.mjs`, `export-admin-data.mjs`, `normalize-admin-data.mjs`, `build-url-replacement-map.mjs`, `import-metafield-definitions.mjs`, `import-content-dry-run.mjs`, `diff-admin-data.mjs`. All syntax-valid.
7. Ran dry-run metafield import (logged to `import-logs/import-metafield-definitions.log`).
8. Captured admin export labeled `target-before/admin-export.json` — **17 products, 9 collections, 21 pages, 5 menus, 6 policies**. This is actually the **frozen-store's data** captured before lockout (env still pointed at it). Source-of-truth for the rebuild.
9. **NEW this session**: Theme `bjerrehuus-theme` pushed to dvzxta-0m's `Bjerrehuus Draft` (`#196345627011`). Theme check clean. Storefront preview password captured: `rteipe`.
10. **NEW this session**: Verified that the frozen store's Admin API is **still live for READS** via the existing `shpat_` token in `.env`. So the `target-before/admin-export.json` is current/queryable, not just a snapshot — we can re-pull deltas anytime.
11. `.env` backed up to `.env.frozen-backup` (preserves frozen-store credentials for future reconciliation via the `SOURCE_*` env-var split already supported in [tools/migration/shared.mjs:62-69](tools/migration/shared.mjs#L62-L69)).

### Bridge state (the one remaining blocker)

- **Theme writes to dvzxta-0m**: ✅ Works. Shopify CLI uses your Partner-collaborator session in macOS Keychain. `shopify theme push --store dvzxta-0m.myshopify.com --theme 196345627011` succeeds without any token in `.env`.
- **Frozen-store reads** (`bjerrehuus-fine-jewelry.myshopify.com`): ✅ Works via the `shpat_` token in `.env.frozen-backup`. Both via direct curl AND via the MCP Shopify connector (just tested: returned the 17 products).
- **Admin API writes to dvzxta-0m**: ❌ **Blocked.** No `shpat_` / `shpoa_` token for dvzxta-0m exists anywhere on this machine. Verified by full Explore agent audit of `~/.shopify`, `~/Library/Caches/shopify-*`, both project `.env`s, and `.claude/settings.local.json`.
  - The Partner Dashboard "Claude Code" app at `Desktop/Shopify CLI app/claude-code/` only persists `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET` — these are app credentials, not store install tokens. `.shopify/project.json` is `{}` empty. No OAuth callback handshake completed against a redirect URL we control.
  - `shopify app execute --store dvzxta-0m.myshopify.com` errors with "Could not find store for domain dvzxta-0m.myshopify.com in organization Mugisha Marketing" — the Claude Code app lives in your Partner org; dvzxta-0m lives in the client's org.
  - Per Codex's last message (before it ran out of credits): the bridge is **a Custom App created inside dvzxta-0m's admin** (Settings → Apps and sales channels → Develop apps), NOT a Partner Dashboard app. That step was never executed. ~90-second click-path. Result: `shpat_…` token pasted into project `.env` → all 7 migration scripts work as-is.
- VQA-005: Storefront `/products.json` on dvzxta-0m returns `{"products":[]}` — confirmed empty. Theme is there, content isn't.
- 14 frozen-store CDN references remain (likely in product/collection/page body fields per `target-before/admin-export.json`; theme code is clean).

### What we already have to rebuild from

- `exports/store-transfer-2026-05-14/target-before/admin-export.json` — full snapshot of frozen store (17 products, 9 collections, 21 pages, 5 menus, 6 policies).
- Local theme `bjerrehuus-theme/` — clean, Theme-Check-passing, Squarespace-free.
- `bjerrehuus-theme/assets/` lifestyle images, logos, packshots.
- `client-docs/packshots/` — packshot photography from India.
- `client-assets/logo/` — logo source files.
- `reference/bjerrehuus-fine-jewellery-build-plan.md`, `reference/VIBE_EMAIL_AND_TRANSCRIPT.md`, `reference/style-tile.html`.
- `docs/current/COLLABORATION-STORE-REBUILD-QA-PLAN.md`, `STORE-TRANSFER-GAME-PLAN.md`, `MIGRATION-PHASE-PLAN.md`, `VISUAL-QA-TRACKER.html`.

---

## Build Plan

Goal: get `dvzxta-0m.myshopify.com` to 100% launch-ready (everything except client-dependent KYC/payments/email-verify/domain-DNS) before frozen store is restored.

### Phase 0 — Mint the one missing token (dvzxta-0m Admin API write)

Everything else is already wired. This is a single 90-second admin click-path Patrick runs, then I do everything.

**Click-path (Patrick, in dvzxta-0m admin)**:
1. dvzxta-0m admin → Settings → **Apps and sales channels** → **Develop apps** → click **Allow custom app development** if prompted.
2. **Create an app** → name: `Bjerrehuus Migration`.
3. **Configuration** tab → **Admin API integration** → **Configure** → check all relevant scopes (Patrick can click "Select all" or pick the specific set):
   - `read/write_products`, `read/write_product_listings`, `read/write_inventory`, `read/write_locations` (read)
   - `read/write_files`, `read/write_content`, `read/write_themes`, `read/write_online_store_pages`, `read/write_online_store_navigation`
   - `read/write_metaobjects`, `read/write_discounts`, `read/write_translations`, `read/write_shipping`
   - `read/write_customers`, `read/write_orders`, `read/write_draft_orders`, `read/write_publications`
   - `read_markets`, `read_locales`, `read_publications`
4. **API access** tab → **Storefront API** → also enable read scopes if shown (optional, used for storefront previews).
5. **Save** → top of page click **Install app** → confirm.
6. Back on the app page → **API credentials** tab → reveal & copy the **Admin API access token** (starts with `shpat_…`). Paste it here in chat.

**Then I do**:
1. Write `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /.env`:
   ```
   SHOPIFY_FLAG_STORE=dvzxta-0m.myshopify.com
   MYSHOPIFY_DOMAIN=dvzxta-0m.myshopify.com
   SHOPIFY_ACCESS_TOKEN=<new shpat_ from step 6>

   # Frozen store still queryable for source-of-truth reads
   SOURCE_MYSHOPIFY_DOMAIN=bjerrehuus-fine-jewelry.myshopify.com
   SOURCE_SHOPIFY_ACCESS_TOKEN=<old frozen-store shpat_ from .env.frozen-backup>
   SHOPIFY_CLI_THEME_TOKEN=<keep old; CLI doesn't actually need it for dvzxta-0m theme push>
   ```
   `storeConfig(role)` at [tools/migration/shared.mjs:62-69](tools/migration/shared.mjs#L62-L69) already handles the `SOURCE_*` split.
2. Sanity check: `node tools/migration/export-admin-data.mjs --role target --output exports/store-transfer-2026-05-14/target-current/admin-export.json` returns `shop.myshopifyDomain === "dvzxta-0m.myshopify.com"` with near-empty product/collection/page arrays.
3. Sanity check (frozen still readable): `node tools/migration/export-admin-data.mjs --role source --output exports/store-transfer-2026-05-14/source/admin-export.json` returns the 17 products / 9 collections / 21 pages snapshot.

**Phase 0 work already done in this session** (do not re-do):
- Theme `bjerrehuus-theme` pushed to dvzxta-0m `Bjerrehuus Draft` (`196345627011`). Confirmed via `shopify theme list`. Storefront preview password: `rteipe`.
- `.env` backed up to `.env.frozen-backup`.
- Verified frozen-store API still works for reads (so Phase 8 reconciliation will be straightforward).

### Phase 1 — Gap analysis on `dvzxta-0m`

1. Run a fresh target export → `target-current/admin-export.json`, normalize → `target-current/admin-normalized.json`.
2. Use `tools/migration/diff-admin-data.mjs --source exports/.../target-before/admin-normalized.json --target exports/.../target-current/admin-normalized.json --output exports/.../target-current/admin-diff.json`. Treat `target-before/` as the source (it's the frozen-store snapshot). Output will list every missing entity on `dvzxta-0m`.
3. Re-label folders for sanity: copy `target-before/` → `source/` so the workflow matches the original script defaults. Keep `target-before/` for archival.
4. Capture target-store settings screenshots that the API doesn't expose: shipping zones, tax/VAT, markets, payments (KYC progress), domain, store details, customer accounts, checkout, notifications. Save under `exports/store-transfer-2026-05-14/screenshots/dvzxta-0m-current/`.

### Phase 2 — Theme push to `dvzxta-0m` (`Bjerrehuus Draft` 196345627011)

**Already complete this session.** Theme pushed successfully via `shopify theme push --store dvzxta-0m.myshopify.com --theme 196345627011 --nodelete`. Theme check: 0 errors, 21 warnings.

Preview: https://dvzxta-0m.myshopify.com?preview_theme_id=196345627011 (storefront password `rteipe`).

If theme changes are made later, re-push with the same command. CLI auth via Keychain — no `--password` flag needed for collaborator access.

### Phase 3 — Admin content import (heart of the rebuild)

Order matters — dependencies first.

1. **Metafield definitions** (6, from `migration-manifest.json`): `node tools/migration/import-metafield-definitions.mjs --apply`. Verify the 6 PRODUCT-owner definitions exist in admin → Settings → Custom data.
2. **Files / media library**: upload required imagery to `dvzxta-0m` Files. Sources: `bjerrehuus-theme/assets/lifestyle-*.jpg`, `client-docs/packshots/`, `client-assets/`. Capture the resulting `cdn.shopify.com/s/files/1/<new-shop-id>/files/...` URLs.
3. **Build URL replacement map**: for the 14 known frozen-CDN refs (and any others surfaced from `target-before/admin-export.json` product/page body fields), populate `url-replacement-map.json` with `proposedReplacement` values pointing to the new target-store Files URLs. Persist this map for repeatable replays.
4. **Pages** (12 handles): `our-purpose`, `production-responsibility`, `diamonds`, `customer-care`, `shipping-delivery`, `returns-exchange`, `jewellery-care`, `size-guides`, `meet-vibe`, `universe`, `book-appointment`, `pillow`. Import via extended `import-content-dry-run.mjs` (currently locked) — unlock and apply.
5. **Policies** (6): Privacy, Refund, Shipping, Terms, Contact Info, Legal Notice. From `target-before/admin-export.json`. Shopify-native policy fields (settings → policies).
6. **Collections** (9): `pillow` (automated, tag=pillow), `bridal`, `classic`, `classic-tennis`, `classic-necklaces`, `classic-hoops`, `classic-alliancering` (or `classic-wedding-bands` — confirm against frozen export), `classic-studs`. Preserve rule definitions and SEO from the snapshot.
7. **Products** (17): full payload — title, handle, body_html, vendor, product_type, tags, status=active, SEO title/description, variants (option1/2/3, price in DKK, sku, taxable, inventory tracking, weight), images (in order, with alt text), product metafields (`custom.purchase_type`, `custom.material`, `custom.diamond_spec`, `custom.inspiration_collection`, `custom.is_bridal`, `custom.wedding_inquire_eligible`). Replace frozen-CDN image URLs using the map from step 3 before create/update.
8. **Manual collection memberships**: re-attach products to manual collections (`bridal`, `classic-*` non-rule-driven). For `pillow` automated collection, just confirm `tag=pillow` is set on the 4 Pillow products.
9. **Menus** (3): `main-menu` (Shop, Universe ▸ [Meet Vibe, Universe], Book Appointment — disabled state), `footer-menu-brand`, `footer-menu-care`. Reconstruct from snapshot.
10. **URL redirects** (0 in snapshot, but check): import any that exist.
11. Re-run `target-after/admin-export.json` + diff against the snapshot. Goal: clean diff or only acceptable known deltas.

Scripts to extend (currently dry-run-only): [tools/migration/import-content-dry-run.mjs](tools/migration/import-content-dry-run.mjs). Wire it through the same `requireStoreConfig` pattern in [tools/migration/shared.mjs](tools/migration/shared.mjs).

### Phase 4 — Store settings (everything that's not API-exposed)

These need manual admin config on `dvzxta-0m`. Some require client unblockers; do what we can now.

- **Store details**: name "Bjerrehuus Fine Jewellery", company name, address, CVR, contact email `vibe@stylesnob.com`, phone, currency DKK, timezone Europe/Copenhagen.
- **Shipping zones**: Denmark 0 DKK free, International (everywhere else) 299 DKK. Already verified working on frozen store; replicate.
- **Tax/VAT**: DK VAT-included pricing; confirm rates against frozen-store screenshots once captured.
- **Markets**: DK primary; international second. Disable currency switching for launch.
- **Languages**: English-only. Don't activate Translate & Adapt.
- **Customer accounts**: classic accounts (per locked architecture).
- **Checkout**: default Shopify-native; address autofill on.
- **Domain**: confirm current `dvzxta-0m` domain state. (Patrick noted the Squarespace domain was moved here — verify it's connected and primary.)
- **Storefront password**: keep ON until launch.

Items blocked by client (document in `CLIENT-DEPENDENT-TASKS.html`, don't attempt):

- Shopify Payments / KYC / bank / MitID.
- MobilePay activation (after Payments verified).
- Apple Pay / Google Pay / Shop Pay (auto-after Payments).
- Owner email verification (gates branded transactional emails and Shopify Forms).

### Phase 5 — Visual QA on `dvzxta-0m` draft

Once Phase 3 has products/pages/menus and Phase 4 has settings, run the QA tracker pages in [docs/current/VISUAL-QA-TRACKER.html](docs/current/VISUAL-QA-TRACKER.html).

Priority order:

1. **Header/footer** (VQA-001) — match old preview screenshots: white header band, centered logo, left nav (Shop, Universe ▸, Book Appointment disabled), right icons (Search, Heart, Cart). Footer: warm beige, 3 cols (Brand / Customer Care / Contact + newsletter + socials), centered copyright.
2. **Homepage** (VQA-002): hero, Pillow feature pair, discover tiles (Classic / Pillow / Bridal — focal points already tuned per commit `b27f816`), CTA scrim.
3. **Collection pages**: `/collections/all` + each of the 9 collections. Sidebar nav, 3-col grid, campaign tiles atop `/collections/all`.
4. **Product pages**: one shoppable (Pillow studs), one inquire (Bridal solitaire), one bridal-eligible. Confirm `custom.purchase_type` branches the CTA correctly.
5. **Inquire modal**: open from inquire product, confirm hidden fields populate product name/handle/URL, submission target = `vibe@stylesnob.com`.
6. **Cart**: empty + populated states, delivery toggle.
7. **Universe + Meet Vibe + Book Appointment** pages.
8. **Content pages**: Our Purpose, Production & Responsibility, Diamonds, Customer Care, Shipping & Delivery, Returns & Exchange, Jewellery Care, Size Guides.
9. **System pages**: search, 404, account login/register/reset, password.
10. **Viewports**: desktop wide, laptop, tablet, mobile. **Browsers**: Chrome, Safari, Firefox desktop; iPhone Safari, Android Chrome.

Log each finding in `docs/current/VISUAL-QA-TRACKER.html` with URL, viewport, issue, desired, owner, batch.

### Phase 6 — Client-dependent prep (do everything ready-to-paste)

So the moment Vibe verifies email / KYC / domain, we paste-and-go.

- Branded transactional email HTML — already built in `bjerrehuus-theme/assets/`. Document which admin email template each one maps to. Pre-fill the variant for paste.
- Shopify Forms config for the inquire flow — document the field mapping (product name, handle, URL, customer email, message → `vibe@stylesnob.com`). If Forms can't carry product context, keep the existing in-theme modal as the path of record.
- Domain connection steps (assuming Squarespace domain is registrar-linked here): DNS records, TLS, redirect rules.
- Refresh `docs/current/CLIENT-DEPENDENT-TASKS.html` with current target-store state.

### Phase 7 — Project hygiene

- Update [CLAUDE.md](CLAUDE.md) — change `myshopify domain` to `dvzxta-0m.myshopify.com`, update theme IDs (`Bjerrehuus Draft` `196345627011`, `Horizon` `195850142083`), note frozen store status. Same edits to [AGENTS.md](AGENTS.md).
- Update theme push command in CLAUDE.md to target `dvzxta-0m` + theme `196345627011`.
- Update `docs/current/MIGRATION-PHASE-EXECUTION-2026-05-14.md` with Phase 0-7 progress markers as each completes.
- Commit. Push to `origin/main` (currently 1 commit ahead).

### Phase 8 — Frozen-store reconciliation (when Shopify Support restores it)

Out of scope for the current build push but flagged here so we don't lose the thread:

1. Get temporary admin access to frozen store from Support.
2. Set `SOURCE_*` env vars; run `export-admin-data.mjs --role source`.
3. Diff source vs the rebuilt `dvzxta-0m`. Source wins for exact copy, SEO, image alt text, descriptions, policy text. Local wins for theme code fixes and bug fixes done since.
4. Apply only the deltas. Do NOT re-transfer the frozen store or ask Vibe to pay.

---

## Critical files to modify

- [/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /.env](.env) — swap to `dvzxta-0m` tokens (Phase 0).
- [tools/migration/import-content-dry-run.mjs](tools/migration/import-content-dry-run.mjs) — unlock and add actual create/update mutations for pages, collections, products, menus (Phase 3).
- [exports/store-transfer-2026-05-14/url-replacement-map.json](exports/store-transfer-2026-05-14/url-replacement-map.json) — populate frozen-CDN → new-target-CDN mappings (Phase 3 step 3).
- [bjerrehuus-theme/](bjerrehuus-theme/) — push as-is to `196302537038`'s replacement, theme `196345627011` on the new store (Phase 2).
- [CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md) — store domain + theme IDs (Phase 7).
- [docs/current/VISUAL-QA-TRACKER.html](docs/current/VISUAL-QA-TRACKER.html) — log every QA finding (Phase 5).
- [docs/current/MIGRATION-PHASE-EXECUTION-2026-05-14.md](docs/current/MIGRATION-PHASE-EXECUTION-2026-05-14.md) — progress log (Phase 7).

## Existing utilities to reuse (do not rewrite)

- [tools/migration/shared.mjs:62-69](tools/migration/shared.mjs#L62-L69) — `storeConfig(role)` for source/target env split.
- [tools/migration/export-admin-data.mjs](tools/migration/export-admin-data.mjs) — full GraphQL admin snapshot.
- [tools/migration/normalize-admin-data.mjs](tools/migration/normalize-admin-data.mjs) — normalize raw export for diff.
- [tools/migration/diff-admin-data.mjs](tools/migration/diff-admin-data.mjs) — source-vs-target diff.
- [tools/migration/build-url-replacement-map.mjs](tools/migration/build-url-replacement-map.mjs) — scan theme for frozen-CDN refs.
- [tools/migration/import-metafield-definitions.mjs](tools/migration/import-metafield-definitions.mjs) — dry-run/apply metafield defs from manifest.

---

## Verification

After each phase the rebuild is verified end-to-end as follows:

- **Phase 0**: `shopify theme list --store dvzxta-0m.myshopify.com --password "$SHOPIFY_CLI_THEME_TOKEN"` returns themes; `node tools/migration/export-admin-data.mjs --role target` returns a JSON file containing `shop.domain === "dvzxta-0m.myshopify.com"`.
- **Phase 2**: `shopify theme check --path bjerrehuus-theme` exits 0; theme push succeeds; `https://dvzxta-0m.myshopify.com?preview_theme_id=196345627011` renders the Bjerrehuus design (not raw Dawn).
- **Phase 3**: `node tools/migration/diff-admin-data.mjs` against the frozen-store snapshot returns no missing-in-target entities. 17 products, 9 collections, 12 pages, 3 menus, 6 policies present in `dvzxta-0m` admin. Storefront `/collections/all` shows products.
- **Phase 4**: Settings screenshots saved; shipping rates verified at checkout for DK (0 DKK) and DE/US (299 DKK) using preview password.
- **Phase 5**: Visual QA tracker has every priority page logged; all batches resolved or scheduled.
- **Phase 6**: Email HTML drafts ready in a single pasteable location; client task doc up to date.
- **Phase 7**: `git status` clean; `CLAUDE.md` references `dvzxta-0m.myshopify.com`; commits pushed.

Final launch readiness: storefront walkthrough on desktop + mobile in 3 browsers, one test inquiry submission with product context, plus the remaining client-blocked items (real paid order + refund, real inquire test, domain DNS, payments KYC) executed once Vibe unblocks them.
