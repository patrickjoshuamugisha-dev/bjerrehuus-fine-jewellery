# Bjerrehuus Migration Phase Plan

> Created: 2026-05-14  
> Goal: migrate the rebuilt Bjerrehuus store from the restored client-transfer store into Vibe's real May 2 collaboration store without forcing Vibe onto the more expensive transferred-store subscription.

## Recommendation

Use the restored client-transfer store only as the source export. Keep Vibe's May 2 store as the only real launch target.

This is viable. With the target custom app + theme access set up, we can automate most of the migration in one serious pass, then catch drift through QA. It will not be a magical Shopify-to-Shopify clone because payments, KYC, domains, notification verification, some settings, and app configuration stay store-specific. But the theme, products, descriptions, SEO, metafields, pages, collections, menus, policies, files, redirects, and most admin content can be pulled and recreated.

## Phase 1: Do Now Before The Restored Store Is Back

### 1. Set Up The Target Store Access First

This is the first blocker. Do it on Vibe's real May 2 store, not in the Partner Dashboard.

Create two access lanes:

- Theme access: install/open the Theme Access app on the May 2 store and generate a theme password, or use collaborator login with theme permissions.
- Admin API access: create a custom app inside the May 2 Shopify Admin for migration/import.

Target custom app:

- Name: `BFJ Migration Assistant`
- Store: Vibe's May 2 store only.
- Purpose: temporary import/export automation.
- Permissions: read/write for products, variants, inventory, collections, files, themes, content/pages/blogs, redirects, discounts, metaobjects/metafields if available; read access for shop/locales/markets/locations/settings where Shopify exposes it.
- Keep it installed until QA passes, then revoke/delete it after launch handoff.

Local environment:

- Update local env values only after the target app is created:
  - `SHOPIFY_FLAG_STORE=<may-2-store>.myshopify.com`
  - `MYSHOPIFY_DOMAIN=<may-2-store>.myshopify.com`
  - `SHOPIFY_ACCESS_TOKEN=<target-custom-app-token>`
  - `SHOPIFY_CLI_THEME_TOKEN=<target-theme-access-password-or-theme-capable-token>`
- Do not commit tokens.
- Verify with `shopify theme list --store <may-2-store>.myshopify.com --password "$SHOPIFY_CLI_THEME_TOKEN"`.

Why this lane: Shopify CLI theme commands can use a Theme Access password or a custom app access token with theme scopes, and custom apps are created inside the merchant store. That avoids the old Partner-dashboard app path that caused friction.

### 2. Back Up The Target Store Before Import Work

Once target access works:

- Pull/list existing target themes.
- Export current target products/pages/collections/menus/policies if any exist.
- Screenshot current target domain, payment, tax, shipping, and store-detail settings.
- Record what already belongs to Vibe's May 2 store and should not be overwritten.

Target settings that should usually stay on the May 2 store:

- Subscription/plan.
- Store owner account and email verification state.
- Domain connection.
- Shopify Payments/KYC progress.
- Any bank/payment setup already completed.

### 3. Prepare The Local Theme

Current local source is enough to rebuild the theme now.

Phase 1 theme tasks:

- Fix current Theme Check errors:
  - `sections/feature-images-pair.liquid`: missing `width`/`height` on an image.
  - `sections/universe-story-next-wish.liquid`: missing `width`/`height` on an image.
- Re-run `shopify theme check --path bjerrehuus-theme`.
- Push to the May 2 store as an unpublished theme only, named `Bjerrehuus Dawn Rebuild`.
- Do not publish until after Phase 2 source reconciliation.

Known current Theme Check state:

- 2 errors.
- 21 warnings.
- Warnings are mostly Dawn/remote-font/hardcoded-route style warnings and are not the blocker.

### 4. Build A Local Source Manifest From Repo + Chat History

Create a local migration manifest from what we already know. This gives us a fallback if the restored store is delayed and a diff target when it comes back.

Manifest should include:

- Six product metafield definitions:
  - `custom.purchase_type`
  - `custom.material`
  - `custom.diamond_spec`
  - `custom.inspiration_collection`
  - `custom.is_bridal`
  - `custom.wedding_inquire_eligible`
- Known collections:
  - `pillow`
  - `bridal`
  - `classic`
  - `classic-tennis`
  - `classic-necklaces`
  - `classic-hoops`
  - `classic-alliancering` or `classic-wedding-bands`, depending on restored source
  - `classic-studs`
- Known pages:
  - `our-purpose`
  - `production-responsibility`
  - `diamonds`
  - `customer-care`
  - `shipping-delivery`
  - `returns-exchange`
  - `jewellery-care`
  - `size-guides`
  - `meet-vibe`
  - `universe`
  - `book-appointment`
  - `pillow`
- Known menus:
  - `main-menu`
  - `footer-menu-brand`
  - `footer-menu-care`
- Known product baseline:
  - 17 active products existed in the frozen admin.
  - The repo fully documents 4 Pillow products.
  - The repo partially documents Classic seed products.

Do not manually recreate all 17 products from memory if the source store is about to return. Wait for the restored export for exact product descriptions, SEO, images, variant flags, and tax/inventory data.

### 5. Prepare Migration Scripts And Folders

Create the export/import structure now:

```text
exports/store-transfer-2026-05-14/
  source/
  target-before/
  target-after/
  screenshots/
  import-logs/
```

Prepare scripts in dry-run mode for:

- Export source Admin data.
- Export target Admin data.
- Normalize product/collection/page/menu data.
- Import metafield definitions first.
- Import pages/policies.
- Import collections.
- Import products/variants/media/metafields.
- Import menus.
- Diff source vs target after import.

Do not run destructive imports until the target backup exists.

### 6. Prepare Asset Mapping

We already have many theme assets locally:

- Logo: `bjerrehuus-logo.png`, `bjerrehuus-logo.webp`
- Lifestyle images: `lifestyle-5691.jpg`, `lifestyle-5794.jpg`, `lifestyle-love.jpg`, `lifestyle-signet.jpg`, `lifestyle-vibe-med-mere.jpg`
- About portrait: `about-vibe-tjr.jpg`, `meet-vibe.webp`
- Product placeholders: `product-placeholder-01.jpg` through `product-placeholder-20.jpg`
- Email templates: `email-order-confirmation.html`, `email-shipping-confirmation.html`

Known risk update:

- Some template JSON still points to the frozen store CDN path `cdn.shopify.com/s/files/1/1032/3004/6542/...`.
- The Squarespace site is no longer visible as of 2026-05-14, so Squarespace URLs must be treated as unavailable and cannot be used for source pulls, previews, or launch fallbacks.

Phase 1 action:

- Build a URL replacement map.
- Replace frozen-store CDN URLs before final target publish.
- Replace Squarespace URLs immediately with local theme assets or target-store Files URLs.

### 7. What Phase 1 Should Not Wait For

Do now:

- Target May 2 custom app.
- Target Theme Access.
- Theme Check cleanup.
- Unpublished target theme push.
- Local manifest.
- Script scaffolding.
- Target backup.
- Asset URL map.

Wait for restored source store:

- Exact 17-product export.
- Product descriptions and SEO.
- Exact image order/alt text.
- Exact variant taxable/inventory flags.
- Exact policy bodies.
- Exact navigation URLs if admin differs from docs.
- Exact shipping/tax/markets screenshots.
- Any admin-only edits made after the local repo/docs were updated.

## Phase 2: Once The Restored Client-Transfer Store Is Back

### 1. Treat The Restored Store As Read-Only Source

Do not transfer it to Vibe again. Do not ask Vibe to pay for it. Do not change content unless access setup requires it.

Immediately collect:

- Source `.myshopify.com` domain.
- Source theme IDs.
- Source Theme Access password or collaborator access.
- Source custom app/Admin API token if support allows it.
- Source product CSV export as a fallback.

### 2. Pull The Source Theme

Run:

```bash
shopify theme list --store <source-store>.myshopify.com --password "$SOURCE_THEME_TOKEN" --json
shopify theme pull --store <source-store>.myshopify.com --password "$SOURCE_THEME_TOKEN" --theme <source-theme-id> --path exports/store-transfer-2026-05-14/source/theme --nodelete
```

Then compare:

- Source pulled theme vs local `bjerrehuus-theme/`.
- Source `settings_data.json` vs local `settings_data.json`.
- Source template image URLs vs local target-ready URL map.

### 3. Export Source Admin Data

Export by API where possible:

- Shop settings and locales.
- Products, variants, options, descriptions, SEO, media, tags, status, vendor, product type.
- Product metafields.
- Metafield definitions.
- Collections, rules, SEO, images, product memberships.
- Pages and template suffixes.
- Blogs/articles if any.
- Menus and nested menu items.
- Policies.
- Files.
- URL redirects.
- Metaobjects.
- Discounts.
- Locations and inventory levels.

Also screenshot:

- Online Store preferences.
- Taxes/duties/VAT.
- Shipping and delivery.
- Markets.
- Payments and wallets.
- Domains.
- Notifications.
- Checkout.
- Store details.
- Customer accounts.
- Apps and sales channels.

### 4. Diff Source Against Phase 1 Manifest

Before importing, reconcile:

- Product count should be 17 active products unless the source says otherwise.
- Any product handles changed from the docs.
- `classic-alliancering` vs `classic-wedding-bands`.
- Any descriptions/SEO/title edits made only in Shopify Admin.
- Product images and alt text.
- Policies and legal copy.
- Theme settings and homepage/collection/page image URLs.

If source and local conflict, source wins for admin content. Local wins only for newer code fixes, such as Theme Check cleanup.

### 5. Import Into The May 2 Target Store

Import order:

1. Confirm target backup exists.
2. Create/update metafield definitions.
3. Upload required files/media.
4. Create/update pages and policy content.
5. Create/update collections.
6. Create/update products, variants, SEO, tax flags, inventory/tracking flags, and metafields.
7. Attach products to manual collections and verify automated rules.
8. Create/update menus.
9. Push target theme as unpublished.
10. Replace any old frozen-store CDN URLs.
11. Recreate shipping, tax, markets, checkout, store details, and Online Store preferences manually from screenshots/API export.
12. Paste branded notification templates after target email verification.
13. Configure Shopify Forms only if target email/account verification allows it.

### 6. QA After Import

Data QA:

- Source vs target product count.
- Every product handle/title/description/SEO/meta description.
- Variant options/prices/taxable/inventory flags.
- Product media count/order/alt text.
- Metafield definitions and values.
- Collection rules/memberships.
- Pages/policies/menus.
- Redirects.

Storefront QA:

- Home.
- `/collections/all`.
- Classic, Pillow, Bridal, and subcollections.
- Product pages with `shoppable`.
- Product pages with `inquire`.
- Inquire modal hidden fields: product name, handle, URL, customer email/message.
- Cart.
- Search.
- 404.
- Account pages.
- Password page.
- Header/footer/mobile nav.
- Universe and Meet Vibe.

Checkout/admin QA:

- Denmark shipping: 0 DKK.
- Germany/international shipping: 299 DKK.
- Tax/VAT display.
- Payment methods after Shopify Payments is approved.
- One paid order/refund after payment setup is live.
- One real inquiry to `vibe@stylesnob.com`.

### 7. Publish Criteria

Publish only when:

- Target unpublished theme matches the restored source plus our local code fixes.
- Product/admin diff is clean or documented.
- Vibe's current May 2 store settings are preserved where they matter: subscription, owner, email, domain, KYC/payments.
- Shopify Payments path is on the May 2 store.
- Domain points to the May 2 store.
- Patrick/Vibe approves final preview.

## Bottom Line

Yes: this is the right approach. Phase 1 gets the May 2 store and tooling ready. Phase 2 uses the restored client-transfer store as the exact source of truth, imports into May 2, then QA catches the remaining drift. The only truly non-automatable pieces are store-specific owner/payment/domain/email-verification settings and a few settings screens that Shopify does not cleanly clone.

## Documentation Used

- Shopify CLI for themes: https://shopify.dev/docs/storefronts/themes/tools/cli
- Theme Access app: https://shopify.dev/docs/storefronts/themes/tools/theme-access
- Theme pull: https://shopify.dev/docs/api/shopify-cli/theme/theme-pull
- Theme push: https://shopify.dev/docs/api/shopify-cli/theme/theme-push
- Metafield definitions and values: https://shopify.dev/docs/apps/build/metafields/definitions
