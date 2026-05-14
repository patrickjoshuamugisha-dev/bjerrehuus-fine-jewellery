# Collaboration Store Rebuild QA Plan

> Created: 2026-05-14  
> Active target store: `dvzxta-0m.myshopify.com`  
> Active draft theme: `Bjerrehuus Draft` (`196345627011`)  
> Goal: rebuild the collaboration-store draft as close as possible to the client-transfer store using local repo assets, screenshots, visible Shopify data, and manual QA, without waiting for the restored transfer store.

## Source Priority

1. Screenshots from the old preview/client-transfer store.
2. Existing local theme files in `bjerrehuus-theme/`.
3. Current collaboration-store admin data.
4. Docs and migration manifest in `docs/current/` and `exports/store-transfer-2026-05-14/`.
5. Restored transfer store, if it comes back later, only for final diff and exact content reconciliation.

Do not use Squarespace as a source. It is no longer visible.

## Working Rules

- Work only on the draft theme unless explicitly publishing.
- Keep `Horizon` live until final approval.
- Push incremental changes to `Bjerrehuus Draft` after validation.
- Validate each theme change with Shopify Theme Check and targeted theme validation.
- Keep a visible issue log as pages are reviewed.
- Treat restored-store access as a later reconciliation pass, not a blocker.

## Phase 1: Header And Footer Parity

This is the first visible mismatch.

### Header Target From Screenshot

- White header band.
- Centered `BJERREHUUS / FINE JEWELLERY` logo, large and airy.
- Left navigation:
  - `Shop`
  - `Universe` with a small down chevron
  - `Book Appointment` in a disabled/soft grey state if booking is not ready
- Right icons:
  - Search
  - Wishlist/heart visual placeholder
  - Cart bag
- Header should sit above the hero, not overlay it.
- Desktop spacing should feel wide, quiet, and symmetrical.
- Mobile should keep a clean drawer experience with the same menu hierarchy.

### Footer Target From Screenshot

- Warm beige footer background.
- Large top padding and three-column desktop layout.
- Column 1 heading: `BJERREHUUS FINE JEWELLERY`
  - Our Purpose
  - Production & Responsibility
  - Diamonds: Nature & Lab
  - Privacy Policy
  - Terms of Service
- Column 2 heading: `CUSTOMER CARE`
  - Shipping & Delivery
  - Returns & Exchange
  - Jewellery Care & Repair
  - Size Guides
- Column 3 heading: `CONTACT`
  - `vibe@stylesnob.com`
  - `WhatsApp +45 22 77 36 84`
  - Newsletter input with `sign up` placeholder and right arrow
  - Instagram, Facebook, LinkedIn icons
- Bottom copyright centered:
  - `© 2026, Bjerrehuus Fine jewelry Powered by Shopify`

### Implementation Tasks

- Audit current `sections/header.liquid`, `assets/bjerrehuus-header.css`, `sections/footer.liquid`, and `assets/bjerrehuus-footer.css`.
- Make the desktop header match the old preview screenshot first.
- Make the footer match the old preview screenshot first.
- Confirm menus in the collaboration store point to the right pages/collections.
- Push to `Bjerrehuus Draft`.
- QA desktop and mobile.

### Acceptance Checks

- Header appears in the theme editor and storefront preview without needing custom admin setup.
- Logo is centered at desktop widths.
- Left nav and right icons align to the same visual baseline.
- Footer columns, typography, spacing, links, contact details, newsletter, and socials match the screenshot closely.
- No live theme changes.

## Phase 2: Home Page Reconstruction

### Pages / Sections To Compare

- Hero image, crop, text placement, CTA, scrim, and scale.
- Pillow feature pair.
- Text divider.
- Discover tiles:
  - Classic
  - Pillow
  - Bridal
- Footer transition spacing.

### Known Risks

- Some homepage images still reference frozen-store CDN and must be replaced before launch.
- Local theme assets are acceptable now; exact source media can be swapped later if restored-store media becomes available.

### Acceptance Checks

- Desktop first viewport matches the screenshot: header, hero image crop, text placement, and scale.
- Mobile first viewport remains polished and readable.
- All homepage links go somewhere useful in the collaboration store.

## Phase 3: Navigation And Store Structure

### Menus

- Main menu.
- Footer brand menu.
- Footer customer-care menu.
- Mobile drawer menu.
- Header `Universe` dropdown/children.

### Collections

- `/collections/all`
- `/collections/pillow`
- `/collections/bridal`
- `/collections/classic`
- `/collections/classic-tennis`
- `/collections/classic-necklaces`
- `/collections/classic-hoops`
- `/collections/classic-wedding-bands`
- `/collections/classic-studs`

### Acceptance Checks

- Header menu, footer menu, and mobile drawer agree.
- Missing or empty routes are either hidden, disabled, or routed to an existing page.
- Collection cards use correct imagery, titles, and spacing.

## Phase 4: Product And Inquiry Experience

### Product Types

- Shoppable products.
- Inquiry-only products.
- Bridal inquiry products.
- Pillow collection products.
- Classic collection products.

### Critical Checks

- Product title, price, material, diamond specification, image stack, product description.
- `custom.purchase_type`
- `custom.material`
- `custom.diamond_spec`
- `custom.inspiration_collection`
- `custom.is_bridal`
- `custom.wedding_inquire_eligible`
- Add-to-cart visibility for shoppable items.
- Inquiry button visibility for inquiry items.
- Inquiry modal hidden fields:
  - Product name
  - Product handle
  - Product URL
  - Customer email
  - Message

### Acceptance Checks

- Product pages do not look like default Dawn.
- Inquiry flow is testable from a product page.
- Cart flow works for shoppable products.

## Phase 5: Content Pages

### Required Pages

- Our Purpose
- Production & Responsibility
- Diamonds
- Customer Care
- Shipping & Delivery
- Returns & Exchange
- Jewellery Care
- Size Guides
- Meet Vibe
- Universe
- Book Appointment
- Pillow
- The Classic
- The Bridal

### Acceptance Checks

- Each page uses the intended Bjerrehuus layout, not default Dawn styling.
- Copy is present enough for preview even if exact restored-store copy arrives later.
- Images use local assets or Shopify-hosted target files.
- Header/footer remain consistent.

## Phase 6: System Pages

### Pages

- Cart
- Search
- 404
- Account login/register/reset
- Password page
- Gift card, if enabled

### Acceptance Checks

- No page feels broken or unstyled.
- Password page is acceptable while store remains protected.
- Search and cart icons route correctly.
- Empty states are graceful.

## Phase 7: Asset And Data Cleanup

### Asset Work

- Replace all remaining frozen-store CDN references.
- Upload final assets to the collaboration store Files or embed as theme assets.
- Keep `url-replacement-map.json` current.
- Do not reintroduce Squarespace URLs.

### Data Work

- Recreate/update metafield definitions in the collaboration store.
- Confirm products, collections, pages, menus, and policies are backed up from the correct store.
- Create a fresh `target-before` export for `dvzxta-0m.myshopify.com`.

## Phase 8: QA Pass

### Viewports

- Desktop wide.
- Laptop.
- Tablet.
- Mobile.

### Flows

- Home to collection.
- Collection to product.
- Product inquiry.
- Product add to cart.
- Cart update/remove.
- Search.
- Menu/drawer navigation.
- Footer links.
- Newsletter signup.
- 404 route.
- Account route.

### Output

- Maintain a QA tracker with:
  - Page
  - Issue
  - Severity
  - Fix owner
  - Status
  - Screenshot/reference

## Phase 9: Restored Store Reconciliation

When the restored transfer store becomes available:

- Pull the source theme.
- Export source admin content.
- Diff against the collaboration-store draft.
- Source wins for exact product descriptions, SEO, image order, alt text, policies, and admin-only edits.
- Local collaboration draft wins for code fixes and improvements already validated.

## Immediate Next Work Order

1. Fix header/footer to match the screenshots.
2. Push to `Bjerrehuus Draft`.
3. QA home page desktop/mobile.
4. Replace remaining frozen-store CDN URLs on the home page.
5. Continue through collections, product pages, content pages, and system pages.
