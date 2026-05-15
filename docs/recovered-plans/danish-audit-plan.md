# Bjerrehuus — Collaboration Store Re-Audit, Policies, Missing Apps, Danish Launch

## Context

We're mid-rebuild on the collaboration store `dvzxta-0m.myshopify.com`. Prior status snapshots claim "content is done"; a fresh live audit shows otherwise. On top of that, the client just expanded scope: launch is now **Danish-only**, single Danish market, with full translation of products, descriptions, copy, and theme strings. Patrick has also flagged that the previous store had a VAT app installed that is missing here, and that a number of small gaps almost certainly exist that earlier reports missed.

This plan covers: (1) what the live audit actually found, (2) policies rewrite, (3) the missing-app audit, (4) the full Danish translation pass. Visual/cross-browser QA, manual settings screenshots, and publishing are deliberately deferred.

---

## Audit findings (live, 2026-05-14)

### Collaboration store `dvzxta-0m.myshopify.com`

| Surface | Result |
|---|---|
| Products | 17 present, all metafields populated, images present (26 total, all Shopify CDN — no broken refs / Squarespace leftovers) |
| Collections | 9 exist BUT only `pillow` has product members. `bridal`, `classic`, `classic-tennis`, `classic-necklaces`, `classic-hoops`, `classic-wedding-bands`, `classic-studs` are **all empty** — 13 of 17 products orphaned from category pages |
| Pages | 21 present (12 expected + 9 extras: `contact` empty, `the-bridal`, `the-classic`, 4× `universe-story-*`, `terms-of-service`, `data-sharing-opt-out`) |
| Contact page | **Empty body (0 chars)** |
| Menus | 3 (cannot enumerate items — token scope) |
| Policies | API returned a single aggregated blob; per-policy verification blocked by scope. Import script previously failed (wrong mutation + missing `write_legal_policies` scope). Assume policies need rewriting |
| Metafield definitions | 6 — all present |
| Files | 30 (source had 28) |
| Markets | Denmark only, primary locale `en` |
| Shipping | 3 zones (DK / EU / international) — verified at storefront previously |
| Theme | `Bjerrehuus Draft` 196345627011 unpublished (expected); live theme still `Horizon` 195850142083 |
| Apps | **Audit blocked** — current token lacks `read_app_installations` scope on both target and source |
| Collection-handle drift | Docs say `classic-alliancering`; live store has `classic-wedding-bands` |

### Source store `bjerrehuus-fine-jewelry.myshopify.com` (frozen, read-only)

- 17 products / 9 collections / 21 pages all match target counts.
- 26 product images match — no media gap from Squarespace loss.
- Files library 28 (target has 30) — negligible.
- Apps inventory still blocked — needs token-scope fix or manual admin view.

### Danish translation scope (theme side)

| Surface | Status |
|---|---|
| `bjerrehuus-theme/locales/da.json` | Already present, complete for Dawn defaults (no custom keys missing) |
| Hardcoded English in `.liquid` | 8 literals: `sections/header.liquid:297-302` (Wishlist labels, "Coming soon"), `sections/shop-campaign-tiles.liquid:47,80,128,135,141` ("THE COLLECTION", "THE PILLOW", "THE SECOND", "THE THIRD"), `sections/inspiration-hero-collage.liquid:119` ("THE PILLOW") |
| Hardcoded English in template JSON | ~25 strings across `templates/index.json`, `templates/collection.json`, `templates/page.about.json`, `templates/page.inspiration.json`, `templates/page.inspiration-classic.json`, `templates/page.inspiration-bridal.json`, `templates/page.universe-index.json`, `templates/page.universe-story.json` — includes Vibe's bio, hero headlines, eyebrows, CTA labels, "Inquire about this piece" |
| Email templates | `assets/email-order-confirmation.html` + `assets/email-shipping-confirmation.html` — ~15 hardcoded English strings each; order-confirmation hardcodes "Tax (25% DK VAT)" which we keep |
| Admin content | 17 products (title/desc/SEO/variants), 8–9 collections (title/desc/SEO), 12 pages (title/body/SEO), 6 policies, 3 menus, 6 metafield definition names + string-typed values (`custom.material`, `custom.diamond_spec`) |
| Shopify-managed notifications | 8+ transactional templates need Danish via admin |

---

## Work plan (scoped to what Patrick authorized now)

### 1. Policies — fresh write

Rewrite all six policies from scratch, using best-practice Danish e-commerce law (forbrugeraftaleloven 14-day fortrydelsesret, købeloven, GDPR/persondataloven, momsloven 25% VAT, e-mærket-style transparency). Cross-reference competitor policies the client has named.

Output **two versions** for each policy: an English master + a Danish version (since the site is going Danish, Danish is primary). Hand off to client for review before pushing to admin.

Six policies:
- Privacy policy (privatlivspolitik)
- Refund / return policy (returpolitik / fortrydelsesret)
- Shipping policy (leveringspolitik)
- Terms of service (handelsbetingelser)
- Contact information (kontaktoplysninger)
- Legal notice (juridiske oplysninger)

Legal entity used inside the policy bodies: **Bungalow Production ApS, CVR 39641763**. No street address or phone. Contact email `vibe@stylesnob.com`. Customer-facing brand stays `Bjerrehuus Fine Jewellery`.

**Push mechanism:** I'll add `write_legal_policies` to the custom app scope (and `read_app_installations` while I'm in there), regenerate the token, and push policies via the migration script after fixing the GraphQL mutation signature (`shopPolicyUpdate` now requires `shopPolicy: { type: ..., body: ... }`). Manual paste into Admin > Settings > Policies stays the fallback.

### 2. Missing apps — fix scope, then diff

Update the custom apps on both stores to add the scopes we need (`read_app_installations`, `write_legal_policies`, plus any other read scopes we're brushing against). Custom-app config lives in the project / Partners Dev Dashboard, not in admin settings. Regenerate tokens, update `.env`, then query `appInstallations` on both stores.

Deliverable: concrete diff list of apps on source but not target. Specifically hunt for: VAT / EU tax compliance, reviews, currency/markets, SEO/sitemap, email/Klaviyo (out of launch scope — verify nothing's running on target), inventory/POS, anything Vibe added directly.

Reinstall the VAT app (likely "Quaderno", "Sufio", "Hellotax", or Shopify Tax) once identified. Avoid reinstalling phase-two apps (Klaviyo, e-conomic) per locked decisions in `CLAUDE.md`.

### 3. Empty collections — assign product memberships

Decide approach per collection: automated by tag/metafield vs manual.

Current state: only `pillow` has rules. The cleanest fix is to lean on the existing `custom.inspiration_collection` metafield (already on every product) and convert the empty collections to automated rules keyed on that metafield value, plus tag-based rules for sub-types (tennis / necklaces / hoops / studs / wedding-bands). Re-use `custom.is_bridal` boolean for `bridal`.

Apply the handle rename: live `classic-wedding-bands` → `classic-alliancering`. Update the main-menu Shop dropdown item, the `shop-campaign-tiles` references, any product `inspiration_collection` metafield values, and the inspiration page templates.

### 4. Page cleanup

See the "Extra pages" table above. Concrete actions:

- **Populate** `contact` (empty) with Danish contact block — `vibe@stylesnob.com`, social, appointment CTA, customer-facing brand `Bjerrehuus Fine Jewellery` (no CVR / no legal entity name on this page; legal info lives in policies).
- **Fetch full bodies** of `the-bridal`, `the-classic`, and `terms-of-service` page, paste them in chat, get explicit "delete" confirmation, then remove.
- **Keep & translate** the 4 `universe-story-*` pages and `data-sharing-opt-out`.

### 5. Danish translation — full pass

**Approach**: hybrid. Heavy lift goes into editing template JSON directly (faster, content is not theme-editor-managed by Vibe). Section literals get refactored into locale keys so the theme is i18n-correct.

Steps:

a) **Theme strings (~8 literals)**: refactor `sections/header.liquid:297-302`, `sections/shop-campaign-tiles.liquid:47/80/128/135/141`, `sections/inspiration-hero-collage.liquid:119` to use `{{ 'key' | t }}` patterns. Add Danish keys to `locales/da.json` and English keys to `locales/en.default.json` (mirror).

b) **Template JSON copy (~25 strings)**: directly replace English with Danish in `templates/index.json`, `templates/collection.json`, `templates/page.about.json`, `templates/page.inspiration.json`, `templates/page.inspiration-classic.json`, `templates/page.inspiration-bridal.json`, `templates/page.universe-index.json`, `templates/page.universe-story.json`. Includes Vibe's bio paragraphs and hero/eyebrow lines.

c) **Email templates**: translate `assets/email-order-confirmation.html` and `assets/email-shipping-confirmation.html` to Danish (keep DK VAT line; localize date/currency formats already DKK-correct).

d) **Set primary locale**: ensure `config/settings_data.json` and Shopify admin both reflect Danish as the default storefront locale; remove English unless we want a fallback.

e) **Admin content translation** (Shopify admin work, no theme files):
- 17 products: title, description HTML, SEO title + description, variant option names ("Material"→"Materiale"; "Side"→"Side"), variant option VALUES ("White Gold"→"Hvidguld", "Yellow Gold"→"Guld", "Rose Gold"→"Rosaguld", "Left"→"Venstre", "Right"→"Højre").
- 8–9 collections: title, description, SEO. Apply handle decision.
- 12 pages (`our-purpose`, `production-responsibility`, `diamonds`, `customer-care`, `shipping-delivery`, `returns-exchange`, `jewellery-care`, `size-guides`, `meet-vibe`, `universe`, `book-appointment`, `pillow`): title, body, SEO.
- 6 policies: Danish bodies pasted in (from step 1).
- 3 menus: item labels.
- Metafield definition display names + descriptions; metafield string-typed values for material / diamond spec.

f) **Shopify-managed notification emails (8+)**: translate via Admin > Settings > Notifications. Defer the order/shipping notifications until Vibe verifies the owner email (already a known blocker per `INTERNAL-FINAL-CHECKLIST.md` step 2).

g) **Storefront password page message**: Danish copy.

---

## Critical files & references

- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/locales/da.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/locales/en.default.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/sections/header.liquid`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/sections/shop-campaign-tiles.liquid`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/sections/inspiration-hero-collage.liquid`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/templates/index.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/templates/collection.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/templates/page.about.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/templates/page.inspiration*.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/templates/page.universe-*.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/assets/email-order-confirmation.html`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/assets/email-shipping-confirmation.html`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /bjerrehuus-theme/config/settings_data.json`
- `/Users/patrickhansen/Desktop/Shopify - Bjerrehuus Fine Jewelry  /tools/migration/` (scripts to fix if we want to re-run policy import via API)

---

## Decisions locked

| Topic | Decision |
|---|---|
| Legal entity (policies only) | **Bungalow Production ApS — CVR 39641763**. No address, no phone in policies. |
| Customer-facing name (everywhere else) | **Bjerrehuus Fine Jewellery** (unchanged). |
| Collection slug | Rename live `classic-wedding-bands` → **`classic-alliancering`**. Update menu, campaign tiles, theme references, and any product metafield references. |
| Campaign tile labels | Switch the three "Discover X" tiles to Danish equivalents that read well. Working choices: `Opdag Bridal` / `Opdag Classic` / `Opdag Pillow`, or shorter `Bridal-kollektion` / `Classic-kollektion` / `Pillow-kollektion`. Pick whichever reads cleaner against the actual tile artwork. |
| Theme i18n | Hybrid — refactor the 8 hardcoded section literals into locale keys (`da.json` + `en.default.json`), edit the ~25 template-JSON copy lines directly to Danish (those are settings/content blocks, not strings worth a locale layer). |
| Apps scope | I'll add `read_app_installations` (plus `write_legal_policies` so the policy importer works) to the custom apps via the Partners / Dev Dashboard, regenerate tokens, then pull the diff. No screenshots needed. |

## Extra pages — what they actually are, and the fix

Live audit returned 21 pages vs the 12 documented in `CLAUDE.md`. Here's every page, what it contains, and the proposed action. None get deleted without explicit go-ahead — I'll bring this list back as a confirmation step before any delete.

| Handle | Body length | What it is | Action |
|---|---|---|---|
| `contact` | 0 chars | Empty — created but never filled | **Populate** with Danish contact block (Bjerrehuus name, `vibe@stylesnob.com`, social, appointment CTA) |
| `the-bridal` | 19 chars | Orphan stub, likely an early scaffold | Confirm with Patrick, then delete |
| `the-classic` | 19 chars | Same — orphan stub | Confirm with Patrick, then delete |
| `universe-story-1` | ~46–1.4k chars | Universe story (legacy numbering) | Keep — likely linked from `/universe`. Translate to Danish, rename to a meaningful handle |
| `universe-story-power` | "" | Universe story | Keep, translate |
| `universe-story-2023` | "" | Universe story | Keep, translate |
| `universe-story-bugatti` | "" | Universe story | Keep, translate |
| `terms-of-service` | 3559 chars | **Duplicate** of the Settings > Policies "Terms of service" | Delete the page, keep the policy as the canonical |
| `data-sharing-opt-out` | 2601 chars | GDPR opt-out page (referenced from privacy policy) | Keep, translate, link from the new privacy policy footer |

I read the actual bodies before any delete and confirm intent in chat first — nothing destructive without an explicit nod.

---

## Verification

When implementation begins, verify end-to-end by:

- `shopify theme check --path bjerrehuus-theme` → 0 errors.
- Spot-check 3 product pages on preview URL `https://dvzxta-0m.myshopify.com?preview_theme_id=196345627011` (password `rteipe`): all copy Danish, no leftover English literals, variant option labels Danish, currency DKK.
- Browse `/collections/bridal`, `/collections/classic`, `/collections/classic-tennis`, `/collections/classic-studs`, `/collections/classic-hoops`, `/collections/classic-necklaces`, `/collections/classic-wedding-bands` (or alliancering): each shows expected products.
- `/pages/contact` shows populated Danish content.
- `/policies/privacy-policy`, `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service`, `/policies/legal-notice`, `/policies/contact-information` each show the new Danish bodies.
- Submit one inquire from a Danish product page: confirm pre-filled fields and email arrives at `vibe@stylesnob.com`.
- Storefront language: `https://dvzxta-0m.myshopify.com/` defaults to Danish, no English fallback visible unless explicitly toggled.
- Apps diff committed as a doc in `docs/current/` so the next session has the source-of-truth list.

Deferred (per Patrick): visual QA tracker pass, cross-browser/mobile QA, theme publish, manual settings screenshots, real paid order test, real inquire test, domain connection, Loom/admin handoff.
