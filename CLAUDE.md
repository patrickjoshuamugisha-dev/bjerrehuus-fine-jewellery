# Bjerrehuus Fine Jewellery — Claude Code Instructions

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

## Build status — Days 1–4 complete

### What's live in theme code (`bjerrehuus-theme/`)
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

## Remaining build (Days 5–7)

### Day 5 — Inspiration pages + Universe + About
- `page.inspiration.json` template with sections: `inspiration-hero-collage`, `inspiration-product-cutout`, `inspiration-mood-board`, `inspiration-product-grid`, `wedding-inquire-cta`
- Instantiate 3 pages: `/pages/pillow` (full), `/pages/inspiration-2`, `/pages/inspiration-3` (scaffolds)
- `page.universe-story.json` template + sections
- `page.about.json` for Meet Vibe
- `page.universe-index.json` — lists stories
- 1 placeholder Universe story

### Day 6 — Homepage + cart + payments + integrations
- `index.json` homepage: hero-video, feature-images-pair, text-divider, discover-tiles
- Cart drawer + `cart.json` (pickup/ship toggle, order notes)
- Payment methods: Shopify Payments, MobilePay
- Shipping zones: DK + EU
- e-conomic sync app
- Branded transactional emails
- Shopify Forms for Inquire submissions

### Day 7 — QA + handoff
- Cross-browser + mobile audit
- Accessibility (WCAG AA)
- End-to-end order + inquire test
- Loom walkthrough for Vibe
- Admin handoff

### Last Day Additional Steps (manual, Patrick does these)
See `LAST-DAY-ADDITIONAL-STEPS.md` — Markets, Translate & Adapt, Klaviyo.

---

## Locked architecture decisions (do not re-open unless Patrick asks)
- Theme base: Dawn fork. No premium theme.
- All products = Shopify Products. `custom.purchase_type` = `shoppable` or `inquire` drives the CTA.
- Inquire = pop-up letter modal. Pre-fills product context, submits to client@bjerrehuusfinejewellery.com.
- Wishlist = phase 2. Heart icon placeholder only at launch.
- Universe content = Shopify Pages with custom templates.
- Languages: EN now, DK before public launch (Markets + Translate & Adapt).
- Payments at launch: Cards + MobilePay + Apple Pay + Google Pay + Shop Pay. Klarna = phase 2.

---

## Key reference files
| File | When to use |
|---|---|
| `reference/bjerrehuus-fine-jewellery-build-plan.md` | Full 14-section build spec. Check before building anything new. |
| `reference/VIBE_EMAIL_AND_TRANSCRIPT.md` | Vibe's vision, tone, priorities. Source of truth for brand decisions. |
| `reference/style-tile.html` | Approved design tokens (colors, fonts, spacing). Match this. |
| `reference/shopify-knowledge-base.md` | Shopify platform reference. |
| `LAST-DAY-ADDITIONAL-STEPS.md` | 3 manual tasks for last day: Markets, Translate & Adapt, Klaviyo. |
| `client-docs/onboarding/` | Vibe's onboarding PDFs. Not build files. |
| `client-docs/packshots/` | Packshot photography assets from India. |
