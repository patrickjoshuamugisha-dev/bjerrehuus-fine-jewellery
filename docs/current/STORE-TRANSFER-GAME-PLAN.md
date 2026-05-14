# Bjerrehuus Store Transfer Game Plan

> Created: 2026-05-13  
> Purpose: one-shot export from the frozen transferred store, then rebuild on Vibe's real May 2 collaboration store without missing theme, catalog, SEO, policies, settings, or launch-critical admin work.

## Lean Recommendation

If Shopify Support gives temporary access to the frozen May 13 store, use it only as a source-of-truth export window. Do not ask Vibe to activate/pay for that store. Export everything, rebuild on the May 2 store, QA against the export, then leave the frozen store alone.

The May 2 store is still the right destination because it is Vibe's real owned store, already has the cheaper/subscription path, and already has client-side setup work started.

For the execution split, use `docs/current/MIGRATION-PHASE-PLAN.md`: Phase 1 prepares the May 2 target store and tooling now; Phase 2 exports the restored client-transfer store and imports into May 2.

## Access Needed From Shopify Support

Ask support for temporary access with enough permissions to export, not to launch the frozen store:

- Admin access to the frozen store for 24-48 hours.
- Online Store > Themes permission.
- Products, inventory, collections, files/media permission.
- Content/pages, blogs, navigation/menus permission.
- Settings access for policies, shipping/delivery, taxes/duties, markets, domains, notifications, checkout, locations, customer accounts, and store details.
- Ability to install/open Theme Access app or provide a Theme Access password.
- Ability to create/read a temporary custom app Admin API token, or allow Shopify CLI store auth with read scopes.

Minimum credentials I need during the window:

- Frozen store `.myshopify.com` domain.
- Target May 2 store `.myshopify.com` domain.
- Theme Access password for the frozen store, or collaborator login that works with Shopify CLI.
- Admin API token for the frozen store, if support allows custom app/API access.
- Theme Access password and Admin API token for the May 2 target store.

## Export Folder

Create one timestamped package and keep every artifact inside it:

```text
exports/store-transfer-2026-05-13/
  00-source-access-notes.md
  01-theme/
    frozen-theme-pull/
    local-theme-snapshot/
    theme-list-source.json
    theme-list-target.json
  02-admin-json/
    shop.json
    products.json
    product-variants.json
    product-media.json
    product-metafields.json
    metafield-definitions.json
    collections.json
    collection-products.json
    pages.json
    blogs-and-articles.json
    menus.json
    policies.json
    files.json
    redirects.json
    markets.json
    locations.json
    inventory-levels.json
    discounts.json
    metaobjects.json
  03-admin-csv/
    products-shopify-export.csv
    products-normalized.csv
  04-manual-screenshots/
    online-store-preferences/
    taxes/
    shipping-delivery/
    payments/
    markets/
    domains/
    notifications/
    checkout/
    store-details/
    customer-accounts/
    locations/
    apps/
  05-import-logs/
    target-import-log.md
    target-qa-diff.md
```

## First 30 Minutes If Support Reopens The Store

1. Confirm exact frozen `.myshopify.com` domain and theme IDs.
2. Run `shopify theme list` and immediately pull the frozen dev theme.
3. Export products from Shopify Admin as CSV as a fallback.
4. Run API export for products, variants, media, metafields, collections, pages, menus, policies, files, redirects, markets, locations, inventory, discounts, metaobjects, and shop settings.
5. Screenshot settings that are risky or not cleanly portable: taxes, shipping/delivery, markets, payments, domains, notifications, checkout, store details, customer accounts, locations, apps, and Online Store preferences.
6. Check export counts before leaving the access window.
7. Do not edit the frozen store except to create temporary read/export access.

## Transfer Inventory

### 1. Theme And Online Store

Source to transfer:

- Full remote theme from frozen store, not just local files.
- Local theme source in `bjerrehuus-theme/`.
- Theme settings: `config/settings_data.json`, `config/settings_schema.json`.
- Templates: home, collection, product, page templates, cart, search, customer/account, password, 404.
- Sections/snippets/assets, including Bjerrehuus custom CSS/JS and logo/image assets.
- Branded email templates already stored locally:
  - `bjerrehuus-theme/assets/email-order-confirmation.html`
  - `bjerrehuus-theme/assets/email-shipping-confirmation.html`

How to export:

```bash
shopify theme list --store <frozen-store>.myshopify.com --password "$SOURCE_THEME_TOKEN" --json
shopify theme pull --store <frozen-store>.myshopify.com --password "$SOURCE_THEME_TOKEN" --theme <frozen-dev-theme-id> --path exports/store-transfer-2026-05-13/01-theme/frozen-theme-pull --nodelete
```

How to transfer:

- Push as a new unpublished theme to the May 2 target store.
- Do not overwrite the target live theme until QA passes.
- Use a clear theme name such as `Bjerrehuus Dawn Rebuild`.
- After push, verify theme URLs, image URLs, section settings, and customizer content.

Known local theme surface:

- Header/nav/wishlist/language placeholder: `sections/header.liquid`
- Footer/contact/newsletter/social: `sections/footer.liquid`
- Product page branching by `custom.purchase_type`: `sections/bjfj-product-main.liquid`
- Inquire modal: `snippets/inquire-letter-modal.liquid`
- Collection layout: `sections/shop-layout.liquid`, `sections/shop-campaign-tiles.liquid`
- Universe/inspiration/about templates and sections.

### 2. Products

Source to transfer:

- All products, especially the 17 active products that were live in frozen admin.
- Product title, handle, status, vendor, product type, category, tags.
- Product description HTML.
- SEO title and SEO meta description.
- Product options and option values.
- All variants: title, SKU, barcode, price, compare-at price, taxable flag, inventory policy, inventory tracking, weight, selected options.
- Product media/images: URLs, ordering, alt text, videos if any.
- Product-template associations if present.
- Product publication status/sales channels.
- Product collection membership.
- Product metafields.

Known launch-critical metafields:

- `custom.purchase_type`
- `custom.material`
- `custom.diamond_spec`
- `custom.inspiration_collection`
- `custom.is_bridal`
- `custom.wedding_inquire_eligible`

Known product count:

- Frozen admin had 17 active products.
- Local docs only fully specify the 4 Pillow products and partial Classic seed data, so the frozen store export is the source of truth for exact product descriptions, prices, SEO, images, variant details, and tax flags.

How to transfer:

1. Create metafield definitions on the target store first.
2. Upload/recreate products with variants/options.
3. Upload/relink media.
4. Set product metafield values.
5. Reattach products to manual collections if any.
6. Verify every handle and product URL.

### 3. Collections

Source to transfer:

- All collection handles, titles, descriptions, SEO titles, SEO descriptions, images, alt text.
- Collection type: manual vs automated.
- Automated collection rules and sort order.
- Manual collection product memberships and sort order.
- Collection template suffixes if present.

Known launch collections:

- `pillow`
- `bridal`
- `classic`
- `classic-tennis`
- `classic-necklaces`
- `classic-hoops`
- `classic-alliancering` or renamed `classic-wedding-bands` if that change is live
- `classic-studs`

How to transfer:

- Recreate automated collections before/alongside product tags.
- Recreate manual collections after products exist.
- Verify `/collections/all` and every collection handle from the export.

### 4. Pages, Blogs, Universe, And Inspiration Content

Source to transfer:

- All pages: title, handle, body HTML, template suffix, SEO fields if available, metafields.
- Any blogs/articles: blog handle, article title, body, summary, image, tags, metafields.
- Universe/inspiration page content and template assignment.

Known launch pages:

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

How to transfer:

- Create pages before pushing final navigation.
- Assign the matching page templates from the rebuilt theme.
- Verify footer/header links resolve to the new target store pages.

### 5. Navigation Menus

Source to transfer:

- All menus and nested menu items.
- Menu handles, titles, item labels, URLs, page/product/collection references.

Known launch menus:

- `main-menu`: Shop, Universe dropdown with Meet Vibe/Universe, Book Appointment.
- `footer-menu-brand`
- `footer-menu-care`

How to transfer:

- Recreate menus after pages and collections exist.
- Check disabled Book Appointment behavior in theme remains intact.

### 6. Metafield Definitions, Metafields, Metaobjects

Source to transfer:

- Product metafield definitions, including namespace, key, name, type, validations, access, pinned status.
- Any collection/page/shop metafield definitions if they exist.
- All metafield values on products, collections, pages, articles, shop.
- Any metaobject definitions and entries.

How to transfer:

- Definitions first.
- Resource import second.
- Values third.
- Export target and compare counts/keys after import.

### 7. Files And Media

Source to transfer:

- Shopify Files library: image/video/file names, alt text, content type, original URL, references.
- Theme setting URLs that point to old store CDN files.
- Product media and collection images.
- External Squarespace placeholder image URLs still used in theme settings.

How to transfer:

- Prefer uploading files to the target store's Files library.
- Replace old store CDN URLs in `settings_data.json` and template JSON if they point to the frozen store.
- Product media should be uploaded to products, not only to Files.
- External Squarespace placeholder URLs can remain temporarily, but any frozen-store CDN URL should be treated as fragile and replaced.

### 7.5 Online Store Preferences, SEO, And Redirects

Source to transfer:

- Homepage title and homepage meta description.
- Social sharing image.
- Storefront password/password message.
- URL redirects.
- Tracking/pixel fields if anything was configured.
- Customer privacy/banner settings if configured.
- Search engine listing fields on products, collections, pages, and blogs.

How to transfer:

- Export URL redirects by API.
- Screenshot Online Store > Preferences.
- Preserve resource-level SEO through product/collection/page/blog import.
- Recreate tracking/pixels manually only if they were intentionally configured.

### 8. Policies And Legal Pages

Source to transfer:

- Privacy Policy.
- Refund/Return Policy.
- Shipping Policy.
- Terms of Service.
- Contact Information.
- Legal Notice.
- Any custom legal/customer-care pages.

How to transfer:

- Export policy bodies as HTML/text.
- Recreate in target Admin > Settings > Policies.
- Verify footer links and `/policies/...` URLs.

### 9. Shipping, Delivery, Markets

Source to transfer:

- Shipping profiles.
- Shipping zones.
- Rates and conditions.
- Markets/currency setup.
- Local pickup disabled state.
- Delivery-only launch behavior.
- Package/default package settings if configured.

Known launch settings:

- Denmark: free shipping, 0 DKK.
- Outside Denmark/international: Standard, 299 DKK.
- Local pickup: not in launch scope.
- English-only launch.

How to transfer:

- Export via API where available, but screenshot the Admin pages because shipping and market settings are easy to misread.
- Recreate manually in the target store unless the API export/import is clearly clean.
- Verify by checkout test:
  - Denmark postal code `2100` => 0 DKK.
  - Germany `10115` => 299 DKK.
  - United States NY `10001` => 299 DKK.

### 10. Taxes, Duties, VAT

Source to transfer:

- Tax region setup.
- VAT/CVR registration settings.
- Whether prices include tax.
- Whether shipping is taxable.
- Product/variant taxable flags.
- Any product tax category assignments or overrides.
- Duties/import tax settings if any.

How to transfer:

- Treat tax as a manual verification item, not a blind script import.
- Screenshot all tax settings in the frozen store.
- Preserve product/variant `taxable` flags during product import.
- In the target store, confirm with Vibe/bookkeeper before launch if VAT setup differs.

### 11. Payments, Wallets, MobilePay, Klarna

Source to transfer:

- Current payment provider state.
- Shopify Payments progress/blockers.
- Wallet toggles: Apple Pay, Google Pay, Shop Pay.
- MobilePay availability/setup status.
- Klarna status if enabled.

How to transfer:

- Payment/KYC setup cannot be meaningfully migrated from the frozen store.
- Keep/rebuild payments directly on the May 2 target store with Vibe as owner.
- Use the frozen store only as a reference screenshot if anything was already configured there.

Known launch decision:

- Cards, MobilePay, Apple Pay, Google Pay, Shop Pay.
- Klarna is phase two unless Vibe explicitly wants it at launch.

### 12. Notifications And Email

Source to transfer:

- Notification sender email/name.
- Customer notification template edits, if any were pasted.
- Order confirmation HTML.
- Shipping confirmation HTML.
- Email verification state.
- Customer/contact emails.

How to transfer:

- Use the local branded templates unless the frozen store has newer changes.
- Paste manually into target Admin > Settings > Notifications after owner email verification unlocks it.
- Confirm sender email/domain verification on the target store.

### 13. Forms, Apps, Sales Channels

Source to transfer:

- Installed apps list.
- Shopify Forms configuration, if any exists.
- Shopify Email/newsletter defaults if configured.
- Online Store sales channel.
- Any app embeds in the theme.

How to transfer:

- Apps generally do not transfer cleanly. Reinstall/configure on the target store.
- Shopify Forms was not finalized because email/account verification blocked it.
- Keep the existing `/contact` modal fallback until Forms routing is confirmed.

### 14. Store Settings

Source to transfer:

- Store name: Bjerrehuus Fine Jewellery.
- Legal business name, address, CVR, phone.
- Contact email and sender email.
- Timezone: Europe/Copenhagen.
- Currency and formatting.
- Order ID prefix/suffix if changed.
- Customer accounts setting.
- Checkout settings.
- Storefront password/password page state.
- Domain/primary domain state.
- Location/fulfillment settings.

How to transfer:

- Export what the API exposes.
- Screenshot every settings page listed above.
- Keep target-store-specific settings that are already correct, especially domain, owner email, payment/KYC, and subscription.

### 15. Discounts, Customers, Orders

Source to transfer:

- Discounts/discount codes if any.
- Gift cards if any.
- Customer records only if real customers were created.
- Orders only if real/test orders matter.

Expected launch state:

- No real order/customer history should need migration from the frozen store.
- If test orders exist, document them but do not recreate unless Patrick explicitly asks.

## Import Order On Target May 2 Store

1. Confirm target store access: Theme Access + Admin API token.
2. Back up current May 2 target theme/admin state before changing anything.
3. Create/import metafield definitions.
4. Upload files/media needed by theme and products.
5. Create pages and policies.
6. Create collections.
7. Create products, variants, media, SEO, tax flags, and metafields.
8. Attach products to manual collections and verify automated rules.
9. Recreate menus.
10. Push theme as unpublished.
11. Replace frozen-store CDN URLs in theme settings.
12. Recreate shipping, delivery, markets, taxes, checkout, and store settings manually from screenshots/API export.
13. Paste notification templates after target email verification.
14. Install/configure Shopify Forms only after target email/account verification is complete.
15. Run QA, then publish only after Patrick/Vibe approval.

## QA Reconciliation Checklist

Must match source export:

- Product count: 17 active products unless source export says otherwise.
- Every product handle, title, description, SEO title, SEO description.
- Every variant option, price, SKU, taxable flag, inventory/tracking flag.
- Product media count/order/alt text.
- Six product metafield definitions and all product metafield values.
- Eight launch collections and their rules/memberships.
- Twelve launch pages plus any policy/legal pages.
- Three launch menus and nested item URLs.
- Policies: privacy, refund/return, shipping, terms, contact information, legal notice.
- Shipping rates: DK 0 DKK, international 299 DKK.
- Store details: name, contact email, timezone, currency, address/CVR/phone.
- Header, footer, homepage, collection, product, cart, search, Universe, Meet Vibe, 404, account, password page.
- Inquire modal sends product name, handle, URL, customer email/message to `vibe@stylesnob.com`.
- One real paid order/refund after Shopify Payments is approved on target.

## What We Can Rebuild Without Frozen Store Access

We can rebuild most of the site from local source:

- Theme code and assets in `bjerrehuus-theme/`.
- Branded email HTML.
- Known pages/menus/collections from `AGENTS.md` and launch docs.
- Known metafield architecture.
- Known shipping-rate intent.
- Four fully documented Pillow products and partial Classic seed data.

What we cannot guarantee without frozen store export:

- Exact 17-product catalog details.
- Any product descriptions added directly in Shopify Admin.
- Product SEO titles/descriptions.
- Exact product image ordering and alt text.
- Exact variant taxable/inventory settings.
- Exact policy bodies currently live in admin.
- Any settings changed directly in Shopify Admin after the local docs were written.

## Support Call Script

Use this with Shopify Support:

> We accidentally transferred a client transfer store before realizing the client already had an owned Shopify store with the correct subscription/domain setup. The transferred store is now frozen because the client has not activated a paid plan. We do not want to launch or keep that transferred store. We only need temporary access so we can export the theme, products, product SEO, metafields, collections, pages, policies, navigation, files, shipping/tax/settings screenshots, and rebuild them on the client's existing owned store where we already have collaboration access. Can you grant temporary admin/theme/API access or advise the safest export path?

## Execution Rule

During the temporary access window, export first and change nothing on the frozen store unless absolutely required to create read/export access. The frozen store is evidence/source material now; the May 2 store is the build target.
