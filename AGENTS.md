# Bjerrehuus Fine Jewellery — Codex Instructions

## Working style
- Direct and fast. No padding, no lecturing.
- Give one lean recommendation, not a list of options.
- When something is blocked or errored, fix it — don't explain it at length.
- Vibe communications: Danish, warm. Patrick communications: English.
- Confirm before deleting anything.

---

## Store

| | |
|---|---|
| myshopify domain | `bjerrehuus-fine-jewelry.myshopify.com` |
| Theme in use (dev) | `Bjerrehuus Dawn (Dev)` — ID `196302537038` |
| Live theme (untouched) | `Horizon` — ID `196177133902` |
| Admin API token | in `.env` → `SHOPIFY_ACCESS_TOKEN` |
| CLI theme token | in `.env` → `SHOPIFY_CLI_THEME_TOKEN` |

**Theme push command:**
```
cd bjerrehuus-theme && shopify theme push --store bjerrehuus-fine-jewelry.myshopify.com --theme 196302537038
```

---

## Current launch state

### Canonical folders
| Path | Purpose |
|---|---|
| `bjerrehuus-theme/` | Shopify Dawn fork. This is the deployable theme. |
| `docs/current/` | Two active final launch docs: internal checklist + client-dependent tasks. |
| `reference/` | Source/reference material only. Not the active task list. |
| `client-docs/` | Client onboarding PDFs and packshot notes. Preserve. |
| `client-assets/` | Brand/logo source files. Preserve. |
| `tools/maintenance/` | One-off/admin scripts kept for audit history. |

### What's live in theme code
| Section / file | What it does |
|---|---|
| `sections/header.liquid` | Nav, logo, wishlist placeholder, language toggle |
| `sections/footer.liquid` | 2-col links + contact block (email, WhatsApp, newsletter, social) |
| `sections/bjfj-product-main.liquid` | Product page — branches on `purchase_type`: Add-to-Cart vs Inquire modal |
| `sections/shop-layout.liquid` | Collection page: sidebar nav + 3-col product grid |
| `sections/shop-campaign-tiles.liquid` | 3 editorial tiles at top of `/collections/all` |
| `templates/collection.json` | Wires banner → tiles → shop layout |
| `snippets/header-dropdown-menu.liquid` | Nav dropdown — Book Appointment auto-disables (lines 83–93) |
| `assets/bjerrehuus-header.css` | Nav disabled state + tooltip styles |
| `assets/bjerrehuus-theme.css` | Global custom styles (tokens, typography, grid) |

### What's live in Shopify admin (via API)
- **6 metafield definitions** (owner: PRODUCT): `custom.purchase_type`, `custom.material`, `custom.diamond_spec`, `custom.inspiration_collection`, `custom.is_bridal`, `custom.wedding_inquire_eligible`
- **4 Pillow products** with `purchase_type` set, prices in DKK, full variant sets (see below)
- **8 collections**: `pillow` (automated, tag=pillow), `bridal`, `classic`, `classic-tennis`, `classic-necklaces`, `classic-hoops`, `classic-alliancering`, `classic-studs`
- **12 pages**: `our-purpose`, `production-responsibility`, `diamonds`, `customer-care`, `shipping-delivery`, `returns-exchange`, `jewellery-care`, `size-guides`, `meet-vibe`, `universe`, `book-appointment`, `pillow`
- **3 menus**: `main-menu` (Shop, Universe▾[Meet Vibe, Universe], Book Appointment), `footer-menu-brand`, `footer-menu-care`

### Pillow product variants (current)
| Product | Variants | Price DKK |
|---|---|---|
| Pillow Boomrang ørering | Hvidguld/Venstre, Hvidguld/Højre, Guld/Venstre, Guld/Højre, Rosaguld/Venstre, Rosaguld/Højre | 16,200 |
| Pillow studs | Hvidguld, Guld, Rosaguld | 14,200 |
| Pillow bracelet small | Hvidguld, Guld, Rosaguld | 41,100 |
| Pillow 13-link pavé ørering | Hvidguld, Guld, Rosaguld | 36,600 |

---

## Remaining launch work

Source of truth: `docs/current/INTERNAL-FINAL-CHECKLIST.md`.

Only the final manual/client-dependent steps remain:
- Shopify Payments / KYC / MobilePay / wallets.
- Branded transactional emails after client account/email verification.
- Shopify Forms for inquire routing after client account/email verification.
- Domain connection.
- Final QA, one real order/refund test, and one real inquire test.
- Loom/admin handoff after QA.

---

## Locked architecture decisions (do not re-open unless Patrick asks)
- Theme base: Dawn fork. No premium theme.
- All products = Shopify Products. `custom.purchase_type` = `shoppable` or `inquire` drives the CTA.
- Inquire = pop-up letter modal. Pre-fills product context, submits to vibe@stylesnob.com.
- Wishlist = phase 2. Heart icon placeholder only at launch.
- Universe content = Shopify Pages with custom templates.
- Languages: English-only at launch. Danish/Translate & Adapt is post-launch unless Patrick reopens scope.
- Payments at launch: Cards + MobilePay + Apple Pay + Google Pay + Shop Pay. Klarna = phase 2.
- Not in launch scope: e-conomic, Klaviyo.

---

## Key reference files
| File | When to use |
|---|---|
| `docs/current/INTERNAL-FINAL-CHECKLIST.md` | Active internal handoff and final checklist for Patrick + Codex. |
| `docs/current/CLIENT-DEPENDENT-TASKS.html` | Client-facing/client-dependent task sheet. |
| `reference/bjerrehuus-fine-jewellery-build-plan.md` | Full build spec; historical detail, not the active task list. |
| `reference/VIBE_EMAIL_AND_TRANSCRIPT.md` | Vibe's vision, tone, priorities. Source of truth for brand decisions. |
| `reference/style-tile.html` | Approved design tokens (colors, fonts, spacing). Match this. |
| `reference/shopify-knowledge-base.md` | Shopify platform reference. |
| `client-docs/onboarding/` | Vibe's onboarding PDFs. Not build files. |
| `client-docs/packshots/` | Packshot photography assets from India. |
