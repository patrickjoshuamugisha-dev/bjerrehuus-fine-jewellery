# Shopify Agency Knowledge Base
> Mugisha Marketing · Operator + Partner Reference · Last updated: May 2026
> Covers Shopify platform as of API version 2025-07 / knowledge cutoff Aug 2025

---

## Quick Reference Cheat Sheet

### Key URLs
| Resource | URL |
|---|---|
| Merchant Admin | `https://{store}.myshopify.com/admin` |
| Partner Dashboard | `https://partners.shopify.com` |
| Partner Academy | `https://www.shopify.com/partners/academy` |
| Shopify Dev Docs | `https://shopify.dev` |
| Help Center | `https://help.shopify.com` |
| App Store | `https://apps.shopify.com` |
| GraphiQL Explorer | `https://{store}.myshopify.com/admin/api/graphiql` |
| Community Forum | `https://community.shopify.com` |
| Changelog | `https://shopify.dev/changelog` |
| Status Page | `https://www.shopifystatus.com` |
| Partner Support | Chat via Partner Dashboard → Help |

### Plan Pricing (verify current rates at shopify.com/pricing)
| Plan | Monthly (annual) | Transaction Fee (no Shopify Payments) |
|---|---|---|
| Basic | ~$29 | 2% |
| Shopify | ~$79 | 1% |
| Advanced | ~$299 | 0.5% |
| Plus | ~$2,300+ | 0.15% |

### Key Rate Limits
| API | Limit |
|---|---|
| REST Admin | 40 req bucket, refills 2/sec |
| GraphQL Admin | 1,000 points/sec, query cost varies |
| Storefront API | 60 req/min per token |
| Webhook response | Must return 200 within 5 sec |

### Shopify CLI Quick Commands
```bash
npm install -g @shopify/cli          # install
shopify auth login                   # authenticate
shopify theme dev                    # live theme preview
shopify theme push                   # deploy theme
shopify theme pull                   # download theme
shopify theme check                  # lint
shopify app dev                      # run app locally
shopify app deploy                   # deploy app extensions
shopify app config link              # link app to toml
```

### Partner Revenue Share (verify current at partners.shopify.com)
| Type | Rate |
|---|---|
| Referral (standard merchant) | 20% of Shopify subscription, recurring |
| Referral (Plus merchant) | 20% of Shopify subscription, recurring |
| App revenue (first $1M/yr) | 0% taken by Shopify (you keep 100%) |
| App revenue (above $1M/yr) | 15% taken by Shopify (you keep 85%) |
| Development store transfer | 0% — no referral commission |

---

## A. Shopify Platform — Merchant Side

### A1. Admin Interface Overview

The Shopify Admin is the merchant's control center at `https://{store}.myshopify.com/admin`.

**Primary navigation sections:**
- **Home** — dashboard with today's sales, tasks, announcements
- **Orders** — all orders, drafts, abandoned checkouts, transfers
- **Products** — products, inventory, collections, gift cards, price lists (B2B)
- **Customers** — customer list, segments, companies (B2B)
- **Content** — pages, blog posts, files, menus, navigation
- **Finances** — Shopify Payments payouts, Balance, billing
- **Analytics** — reports, live view, dashboards
- **Marketing** — campaigns, automations, Shopify Email
- **Discounts** — discount codes and automatic discounts
- **Apps** — installed apps, app store
- **Settings** — everything: store details, payments, checkout, shipping, taxes, locations, staff, notifications, custom data (metafields), plan, billing

**Staff & permissions:**
- Staff accounts can have full access or restricted access per section
- Permissions: Orders, Products, Customers, Reports, Marketing, Discounts, Manage settings, etc.
- Two-factor authentication (2FA) can be required for all staff
- Owner account cannot be deleted; transfer ownership via Settings → Plan

⚠️ WARNING: Staff with "Manage settings" permission can change the payment provider, shipping rates, and export all customer data. Restrict this to trusted team members only.

⚠️ WARNING: Shopify does not have granular permission within a section (e.g., you can't give someone read-only Orders access — it's all or nothing per section on standard plans).

**Docs:** https://help.shopify.com/en/manual/your-account/staff-accounts

---

### A2. Products & Catalog

**Product structure:**
- Title, description (HTML), vendor, product type, tags
- Status: Active (visible in storefront), Draft (hidden), Archived (hidden, kept for records)
- **Variants:** up to 3 options (e.g., Size, Color, Material); max 100 variants per product
  - Each variant has its own price, compare-at price, SKU, barcode, weight, inventory
- **Media:** up to 250 images per product; supports video and 3D models (.glb)

**Inventory:**
- Track quantity: on/off per variant
- Inventory policy: "Deny" (stop selling when out of stock) vs "Continue" (allow negative inventory)
- Multiple locations: stock tracked per location
- Inventory adjustments: manual or via CSV import

**Metafields on products:**
- Custom data fields: `namespace.key` format (e.g., `custom.care_instructions`)
- Add metafield definitions in Settings → Custom data → Products
- Types: text, number, boolean, date, file, color, URL, product/page reference, JSON, etc.
- Display in theme via Liquid: `{{ product.metafields.custom.care_instructions.value }}`
- Connect to theme sections using the "Connect dynamic source" button in the theme editor (OS2.0)

**CSV import/export:**
- Export all products as CSV for bulk editing
- Import via CSV — required columns: Handle, Title, Body (HTML), Vendor, Type, Tags, Published, Variant fields

⚠️ WARNING: 3 options / 100 variants is a hard limit. Workarounds: use separate products linked by metafields, use a variants app, or restructure options (e.g., combine Size+Color into one option).

⚠️ WARNING: Archiving a product removes it from all collections and active discounts. Customers with old links get a 404. Use Draft status if you want to keep it accessible via direct URL.

⚠️ WARNING: Product handle (slug) changes break all existing URLs and external links. Always set up 301 redirects in Online Store → Navigation → URL Redirects.

**Docs:** https://help.shopify.com/en/manual/products

---

### A3. Collections

**Two types:**
1. **Manual collections** — you add products one by one; order is fully manual
2. **Automated collections** — rule-based; products auto-added when they match conditions

**Automated collection rules:**
- Conditions: product title, type, vendor, tag, price, compare-at price, weight, inventory, variant title
- Logic: "Must match ALL conditions" (AND) or "Must match ANY condition" (OR)
- Rules are evaluated when products are created/updated — not in real time for large catalogs

**Sort orders:**
- Manual, Best selling, Product title (A–Z, Z–A), Newest/oldest, Price (low–high, high–low)
- Manual sort only available in Manual collections

**Collection SEO:**
- Title, meta description, URL handle
- Collection image (not displayed in Dawn by default — requires theme customization or section setting)

**Nested collections:**
- Shopify does NOT support native subcategories/nested collections
- Workarounds: use tags + mega menu navigation, use a collection list page, use a menu app (Globo Mega Menu, etc.), use metafields to store parent/child relationships

⚠️ WARNING: Automated collection rules only check conditions at save time and when products change. If you edit the rule logic, products already in the collection that no longer match are NOT automatically removed — you must save the collection to trigger re-evaluation.

⚠️ WARNING: Deleting a collection does not delete its products. But it does remove the collection URL, breaking any links/ads pointing to it.

**Docs:** https://help.shopify.com/en/manual/products/collections

---

### A4. Themes & Online Store 2.0

#### Liquid Templating Language
Shopify uses Liquid (open-source, created by Shopify) for all theme templates.

**Three types of Liquid delimiters:**
```liquid
{{ product.title }}         {# Output tag — renders a value #}
{% if product.available %}  {# Logic tag — conditionals, loops, assignments #}
{%- comment -%}             {# Comment tag (dash strips whitespace) #}
```

**Common objects:** `shop`, `product`, `collection`, `cart`, `customer`, `order`, `page`, `blog`, `article`, `settings`, `request`

**Common filters:**
```liquid
{{ product.price | money }}              {# formats as currency #}
{{ product.title | upcase }}             {# UPPERCASE #}
{{ 'style.css' | asset_url | stylesheet_tag }}  {# asset pipeline #}
{{ product.description | truncatewords: 30 }}
{{ collection.products | sort: 'price' }}
```

**Common tags:**
```liquid
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}

{% if customer.logged_in %}
  Welcome, {{ customer.first_name }}
{% endif %}

{% assign featured = product.metafields.custom.featured.value %}
{% capture %}...{% endcapture %}
{% include 'snippet-name' %}  {# deprecated — use render #}
{% render 'snippet-name', product: product %}
```

#### Theme Architecture

**File structure:**
```
theme/
├── assets/          # CSS, JS, images, fonts
├── config/
│   ├── settings_schema.json   # Theme settings definitions
│   └── settings_data.json     # Saved theme settings values
├── layout/
│   └── theme.liquid           # Master layout wrapping all pages
├── locales/         # Translation strings
├── sections/        # Reusable page sections (.liquid files)
├── snippets/        # Reusable code fragments (no schema)
└── templates/       # Page templates (JSON or .liquid)
```

#### Online Store 2.0 (OS2.0)
Released with Dawn theme. Key changes from legacy:
- **JSON templates** instead of `.liquid` templates for most pages
- **Sections everywhere** — sections can appear on any page, not just the homepage
- **Metafield connections** — section settings can be connected to metafield values
- **App Blocks** — apps inject UI via blocks, not script tags

**JSON template structure:**
```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {}
    },
    "related": {
      "type": "product-recommendations",
      "settings": { "heading": "You may also like" }
    }
  },
  "order": ["main", "related"]
}
```

#### Section Schema
```liquid
{% schema %}
{
  "name": "Featured Banner",
  "tag": "section",
  "class": "section-featured-banner",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background image"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Welcome"
    },
    {
      "type": "select",
      "id": "text_alignment",
      "label": "Text alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" }
      ],
      "default": "center"
    }
  ],
  "blocks": [
    {
      "type": "button",
      "name": "Button",
      "settings": [
        { "type": "text", "id": "button_label", "label": "Label" },
        { "type": "url", "id": "button_link", "label": "Link" }
      ]
    }
  ],
  "max_blocks": 3,
  "presets": [
    {
      "name": "Featured Banner"
    }
  ]
}
{% endschema %}
```

#### Dawn Theme
- Shopify's free, open-source reference theme
- GitHub: `https://github.com/Shopify/dawn`
- OS2.0 compliant, fast, minimal, accessible
- Best starting point for custom theme development
- Performance score target: 90+ Lighthouse

#### Theme Check Linter
```bash
shopify theme check                          # lint entire theme
shopify theme check --category performance  # specific category
```
- Catches: deprecated filters, missing schema fields, performance issues, accessibility problems
- Docs: https://shopify.dev/docs/themes/tools/theme-check

⚠️ WARNING: Never edit a live (published) theme directly. Always duplicate it first: Online Store → Themes → Actions → Duplicate. Work on the duplicate, preview, then publish.

⚠️ WARNING: Paid theme updates are not automatic. If a theme author releases a fix, you must manually merge changes. Heavy customizations make updates nearly impossible.

⚠️ WARNING: `{% include %}` is deprecated — always use `{% render %}`. `render` has a sandboxed scope (no access to parent variables unless explicitly passed), which prevents accidental global state mutations.

**Docs:** https://shopify.dev/docs/themes

---

### A5. Checkout

**Checkout flow:**
1. Cart → 2. Contact info → 3. Shipping method → 4. Payment → 5. Order confirmation

**Checkout Extensibility (current approach for all plans):**
- Build checkout customizations using Checkout UI Extensions (React components)
- Deploy as app extensions via Shopify CLI
- Placement targets: `purchase.checkout.contact.render-after`, `purchase.checkout.shipping-option-list.render-after`, `purchase.checkout.payment-method-list.render-after`, `purchase.thank-you.customer-information.render-after`, etc.
- Can: add custom fields, render UI, read/write order attributes, apply discounts
- Cannot: replace core checkout layout, access raw payment data

**checkout.liquid (DEPRECATED):**
- Was Plus-only template for full checkout customization
- Deprecated as of August 2024 — Shopify migrated all stores
- Replacement: Checkout Extensibility + Checkout Branding API
- ⚠️ If you have a Plus client still on checkout.liquid, migrate to extensions — Shopify will force migration

**Checkout Branding API:**
- Customize colors, typography, button styles via API or Partner Dashboard
- Available on all plans now (previously Plus-only for some features)
- Access via: Shopify Admin → Settings → Checkout → Customize

**Abandoned Checkout Recovery:**
- Automatically sends recovery emails (Settings → Notifications → Abandoned checkouts)
- Can customize email template
- Timing: 1 hour, 6 hours, 24 hours after abandonment (configurable)
- Shopify Email automations can also handle this with more control

**Custom Checkout Fields:**
- Order note (cart page `note` attribute)
- Line item properties (per-item customization)
- Order attributes (key-value pairs passed via hidden form fields or cart API)
- Gift wrapping: typically done via line item properties or order attributes

```liquid
{# Adding order note to cart form #}
<textarea name="note" placeholder="Order notes"></textarea>

{# Line item properties #}
<input type="hidden" name="properties[Engraving]" value="Hello World">
```

⚠️ WARNING: Checkout UI extensions have strict limitations — no arbitrary JS, no external API calls from the extension itself, no DOM manipulation. Work within the extension API.

⚠️ WARNING: Test the full checkout flow every time you change payment settings, add new markets, or install a new payments app. Many issues only surface during the actual checkout.

**Docs:** https://shopify.dev/docs/api/checkout-ui-extensions

---

### A6. Payments

**Shopify Payments:**
- Available in: US, Canada, UK, Australia, Ireland, New Zealand, Singapore, Hong Kong, Japan, Spain, Italy, Germany, France, Netherlands, Sweden, Denmark, Finland, Belgium, Austria, Switzerland, + more
- Setup: Settings → Payments → Shopify Payments → Complete account setup (requires business info, bank account, SSN/EIN)
- Transaction fee with Shopify Payments: **0%** on all plans
- Transaction fee WITHOUT Shopify Payments: 2% (Basic), 1% (Shopify), 0.5% (Advanced), 0.15% (Plus)
- Payout schedule: 2 business days (US), 3 business days (UK/AU), varies by country
- Currencies: can accept many currencies, settle in your local currency (currency conversion fee ~1.5%)
- Minimum payout: varies by country

**Third-party gateways:**
- PayPal, Stripe, Braintree, Authorize.net, Square, and 100+ others
- Always incur transaction fees on top of payment processing fees
- When to use: Shopify Payments not available in merchant's country, specific compliance requirements (e.g., specific gateway for EU SEPA)

**Manual payment methods:**
- Bank transfer, money order, COD (cash on delivery)
- Order goes to "Payment pending" status
- You must manually mark as paid

**Multi-currency:**
- Available on all plans via Shopify Payments
- Presentment currency: what customer sees/pays in
- Settlement currency: what you receive in your bank
- Rounding rules: configure how prices round in each currency
- Price adjustments: set different prices per market via Shopify Markets

**Buy Now Pay Later:**
- Shop Pay Installments (US/CA): 4 interest-free payments or monthly up to 24 months
- Afterpay/Clearpay: requires Shopify Payments
- Klarna: available as separate payment gateway in some regions
- Min/max order amounts apply

**Test mode:**
- Use Shopify Payments test mode (Settings → Payments → Shopify Payments → Manage → Test mode)
- Bogus Gateway: available for stores without Shopify Payments (Settings → Payments → Third-party providers → Bogus Gateway)
- Test card numbers: `4111111111111111` (success), `4000000000000002` (decline)

⚠️ WARNING: Shopify Payments has strict Acceptable Use Policy. Prohibited products (weapons, certain supplements, adult content, etc.) will get your payments account terminated. Review AUP before onboarding clients in borderline categories.

⚠️ WARNING: Changing from one payment gateway to another does not migrate subscription/recurring billing customers. Subscriptions apps (Recharge, Bold) have their own migration paths.

⚠️ WARNING: Payout holds can be triggered by fraud flags, high dispute rates, or sudden revenue spikes. Inform clients of this risk — Shopify can hold funds for 30-120 days.

**Docs:** https://help.shopify.com/en/manual/payments

---

### A7. Taxes

**Automatic tax calculation:**
- Shopify calculates sales tax automatically for US, EU, UK, Canada, Australia, and other regions
- Uses destination-based taxation for most jurisdictions
- Tax table updated by Shopify regularly

**US Sales Tax:**
- Economic nexus: thresholds vary by state (most: $100K revenue or 200 transactions in prior 12 months)
- Physical nexus: office, warehouse, employee in the state
- Register for nexus: Settings → Taxes → United States → Add nexus
- Shopify collects and reports but YOU are responsible for filing and remitting
- Avalara / TaxJar: recommended for high-volume or multi-state merchants ($100K+/year revenue)

**Tax overrides:**
- Product-level: mark specific products as tax-exempt (e.g., groceries, clothing under $110 in NY)
- Customer-level: mark specific customers as tax-exempt (e.g., wholesale, resellers) — requires tax-exempt certificate on file
- Location-level: override rates for specific regions

**EU VAT:**
- OSS (One Stop Shop) registration allows filing VAT for all EU sales in one country
- Required when selling to EU consumers above thresholds (~€10,000 combined EU sales)
- Shopify has Avalara integration for EU VAT compliance
- B2B EU sales: reverse charge applies if buyer has valid VAT number

**Digital goods:**
- Different rules: digital products taxable in many EU countries regardless of seller location
- Shopify can apply digital goods tax rules if products tagged correctly

**Tax-inclusive vs exclusive pricing:**
- Settings → Taxes → "Include tax in product prices" makes all prices tax-inclusive
- Show tax-inclusive price in storefront vs add at checkout
- Important: affects listed price and checkout total display

⚠️ WARNING: Shopify collects tax but does NOT file or remit it on your behalf (exception: Shopify Tax for qualifying US stores). Clients must file their own returns. Highly recommend TaxJar or Avalara for automated filing.

⚠️ WARNING: Nexus settings are your responsibility. If a merchant has a warehouse in a new state, they need to add that nexus immediately.

⚠️ WARNING: "Charge taxes on shipping rates" setting in many regions must be enabled (or not) based on local law — this varies by state/country.

**Docs:** https://help.shopify.com/en/manual/taxes

---

### A8. Shipping

**Shipping profiles:**
- General profile: applies to all products not in a custom profile
- Custom profiles: assign specific products to a profile with their own rates
- Use case: heavy items with different rates, digital products (no shipping), fragile items

**Rate types:**
- Flat rate: fixed price (free, $5, etc.)
- Price-based rate: rate changes based on order total (e.g., free over $50)
- Weight-based rate: rate changes based on total weight
- Carrier-calculated: real-time rates from UPS, USPS, DHL, Canada Post (requires Advanced plan or higher, or add-on)

**Carrier-calculated shipping:**
- Plans: Advanced and Plus have it included; add-on available for Basic/Shopify ($20/month)
- Carriers: UPS, USPS, DHL Express, Canada Post, Sendle (AU), + apps
- Requires: product weights entered accurately on all products

**Shopify Shipping:**
- Discounted rates with USPS, UPS, DHL, Canada Post, Sendle
- Available in US, Canada, Australia
- Buy and print labels directly in admin
- No monthly fee — pay per label
- Savings: up to 88% off retail rates (US)

**Fulfillment services:**
- ShipBob, ShipStation, Deliverr (now Shopify Fulfillment Network), Amazon FBA
- Connect via app; orders auto-sent to fulfillment center
- Shopify Fulfillment Network (SFN): Shopify's own 3PL — US only, application-based

**Local delivery and pickup:**
- Local delivery: set delivery zone (radius or postal codes), charge or free, add delivery date/time
- Local pickup: enable per location (Settings → Shipping → Local pickup)
- Customer picks pickup location at checkout

⚠️ WARNING: Missing or zero product weights will break carrier-calculated rates — customers see no shipping options at checkout. Always set weights before going live.

⚠️ WARNING: Shipping profiles override each other unexpectedly when products from multiple profiles are in the same cart. The most restrictive profile's rates apply. Test multi-product carts.

⚠️ WARNING: Shopify's "free shipping for orders over $X" rate is set per shipping zone, per profile. A client may have it in their domestic zone but forget to add it to international zones (or vice versa).

**Docs:** https://help.shopify.com/en/manual/shipping

---

### A9. Customers & Accounts

**Customer account types:**
- **Legacy accounts:** Email + password login; customers manage at `/account`; can be required or optional
- **New Customer Accounts (recommended):** Passwordless login via email OTP or social login; separate account experience; URL: `https://account.{shop}.myshopify.com`

**Switching to new accounts:**
- Settings → Customer accounts → New customer accounts
- ⚠️ Cannot go back to legacy after switching (as of 2024)
- New accounts don't support checkout.liquid customizations (use extensions)

**Customer data:**
- Fields: email, phone, first/last name, addresses, tags, notes, order history
- Tax exempt status
- Email/SMS marketing opt-in status
- Customer segments: rule-based (Shopify's segment builder using ShopifyQL-like syntax)

**Customer tags:**
- Used for: discount targeting, app logic, email segmentation, wholesale access
- Max 250 tags per customer
- Tags are plain text — no hierarchy

**B2B (Shopify Plus only):**
- Companies: create company profiles with multiple contacts and locations
- Payment terms: Net 30, Net 60, etc.
- Price lists: company-specific pricing (fixed or percentage off)
- Quantity rules: minimum/maximum/increment ordering rules
- B2B checkout: separate checkout experience with PO number field
- Requires Shopify Plus + Markets/B2B enabled

**GDPR data requests:**
- Customers can request their data export or deletion
- Handle via: Customers → click customer → Actions → Request data / Erase data
- Your apps must also handle GDPR webhooks (see Stream C)

⚠️ WARNING: Customer email marketing status is not automatically kept in sync with 3rd-party ESP (Klaviyo, Mailchimp, etc.). Use apps or API to sync. Shopify consent status is the legal record — always sync to it, not away from it.

**Docs:** https://help.shopify.com/en/manual/customers

---

### A10. Orders

**Order statuses:**
- **Payment:** Authorized, Paid, Partially paid, Pending, Refunded, Voided
- **Fulfillment:** Unfulfilled, Partially fulfilled, Fulfilled, Scheduled, On hold
- **Delivery:** Shipped, Delivered, In transit, Out for delivery, Attempted delivery

**Order flow:**
1. Customer places order → payment captured (or authorized)
2. Order appears in admin as Unfulfilled
3. Staff fulfills: picks items, buys label, marks fulfilled with tracking
4. Shopify sends shipping confirmation to customer
5. Order archived (manual or automatic after X days)

**Draft orders:**
- Create orders manually for phone/in-person sales
- Send invoice via email; customer pays via link
- Can be converted to regular order after payment
- Useful for custom quotes, wholesale orders

**Order editing:**
- Edit orders post-purchase: add items, change quantities, remove items
- Limited: cannot change shipping address on fulfilled orders (only unfulfilled)
- Send revised invoice to customer after edit

**Fulfillment:**
- Manual: staff marks items as fulfilled, enters tracking number
- Automatic: trigger on payment capture (Settings → Checkout → Order processing)
- Partial fulfillment: fulfill some items now, rest later (backorder)
- Holds: put fulfillment on hold with a reason (fraud review, out of stock)

**Refunds:**
- Full or partial refund
- Restock items to inventory (per location)
- Return shipping label (Shopify Shipping)
- Refund to original payment method or store credit (gift card)
- Timeline: Shopify Payments 2-5 business days; other gateways vary

**Fraud analysis:**
- Risk indicators shown on each order: IP location mismatch, billing/shipping address mismatch, high-risk email, failed payment attempts
- Fraud score: Low, Medium, High
- ⚠️ High risk does not mean fraud — use judgment. Common false positives: gift purchases, international orders

**Exports:**
- Export orders as CSV from Orders page
- All orders or filtered selection
- Includes all order data, line items, shipping, customer info

⚠️ WARNING: Auto-archiving orders (enabled by default after fulfillment) hides them from the default Orders view. They're not deleted — just filtered. Use the "Archived" filter to find them.

⚠️ WARNING: Cancelling a paid order does not automatically refund — you must also issue the refund separately. Two separate actions: Cancel → then Refund.

**Docs:** https://help.shopify.com/en/manual/orders

---

### A11. Discounts

**Discount types:**
- Percentage off (e.g., 20% off)
- Fixed amount off (e.g., $10 off)
- Free shipping
- Buy X Get Y (BXGY)

**Code-based vs automatic:**
- Code-based: customer enters code at checkout
- Automatic: applies automatically when conditions met; no code needed
- Both can have: minimum requirements, customer eligibility, usage limits, date ranges

**Combined discounts (since 2023):**
- Shopify now supports stacking multiple discounts
- Configure each discount: "Can be combined with" → Product discounts / Order discounts / Shipping discounts
- Maximum combinations: product + order + shipping = 3 discounts at once
- ⚠️ Monitor for unintended stacking — test all combinations

**Discount limits:**
- Total uses (e.g., first 100 uses only)
- One per customer
- Specific collections, products, or variants
- Customer segments (requires segment setup)

**Discount codes in bulk:**
- Shopify doesn't natively bulk-generate codes
- Use a discount code generator app, or the Discount API (create codes programmatically)

**Shopify Scripts (Plus only — being phased out):**
- Ruby-based scripts running in checkout
- Used for: complex discount logic, line item manipulation, shipping customization
- Status: deprecated in favor of Shopify Functions — migrate existing scripts

**Discount Functions:**
- Replace Shopify Scripts for discount logic
- Run as WebAssembly on Shopify's servers
- Types: Product discounts, Order discounts, Shipping discounts
- No arbitrary API calls; pure computation
- Build via Shopify CLI extension

⚠️ WARNING: Automatic discounts cannot be combined with discount codes by default. You must explicitly enable combination on each discount.

⚠️ WARNING: Discount code URLs (e.g., `https://shop.com/discount/SAVE20`) apply the discount but don't guarantee checkout. They also don't work if the discount requires minimum cart conditions that aren't met.

**Docs:** https://help.shopify.com/en/manual/discounts

---

### A12. Marketing

**Shopify Email:**
- Built-in email marketing tool
- Free: 10,000 emails/month; then $1/1,000 emails
- Templates: product recommendation, sale announcement, restock, etc.
- Automation triggers: abandoned cart, welcome, win-back, post-purchase
- Not a full ESP replacement — limited segmentation vs Klaviyo

**Shopify Inbox:**
- Free live chat for storefronts
- Integrates with Apple Messages, Facebook Messenger, Instagram DMs
- Automated replies with suggested answers
- View customer cart during chat conversation

**Google & YouTube Channel:**
- Sync product catalog to Google Merchant Center
- Run Google Shopping ads from Shopify
- Free product listings on Google (unpaid)

**Facebook & Instagram Channel:**
- Meta Commerce Manager integration
- Instagram Shopping (product tags in posts/stories)
- Facebook Shop
- Sync catalog automatically

**TikTok Channel:**
- TikTok Shop product catalog sync
- Run TikTok ads from Shopify

**Automations:**
- Built into Shopify (Marketing → Automations)
- Triggers: customer joins segment, abandons cart, places order, hasn't ordered in X days
- Actions: send email (Shopify Email), apply discount, add tag
- More powerful automations: Klaviyo, Omnisend, Postscript (SMS)

**UTM Tracking:**
- Add UTM parameters to any campaign link
- Analytics → Reports → Marketing shows attribution
- GA4 + Shopify analytics sometimes double-count — pick one as source of truth

⚠️ WARNING: Shopify Email is fine for basic sends. For serious email marketing (segmentation, A/B testing, flows, SMS), use Klaviyo. The ROI difference is significant.

**Docs:** https://help.shopify.com/en/manual/promoting-marketing

---

### A13. Analytics

**Built-in dashboard metrics:**
- Total sales, orders, average order value (AOV)
- Sessions, conversion rate
- Top products, top traffic sources
- Returning vs new customer ratio

**Reports (by plan):**
- Basic: overview, product analytics
- Shopify: + sales by channel, customer reports, abandoned carts
- Advanced: + custom report builder, month-over-month comparisons
- Plus: + Shopify Audiences, advanced cohort analysis

**Live View:**
- Real-time visitor map and activity
- Sessions, add-to-carts, checkouts, sales per minute

**Cohort Analysis:**
- Available on Advanced+
- Shows: which acquisition cohorts retain best, LTV by month
- Critical for understanding subscription health and repeat purchase rate

**Attribution:**
- Last click: default; credits the last marketing touchpoint
- First click: credits first interaction
- Linear: splits credit across all touchpoints
- ⚠️ Shopify's attribution ≠ GA4 attribution — they use different models and tracking windows

**Google Analytics 4:**
- Connect via: Sales channels → Google & YouTube, or via GA4 property ID in theme (settings or head snippet)
- Shopify's built-in GA4 integration (via Google channel) is the recommended approach
- Custom events: use `dataLayer.push()` in theme or via Shopify's Web Pixels API

**Shopify Balance:**
- Business banking account (US only)
- Integrated with Shopify — payouts go directly to Balance
- Debit card for spending
- 0% transaction fees for Balance card purchases

⚠️ WARNING: Shopify analytics and GA4 will never perfectly match. Shopify counts orders; GA4 counts conversions. Bots, VPNs, ad blockers affect GA4 more. Use Shopify as the financial truth, GA4 for traffic/behavior.

**Docs:** https://help.shopify.com/en/manual/reports-and-analytics

---

### A14. Apps Ecosystem

**App Store:** https://apps.shopify.com

**How to evaluate apps:**
1. Rating and number of reviews (>100 reviews is meaningful)
2. Last updated date (inactive apps are dangerous)
3. Permissions requested (should match app's function — flag excessive permissions)
4. Pricing model (free tier, trial, monthly subscription, usage-based)
5. Support response time listed
6. "Works with" latest themes
7. GDPR-compliant data handling

**App billing models:**
- Free
- One-time charge
- Monthly subscription (Shopify Billing API — charged via Shopify invoice)
- Usage-based billing (charges based on orders processed, emails sent, etc.)
- Freemium with paid tiers

**App Blocks (OS2.0) vs Script Tags:**
- App Blocks: theme editor integration, toggleable by merchant, clean uninstall
- Script Tags: deprecated, inject JS globally on all pages, hard to audit, performance impact
- ⚠️ New apps should use App Blocks. Avoid any app using script tags for storefront injection.

**Essential app categories for most stores:**
| Category | Popular Apps |
|---|---|
| Reviews | Stamped, Okendo, Judge.me, Yotpo |
| Email/SMS | Klaviyo, Omnisend, Postscript |
| Loyalty/Rewards | Smile.io, LoyaltyLion, Yotpo Loyalty |
| Subscriptions | Recharge, Bold Subscriptions, Seal Subscriptions |
| Upsell/Cross-sell | Frequently Bought Together, ReConvert, Aftersell |
| SEO | Plug In SEO, SEO Booster |
| Page Builder | Pagefly, GemPages, Shogun |
| Inventory/Fulfillment | ShipStation, ShipBob |
| B2B | Wholesale Club, Locksmith |
| Search/Filter | Searchie, Boost Commerce |
| Bundles | Bundler, Fast Bundle |

⚠️ WARNING: Each installed app can add JS, CSS, and API calls to your storefront. 10+ apps can cause 3-5 second slowdowns. Audit regularly with Chrome DevTools → Network tab.

⚠️ WARNING: Uninstalling an app does NOT automatically remove its code from your theme. Check theme files for leftover `{% render 'app-snippet' %}` calls and script tags after uninstalling.

**Docs:** https://help.shopify.com/en/manual/apps

---

### A15. Shopify Plus

**What's included (beyond Advanced):**
- Checkout Extensibility (full access, custom checkout UI)
- Launchpad: schedule sales events (price changes, theme publishes, app changes)
- Flow: no-code workflow automation (far more powerful than standard automations)
- B2B: company accounts, payment terms, price lists
- Multipass: SSO login for customers from external system
- Custom checkout domains (checkout.yourbrand.com)
- 9 additional staff accounts (unlimited total)
- Exclusive API endpoints: Gift Cards API, User API
- Shopify Audiences (ad retargeting optimization)
- Organization Admin: manage multiple stores from one dashboard

**Price:**
- Starts at ~$2,300/month (variable based on volume — negotiated above $800K GMV)
- Transaction fee: 0.15% without Shopify Payments
- Typical threshold for recommendation: $1M+/year revenue, need B2B, or heavy checkout customization

**Organization Admin:**
- Manage up to 9 expansion stores under one org
- Single billing
- Cross-store user management
- Shared users across stores

**When to recommend Plus:**
- Revenue > $1M/year and hitting plan limitations
- Need B2B/wholesale with payment terms
- Need checkout customization beyond what extensions allow (e.g., completely custom checkout UI)
- Need Launchpad for large sale events (BFCM)
- Need Flow for complex automation logic
- Need Multipass for external auth/SSO

⚠️ WARNING: Shopify Plus contract is typically annual. Make sure clients understand the commitment before signing.

**Docs:** https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans/plus

---

### A16. Shopify Markets

**What it is:** Sell internationally from a single store with market-specific settings.

**Per-market settings:**
- **Domains/subfolders:** country-specific URLs (e.g., `shop.com/en-ca`, or `ca.shop.com`)
- **Currency:** present prices in local currency
- **Language:** translate store (Shopify Translate & Adapt, or 3rd-party translation apps)
- **Pricing:** set market-specific price adjustments (e.g., +10% for EU to cover VAT)
- **Payment methods:** configure which payment methods appear per market
- **Duties & import taxes:** Markets Pro auto-calculates and collects duties at checkout

**Markets Pro:**
- Add-on for cross-border compliance
- Collects duties/taxes at checkout (DDP — Delivered Duty Paid)
- Handles tax remittance for eligible countries
- Shipment compliance documents auto-generated

**Localization:**
- Shopify Translate & Adapt (free app): translate storefront content, metafields
- Language-specific currency rounding rules
- RTL language support

**Tradeoff: Markets vs separate stores:**
- Markets: simpler management, one inventory pool, one admin
- Separate stores: completely independent, can have different product catalogs, themes, apps
- Separate stores needed for: dramatically different catalogs, different Shopify plans by region, B2B + B2C split

⚠️ WARNING: Pricing in foreign currencies via Markets uses automatic conversion + rounding. If you need exact pricing parity (e.g., same price as a local competitor), set explicit prices per market rather than relying on currency conversion.

⚠️ WARNING: SEO implications: subfolder setup (`/en-ca`) shares domain authority with main site; subdomain setup has separate authority. Use hreflang tags correctly (Shopify does this automatically for market-based URLs).

**Docs:** https://help.shopify.com/en/manual/markets

---

### A17. Point of Sale (POS)

**POS Lite (free with all plans):**
- Accept card payments via Shopify hardware
- Basic inventory sync with online store
- 1 staff account for POS
- Basic reports

**POS Pro ($89/month per location):**
- Unlimited staff accounts with PINs
- Advanced inventory management (receive purchase orders, transfers)
- Omnichannel features: buy online/pick up in store, return online orders in store
- Daily sales reports per staff member
- Custom printed receipts
- Smart inventory forecasting

**Hardware (US):**
- Shopify POS Go: all-in-one Android device with built-in card reader (~$399)
- Tap to Pay on iPhone (no hardware needed, software-based)
- Shopify Tap & Chip Card Reader (~$49)
- Shopify Dock for iPad
- Star Micronics receipt printers (compatible)
- Zebra barcode scanners (compatible)
- APG cash drawers (compatible)

**Inventory sync:**
- POS inventory is location-based — separate from online inventory by location
- Staff can see inventory across all locations
- Transfer inventory between locations via POS or admin

**Offline mode:**
- POS can accept card-present transactions offline
- Syncs when reconnected
- Cash transactions always available offline
- ⚠️ Offline card transactions have slightly higher risk — customer's card may be declined when it syncs

⚠️ WARNING: POS Pro is per location per month — for retail clients with multiple stores, this adds up fast. Calculate total cost before recommending.

**Docs:** https://help.shopify.com/en/manual/sell-in-person

---

## B. Shopify Partner Program

### B1. Partner Dashboard Overview

**URL:** https://partners.shopify.com

**Navigation tabs:**

| Tab | Contents |
|---|---|
| **Home** | Dashboard: earnings summary, recent activity, new features |
| **Stores** | All stores associated with your account (development + client) |
| **Apps** | Apps you've created; submission status, install counts |
| **Themes** | Themes you've created for Theme Store or custom clients |
| **Finances** | Earnings breakdown, payout history, tax form status |
| **Marketing** | Affiliate link, co-marketing tools, Partner Directory profile |
| **Settings** | Business info, payment method (PayPal), team members, notification preferences |

**Key difference from Shopify Admin:**
- Partner Dashboard = for YOU managing your agency/development work
- Shopify Admin = for merchants managing their stores
- You access client stores from Partner Dashboard → Stores → click store name → opens their Admin

---

### B2. Store Types — Critical to Understand

#### Development Stores
- **Purpose:** Build/test/demo purposes; no real transactions
- **Limits:** Can't process live payments; no real customers
- **Duration:** Never expire
- **How many:** Unlimited
- **Who can create:** Any Shopify Partner (no cost)
- **Upgrading:** Client pays to upgrade to a paid plan; you can transfer ownership to client
- **Staff access:** You retain access as partner who created it
- **⚠️ CRITICAL:** Transferring a development store you created does NOT earn you referral commission. To earn commission, client must sign up through your affiliate link independently and choose their plan directly.

#### Test Stores
- Specifically for testing apps — created from the App section in Partner Dashboard
- Limited to app testing; not for client work

#### Client Stores (Already on a paid plan)
- Appear in your Stores list after client approves collaborator access request
- These ARE earning you commission IF they originally signed up via your affiliate link
- Otherwise, no commission — just access

#### Transfer-Only Development Stores (new store type)
- Created specifically to be transferred — pre-loaded trial period for client
- Slightly different from standard dev store in billing context

---

### B3. Adding & Managing Client Stores

#### Method 1: Affiliate Link (Earn Commission)

1. Go to Partners Dashboard → Marketing → Get your affiliate link
2. Your link looks like: `https://www.shopify.com/?ref=your-partner-handle`
3. Send this link to client before they create their Shopify account
4. Client clicks your link, creates their account, chooses a paid plan
5. Client appears in your Stores list automatically

**Commission eligibility requirements:**
- Client must use YOUR affiliate link (not go to shopify.com directly)
- Client must be a NEW Shopify merchant (not already have an account)
- Client must select a PAID plan (not stay on trial indefinitely)
- Client must NOT be a development store you created and transferred

⚠️ WARNING: If client uses a Shopify promo discount code from a different source when signing up, it may override your affiliate attribution. Tell clients: use your link, don't enter other discount codes at signup.

⚠️ WARNING: The affiliate cookie lasts 30 days. If client clicks your link but doesn't sign up for 31+ days, you lose commission attribution.

⚠️ WARNING: You earn 0% commission on development stores you create and then transfer. To earn commission: have the client sign up themselves via your affiliate link.

#### Method 2: Collaborator Access Request (Access without Commission)

**To request access:**
1. Go to Partners Dashboard → Stores → Add store
2. Enter the client's `.myshopify.com` URL
3. Select permissions you need
4. Client receives an email/notification in their admin to approve
5. Once approved, store appears in your Stores list

**Collaborator vs Staff account:**
| Feature | Collaborator | Staff |
|---|---|---|
| Created by | Partner from Partner Dashboard | Store owner from Admin |
| Counts toward staff limit | No | Yes |
| Visible in Partner Dashboard | Yes | No |
| Manage from | Partner Dashboard | Store Admin |
| Best for | Agencies with multiple clients | Employees of a single store |

**Available permission scopes (select what you need):**
- Products, inventory, collections
- Orders, draft orders
- Customers
- Reports
- Marketing
- Discounts
- Pages, blog posts, navigation
- Themes
- Apps
- Settings (⚠️ powerful — grants access to billing, shipping, payments)
- Locations

**Revoking access:**
- Client can remove you: Admin → Settings → Users → Collaborators → Remove
- You can remove yourself: Partner Dashboard → Stores → click store → Leave store

#### Method 3: Transfer Development Store

1. Build the store as a development store in your Partner Dashboard
2. Go to Partner Dashboard → Stores → click the store → Transfer store
3. Enter client's email address
4. Client receives invitation to create/log into Shopify account and choose a plan
5. After they pay and activate, ownership transfers to them
6. ⚠️ You earn NO referral commission on this transfer

**Retaining access after transfer:**
- You automatically retain collaborator access as the partner who built it
- Client can see you in their Collaborators list and can remove you

---

### B4. Revenue Share Models

#### Referral Commission
- **Rate:** 20% of Shopify's monthly subscription fee, paid to you
- **Duration:** Recurring monthly, for as long as merchant stays on any paid Shopify plan
- **Example:** Merchant on $79/month Shopify plan → you earn ~$15.80/month
- **Plus:** 20% of Plus subscription fee (could be $460+/month to you if client pays $2,300/month)
- **When it starts:** After client pays their first month
- **When it stops:** Client downgrades to free/trial, churns, or there's a ToS violation
- **Stacking:** You can refer multiple merchants — all commissions stack

**What breaks commission:**
- Client signed up via someone else's affiliate link
- Client already had a Shopify account
- Client is a development store you created and transferred
- You violate Partner Program Agreement (incentivizing signups, etc.)
- Client cancels their plan

#### App Revenue Share
- **First $1M USD/year:** Shopify takes 0% — you keep 100%
- **Above $1M USD/year:** Shopify takes 15% — you keep 85%
- Applies to subscriptions, one-time charges, usage-based billing
- Billing must go through Shopify Billing API (not direct payment)
- Payment schedule: monthly, ~15th of following month

#### Theme Revenue Share
- Listed themes in Shopify Theme Store
- Revenue split: check current rates at shopify.dev (historically 80/20 developer/Shopify)
- Requirements: pass Shopify theme review, meet accessibility and performance standards

#### Development Store Transfer — NO Commission
⚠️ CRITICAL: Development store transfers do NOT generate referral commission. This is the most common partner confusion. Only new merchant signups via affiliate link earn you referral revenue.

---

### B5. Partner Certification & Academy

**URL:** https://www.shopify.com/partners/academy

**Access:** Free with any Shopify Partner account

**Available certifications (verify current list at academy):**
- **Shopify Partner Foundations** — overview of Partner Program, business model
- **Product Fundamentals** — Shopify admin, setup, products, orders
- **Theme Development** — Liquid, OS2.0, CLI, theme building
- **App Development** — APIs, OAuth, CLI, app types
- **Business Fundamentals** — client management, proposals, discovery

**Exam format:**
- Multiple choice
- Passing score: typically 80%
- Retake policy: wait period before retaking (usually 24-72 hours)
- Time limit: varies by exam

**Certification value:**
- Badge displayed on Partner Directory profile
- Helps win client trust when listed
- Required for some Plus Partner tier criteria
- Certifications may expire — check renewal requirements

---

### B6. How Partners Get Paid

**Payment method:** PayPal (primary for most regions); direct bank transfer in some countries (verify in account settings)

**Payment schedule:**
- Commissions paid monthly
- Typically paid around the 15th of the following month
- Example: January earnings paid ~February 15th

**Minimum payout threshold:** $25 USD

**Currency:** USD (regardless of your location)

**Tax forms (REQUIRED before receiving payment):**
- US persons: W-9 (name, address, SSN/EIN)
- Non-US persons: W-8BEN (individual) or W-8BEN-E (entity)
- Complete in: Partner Dashboard → Settings → Tax information
- ⚠️ Shopify WITHHOLDS all payments until tax form is on file. If you haven't been paid, check this first.

**Viewing earnings:**
- Partner Dashboard → Finances tab
- See: this month's earnings, last month's, lifetime total
- Breakdown: referral commissions vs app revenue vs theme revenue

⚠️ WARNING: If your PayPal email is wrong in Partner Dashboard settings, payments will fail silently. Verify your PayPal email matches exactly what's in your Partner account.

⚠️ WARNING: Commissions can be reversed/clawed back if a merchant processes chargebacks that suggest fraud, or if Shopify determines the referral was improperly obtained.

---

### B7. Partner Support

**Primary support:** Live chat in Partner Dashboard → Help button (bottom right)

**Response times:**
- Standard: typically within a few hours during business hours
- Plus Partners: priority support, faster response

**Escalation path:**
1. Partner Support chat (first contact)
2. Request escalation to Tier 2 if issue not resolved
3. For billing disputes: request finance escalation specifically
4. For API bugs: GitHub issues at `github.com/Shopify/` + relevant repo

**Community resources:**
- Shopify Community forums: https://community.shopify.com (Partners section)
- Shopify Partners Slack: invite via Partner Dashboard or community (various regional + topical channels)
- Shopify Partner blog: https://www.shopify.com/partners/blog
- Shopify changelog: https://shopify.dev/changelog
- Shopify Dev Discord: https://discord.gg/shopify-devs (unofficial but active)

**GitHub repos for bug reports:**
- `github.com/Shopify/shopify-cli` — CLI issues
- `github.com/Shopify/dawn` — Dawn theme issues
- `github.com/Shopify/hydrogen` — Hydrogen issues

---

### B8. Partner Directory

**URL:** https://www.shopify.com/partners/directory

**Requirements to get listed:**
- Active Partner account
- Completed Partner profile (bio, logo, services)
- Verified payment method on file
- At least one completed project/client store (helps with ranking)
- Must comply with Partner Directory guidelines

**Profile setup:**
- Business name and logo
- Services offered: Theme Development, App Development, Store Setup, Marketing, etc.
- Industries: Fashion, Food, Beauty, etc.
- Budget ranges: small (<$5K), mid ($5K-$20K), large (>$20K)
- Portfolio: add case studies with client permission
- Languages spoken
- Certifications display automatically once earned

**Ranking factors:**
- Review score (clients can leave reviews)
- Number of certified team members
- Activity level (recent project completions)
- Response rate to inquiries
- ⚠️ Paid placement ("featured" spots) also exists — budget accordingly

---

### B9. Partner Program Agreement

**Location:** partners.shopify.com → Settings → Legal

**Key clauses:**
- You must not incentivize merchants to sign up via your affiliate link with cash, gifts, or referral kickbacks to the merchant
- You must not engage in cookie stuffing or other fraudulent attribution tactics
- You must not misrepresent Shopify's features or pricing to potential merchants
- Apps must comply with App Store guidelines
- Revenue earned from improperly attributed referrals can be clawed back
- Shopify can terminate partnership with or without notice for agreement violations

**Changes to agreement:**
- Shopify updates this periodically
- Partners receive email notification of material changes
- Continuing to use Partner Dashboard = acceptance of updated terms
- ⚠️ Actually read the update emails — changes to commission structure have happened before

⚠️ WARNING: "Offering discounts if they sign up through your link" violates the agreement. You can offer your agency services at a discount, but not cash-back or equivalent on the Shopify plan itself.

---

### B10. Shopify Plus Partner Program

**Requirements (verify current at shopify.com/partners):**
- Demonstrated history of Plus merchant referrals or projects
- Certified staff members
- Application + review process (not automatic)

**Benefits:**
- Plus Partner badge on directory listing
- Dedicated Partner Manager (account rep)
- Priority support with faster SLA
- Co-marketing opportunities
- Access to Plus-exclusive features for testing
- Potentially higher commission rates (verify current terms)
- Early access to new features

**Process:** Apply via Partner Dashboard or by contacting Partner Support

---

### B11. Building Apps as a Partner

**App types in Partner Dashboard:**
- **Public app (listed):** In App Store, installable by any merchant, OAuth flow, reviewed by Shopify
- **Public app (unlisted):** Not in App Store, share via direct install link, still uses OAuth, still requires app review to access certain APIs
- **Custom apps:** Not created via Partner Dashboard — created within a specific merchant's admin (Settings → Apps → Custom apps). Uses Admin API token, not OAuth. Only installable on that one store.

**App Store submission:**
- Create app in Partner Dashboard → Apps
- Fill out listing: app name, description (up to 2,600 chars), screenshots (1280×800px min), demo video (optional), pricing page
- Privacy policy URL (required)
- Submit for review
- Review timeline: typically 2-5 business days
- Common rejections: missing privacy policy, misleading description, broken functionality

---

## C. Development & Technical

### C1. REST Admin API vs GraphQL Admin API

**When to use REST:**
- Simple CRUD on well-defined resources
- Single-resource fetches (get one product, update one order)
- Integrations where REST is easier to implement (scripts, simple webhooks)
- Resources only available in REST (some still exist)

**When to use GraphQL:**
- Complex queries (fetch product + variants + metafields + images in one request)
- Bulk data operations
- Avoiding over-fetching (only get the fields you need)
- Mutations with complex nested updates
- Any new development (GraphQL is Shopify's priority — REST is in maintenance mode)

**REST basics:**
```
Base URL: https://{store}.myshopify.com/admin/api/{version}/
Auth header: X-Shopify-Access-Token: {access_token}
Version: 2025-07 (quarterly releases)
```

```bash
# Fetch products via REST
curl -X GET \
  "https://mystore.myshopify.com/admin/api/2025-07/products.json?limit=50" \
  -H "X-Shopify-Access-Token: shpat_abc123"

# Create product via REST
curl -X POST \
  "https://mystore.myshopify.com/admin/api/2025-07/products.json" \
  -H "X-Shopify-Access-Token: shpat_abc123" \
  -H "Content-Type: application/json" \
  -d '{"product": {"title": "Test Product", "body_html": "<p>Description</p>", "vendor": "My Brand"}}'
```

**GraphQL basics:**
```
Endpoint: POST https://{store}.myshopify.com/admin/api/{version}/graphql.json
Auth header: X-Shopify-Access-Token: {access_token}
Content-Type: application/json
```

```graphql
# Fetch products with pagination
query GetProducts($cursor: String) {
  products(first: 50, after: $cursor) {
    edges {
      node {
        id
        title
        variants(first: 10) {
          edges {
            node {
              id
              price
              sku
            }
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

```javascript
// Node.js GraphQL pagination
async function getAllProducts(accessToken, shop) {
  let cursor = null;
  let allProducts = [];
  
  do {
    const response = await fetch(
      `https://${shop}/admin/api/2025-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_PRODUCTS_QUERY,
          variables: { cursor }
        })
      }
    );
    
    const { data } = await response.json();
    const { edges, pageInfo } = data.products;
    
    allProducts.push(...edges.map(e => e.node));
    cursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    
  } while (cursor);
  
  return allProducts;
}
```

**Rate limits:**
- REST: 40-bucket leaky bucket, 2 requests/second refill
  - Response headers: `X-Shopify-Shop-Api-Call-Limit: 12/40`
  - 429 status when bucket empty
- GraphQL: 1,000 points/second; each query has a calculated cost
  - Check `extensions.cost` in response to see query cost
  - 429 when throttled; `Retry-After` header tells you when to retry

⚠️ WARNING: REST API is in "maintenance mode" — no new features being added. Build all new integrations with GraphQL Admin API.

⚠️ WARNING: API versioning is quarterly. Each version supported for ~12 months. Hard-coding an old version = your app breaks when Shopify sunsets that version. Always upgrade within the support window.

**Docs:** https://shopify.dev/docs/api/admin-rest | https://shopify.dev/docs/api/admin-graphql

---

### C2. Storefront API

**Purpose:** Public-facing API for custom storefronts, headless commerce, mobile apps

**Authentication:**
- Storefront access token (NOT the same as Admin API access token)
- Created in Admin: Settings → Apps → Develop apps → (your app) → Storefront API access
- Public (visible in client-side code — this is by design, access is read-only by default)

**Capabilities:**
- Query products, collections, metafields (if exposed)
- Create/update cart
- Create checkout (redirects to Shopify checkout)
- Customer authentication (new Customer Account API preferred)
- Shop information

**Key queries:**
```graphql
# Get products for storefront
query {
  products(first: 12) {
    edges {
      node {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
}

# Create cart
mutation {
  cartCreate(input: {
    lines: [
      { merchandiseId: "gid://shopify/ProductVariant/12345", quantity: 1 }
    ]
  }) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            quantity
            merchandise {
              ... on ProductVariant {
                title
                price { amount }
              }
            }
          }
        }
      }
    }
  }
}
```

⚠️ WARNING: Storefront API CANNOT access admin data (orders, fulfillment, private customer info). For post-purchase data, use Admin API server-side.

⚠️ WARNING: Metafields are NOT exposed via Storefront API by default. You must explicitly create a metafield definition and check "Storefront access" in the definition settings.

**Docs:** https://shopify.dev/docs/api/storefront

---

### C3. Webhooks

**What they are:** HTTP POST callbacks Shopify sends to your server when events occur.

**Creating webhooks:**
```javascript
// Create webhook via Admin API
const response = await fetch(
  `https://${shop}/admin/api/2025-07/webhooks.json`,
  {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      webhook: {
        topic: 'orders/create',
        address: 'https://yourapp.com/webhooks/orders-create',
        format: 'json'
      }
    })
  }
);
```

**Common webhook topics:**
- `orders/create`, `orders/updated`, `orders/paid`, `orders/cancelled`, `orders/fulfilled`
- `products/create`, `products/update`, `products/delete`
- `customers/create`, `customers/update`, `customers/delete`
- `inventory_levels/update`
- `app/uninstalled` — ⚠️ MANDATORY
- `app/subscriptions_cancelled` — ⚠️ MANDATORY for subscription billing

**GDPR webhooks (MANDATORY for all apps):**
- `customers/data_request` — respond to customer data requests
- `customers/redact` — delete customer data from your system
- `shop/redact` — delete all shop data when app uninstalled 48 days prior

**HMAC Validation (REQUIRED — never skip):**
```javascript
// Node.js webhook HMAC validation
const crypto = require('crypto');

function validateWebhook(rawBody, hmacHeader, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
  
  // Use timingSafeEqual to prevent timing attacks
  const a = Buffer.from(hash);
  const b = Buffer.from(hmacHeader);
  
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// In your Express route:
app.post('/webhooks/orders-create', express.raw({type: 'application/json'}), (req, res) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  
  if (!validateWebhook(req.body, hmac, process.env.SHOPIFY_WEBHOOK_SECRET)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Process webhook asynchronously
  res.status(200).send('OK');
  
  const order = JSON.parse(req.body);
  processOrder(order); // async — don't await here
});
```

**Delivery behavior:**
- At-least-once delivery (may send duplicates → implement idempotency)
- Must respond with HTTP 200 within 5 seconds
- Shopify retries failed deliveries for 48 hours (exponential backoff)
- After 48 hours of failures, webhook delivery stops for that endpoint

```python
# Python HMAC validation
import hmac
import hashlib
import base64

def validate_webhook(data, hmac_header, secret):
    hash = hmac.new(
        secret.encode('utf-8'),
        data,
        hashlib.sha256
    ).digest()
    computed_hmac = base64.b64encode(hash).decode('utf-8')
    return hmac.compare_digest(computed_hmac, hmac_header)
```

⚠️ WARNING: Never process webhook data synchronously in the HTTP response cycle. Return 200 immediately, then process in a background job/queue. Long processing = Shopify treats it as failed and retries.

⚠️ WARNING: Webhook deduplication is YOUR responsibility. Use `X-Shopify-Webhook-Id` header as idempotency key. Store processed webhook IDs in Redis or DB.

⚠️ WARNING: If `app/uninstalled` webhook fails repeatedly, Shopify cannot notify you of uninstalls. You'll have orphaned tokens in your DB and no way to know the merchant left.

**Docs:** https://shopify.dev/docs/apps/build/webhooks

---

### C4. App Types

| Type | Created via | Auth method | Multiple stores | App Store listing |
|---|---|---|---|---|
| Public app (listed) | Partner Dashboard | OAuth | Yes | Yes |
| Public app (unlisted) | Partner Dashboard | OAuth | Yes (via direct link) | No |
| Custom app | Merchant's Admin settings | Static Admin API token | No (one store only) | No |

**Custom apps (previously "private apps"):**
- Created in: Admin → Settings → Apps and sales channels → Develop apps
- Generate Admin API access token scoped to selected permissions
- No OAuth needed — just use the static token
- Client creates it themselves or you walk them through it
- Best for: one-off integrations, data exports, internal tools

⚠️ WARNING: "Private apps" were deprecated in January 2022. Any instructions or code using the old private app flow must be updated to custom apps.

⚠️ WARNING: Custom app tokens never expire but are tied to that one store. If the store changes owners, the token remains valid — ensure clients understand they should rotate tokens if staff changes.

**Docs:** https://shopify.dev/docs/apps/build/app-types

---

### C5. OAuth Flow

**Step-by-step authorization code grant:**

```
1. Merchant clicks "Install app" → your app redirected to:
   GET https://{shop}.myshopify.com/admin/oauth/authorize
     ?client_id={api_key}
     &scope=read_products,write_orders
     &redirect_uri=https://yourapp.com/auth/callback
     &state={nonce}

2. Merchant approves permissions on Shopify consent screen

3. Shopify redirects to your callback with:
   GET https://yourapp.com/auth/callback
     ?code={authorization_code}
     &hmac={hmac}
     &shop={shop_domain}
     &state={nonce}

4. Validate: HMAC, state nonce, shop domain format

5. Exchange code for access token:
   POST https://{shop}.myshopify.com/admin/oauth/access_token
   Body: { client_id, client_secret, code }
   Response: { access_token, scope }

6. Store token securely server-side
```

```javascript
// Express.js OAuth callback handler
app.get('/auth/callback', async (req, res) => {
  const { code, hmac, shop, state } = req.query;
  
  // 1. Validate state (nonce) matches what you generated
  if (state !== getStoredNonce(shop)) {
    return res.status(403).send('Invalid state');
  }
  
  // 2. Validate HMAC
  const params = { ...req.query };
  delete params.hmac;
  delete params.signature;
  
  const message = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  
  const generatedHmac = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(hmac)
  )) {
    return res.status(403).send('Invalid HMAC');
  }
  
  // 3. Validate shop domain format
  if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/)) {
    return res.status(400).send('Invalid shop');
  }
  
  // 4. Exchange code for token
  const tokenResponse = await fetch(
    `https://${shop}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code
      })
    }
  );
  
  const { access_token } = await tokenResponse.json();
  
  // 5. Store token encrypted
  await saveAccessToken(shop, encrypt(access_token));
  
  // 6. Redirect to app
  res.redirect(`https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`);
});
```

**Online vs offline tokens:**
- **Offline tokens:** Persist indefinitely; use for server-side background jobs, webhooks
- **Online tokens:** Expire when user session ends; use when app actions should be tied to a specific staff user

⚠️ WARNING: Never store access tokens in environment variables per shop. Use a database with encryption (e.g., AES-256). If your `.env` leaks, ALL your merchants are compromised.

⚠️ WARNING: Always validate HMAC on OAuth callback AND on every session token (App Bridge). Never trust the `shop` parameter without verification.

**Docs:** https://shopify.dev/docs/apps/build/authentication-authorization

---

### C6. Shopify CLI

**Installation:**
```bash
npm install -g @shopify/cli @shopify/theme

# Verify
shopify version

# Login
shopify auth login --store mystore.myshopify.com
```

**Theme commands:**
```bash
shopify theme dev                          # Start local dev server with live sync
shopify theme dev --store mystore          # Specify store
shopify theme push                         # Push theme to store (unpublished)
shopify theme push --publish               # Push and publish
shopify theme push --theme 12345           # Push to specific theme ID
shopify theme pull                         # Download theme from store
shopify theme list                         # List all themes
shopify theme package                      # Package theme as .zip for manual upload
shopify theme check                        # Run Theme Check linter
shopify theme open                         # Open theme in browser
shopify theme delete --theme 12345         # Delete a theme
```

**App commands:**
```bash
shopify app dev                            # Run app locally (tunnels + serves)
shopify app build                          # Build app extensions
shopify app deploy                         # Deploy extensions to Shopify
shopify app config link                    # Link local app to shopify.app.toml
shopify app config push                    # Push local config to partner dashboard
shopify app generate extension             # Scaffold a new extension
```

**shopify.app.toml structure:**
```toml
name = "My App"
client_id = "abc123"
application_url = "https://myapp.com"
embedded = true

[access_scopes]
scopes = "read_products,write_orders"

[auth]
redirect_urls = ["https://myapp.com/auth/callback"]

[webhooks]
api_version = "2025-07"

  [[webhooks.subscriptions]]
  topics = ["app/uninstalled"]
  uri = "/webhooks"

[pos]
embedded = false
```

⚠️ WARNING: `shopify theme dev` creates a development theme in the store. Don't forget to delete it when done — stores accumulate stale dev themes.

⚠️ WARNING: `shopify theme push --publish` goes live immediately. Always use `--publish` intentionally, not as a default. In CI/CD, separate push and publish into distinct steps.

**Docs:** https://shopify.dev/docs/api/shopify-cli

---

### C7. Shopify Functions

**What they are:** WebAssembly modules running on Shopify's edge infrastructure to customize checkout behavior.

**Available function types:**
| Function | Purpose |
|---|---|
| Discount | Apply custom discount logic (order, product, shipping) |
| Payment customization | Show/hide/rename/reorder payment methods |
| Delivery customization | Show/hide/rename/reorder delivery options |
| Cart transform | Modify cart lines before checkout |
| Order routing | Route fulfillment to specific locations |
| Fulfillment constraints | Add custom fulfillment rules |

**Limitations:**
- No network I/O (no external API calls during execution)
- No file system access
- Execution time limit: 5ms
- Memory limit: 10MB
- Input/output strictly defined by Shopify's input query
- Language: Rust (best performance) or JavaScript/TypeScript (compiled to WASM via Javy)

**Creating a function:**
```bash
shopify app generate extension --template discount          # scaffold
cd extensions/my-discount
# Edit src/index.ts (JS) or src/main.rs (Rust)
shopify app build                                           # compile to WASM
shopify app deploy                                         # deploy
```

**JavaScript Function example (order discount):**
```typescript
// src/index.ts
import { FunctionRunResult, Input } from "../generated/api";

export function run(input: Input): FunctionRunResult {
  const discountValue = input.cart.attribute?.value ?? "0";
  const percentage = parseFloat(discountValue);
  
  if (percentage <= 0 || isNaN(percentage)) {
    return { discounts: [], discountApplicationStrategy: "FIRST" };
  }
  
  return {
    discounts: [
      {
        value: { percentage: { value: percentage.toString() } },
        targets: [{ orderSubtotal: { excludedVariantIds: [] } }],
        message: `Custom ${percentage}% discount`
      }
    ],
    discountApplicationStrategy: "FIRST"
  };
}
```

⚠️ WARNING: Functions cannot call external APIs during execution. Pass necessary data through metafields on the discount or via cart attributes set before checkout.

⚠️ WARNING: Function bugs can silently break checkout. Test exhaustively using `shopify app function run` locally before deploying.

**Docs:** https://shopify.dev/docs/apps/build/functions

---

### C8. Hydrogen & Oxygen

**Hydrogen:**
- Shopify's React framework for headless storefronts
- Built on Remix
- Includes: Storefront API client, caching primitives, streaming SSR
- When to use: Need custom UX, complex personalization, performance beyond what Liquid can deliver

**Creating a Hydrogen app:**
```bash
npm create @shopify/hydrogen@latest
# or
shopify hydrogen init

cd my-hydrogen-app
npm install
shopify hydrogen dev
```

**Oxygen:**
- Shopify's edge hosting for Hydrogen apps
- Free with any paid Shopify plan
- Global CDN, edge compute
- Limitations: 128MB memory, 50MB worker bundle size, cold starts ~100-200ms

**Deploy to Oxygen:**
```bash
shopify hydrogen deploy
# or in CI:
shopify hydrogen deploy --token $SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN
```

**Storefront API client in Hydrogen:**
```typescript
// server.ts
import {createStorefrontClient} from '@shopify/hydrogen';

const {storefront} = createStorefrontClient({
  publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
  storeDomain: env.PUBLIC_STORE_DOMAIN,
  storefrontApiVersion: '2025-07',
});

// In a Remix loader
export async function loader() {
  const {products} = await storefront.query(PRODUCTS_QUERY);
  return json({products});
}
```

**When NOT to use Hydrogen:**
- Simple marketing stores with standard catalog
- Client doesn't have React/JS developers
- Budget doesn't support higher development cost
- Quick turnaround projects

⚠️ WARNING: Hydrogen adds significant complexity. Only use it when the performance or UX requirements genuinely can't be met with a Liquid theme.

⚠️ WARNING: Oxygen cold starts are real. Pre-warm with uptime monitoring pings if needed, or use Vercel/Cloudflare Workers for lower cold start times.

**Docs:** https://shopify.dev/docs/storefronts/headless/hydrogen

---

### C9. Metafields & Metaobjects

**Metafields:**
```
Namespace: custom          (your namespace)
Key:       care_instructions
Full key:  custom.care_instructions
```

**Supported types:**
- `single_line_text_field`, `multi_line_text_field`
- `number_integer`, `number_decimal`
- `boolean`
- `date`, `date_time`
- `url`
- `color`
- `json`
- `file_reference` (image, video, file)
- `product_reference`, `variant_reference`, `collection_reference`, `page_reference`
- `metaobject_reference`
- All above as `list.*` (array of values)

**Setting metafield definitions:**
- Admin → Settings → Custom data → [Resource type] → Add definition
- Definitions enable: type validation, storefront API access, theme editor connection

**Accessing in Liquid:**
```liquid
{# Product metafield #}
{{ product.metafields.custom.care_instructions.value }}

{# With a file reference #}
{% assign spec_sheet = product.metafields.custom.spec_sheet.value %}
<a href="{{ spec_sheet | file_url }}">Download spec sheet</a>

{# List type #}
{% for feature in product.metafields.custom.features.value %}
  <li>{{ feature }}</li>
{% endfor %}
```

**Accessing via API:**
```graphql
query {
  product(id: "gid://shopify/Product/12345") {
    metafields(identifiers: [
      { namespace: "custom", key: "care_instructions" }
    ]) {
      value
      type
    }
  }
}
```

**Metaobjects:**
- Custom CMS-like content types
- Example: create a "Team Member" type with fields: name, bio, photo, title
- Can be referenced from product metafields
- Accessible via Storefront API and Admin API
- Create in: Admin → Settings → Custom data → Metaobjects → Add definition

⚠️ WARNING: Metafields on products are NOT exposed via Storefront API unless you: (1) create a metafield definition, and (2) enable storefront access on the definition.

⚠️ WARNING: Namespace `custom` is reserved for merchant use in admin. For app-owned metafields, use your app's namespace (e.g., `myapp_namespace.key`). Don't write to `custom.*` from apps.

**Docs:** https://shopify.dev/docs/apps/build/custom-data

---

### C10. Rate Limits & Error Handling

**REST API leaky bucket:**
```javascript
// Retry on 429 with exponential backoff
async function shopifyRequest(url, options, retries = 3) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    if (retries === 0) throw new Error('Rate limit exceeded, retries exhausted');
    
    const retryAfter = parseFloat(response.headers.get('Retry-After') || '2');
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return shopifyRequest(url, options, retries - 1);
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}
```

**GraphQL throttle check:**
```graphql
# Always include throttleStatus in GraphQL responses during development
{
  products(first: 50) {
    edges { node { id title } }
  }
  shop {
    name
  }
}

# Response includes:
# "extensions": {
#   "cost": {
#     "requestedQueryCost": 52,
#     "actualQueryCost": 52,
#     "throttleStatus": {
#       "maximumAvailable": 1000,
#       "currentlyAvailable": 948,
#       "restoreRate": 50
#     }
#   }
# }
```

**API versioning — quarterly schedule:**
- Jan 1: `YYYY-01` release
- Apr 1: `YYYY-04` release
- Jul 1: `YYYY-07` release
- Oct 1: `YYYY-10` release
- Each version supported for ~12 months
- Use `unstable` version only for testing upcoming changes — never in production

⚠️ WARNING: `unstable` API version changes without notice. Never use in production.

**Docs:** https://shopify.dev/docs/api/usage/rate-limits

---

## D. Compliance, Legal & Best Practices

### D1. PCI-DSS

**Shopify's role:**
- Shopify is Level 1 PCI DSS compliant (highest level)
- Shopify handles all cardholder data storage and transmission
- Merchants are eligible for **SAQ A** (simplest self-assessment) when using hosted checkout
- SAQ A requirements: ensure your website doesn't capture or transmit card data, maintain your systems (keep software updated, no malware, secure passwords)

**What merchants are still responsible for:**
- Their own computers and systems that access Shopify admin
- Physical security of POS devices
- Not storing card numbers in order notes or emails
- Ensuring 3rd-party apps they install are also PCI compliant

⚠️ WARNING: Custom payment forms that capture card numbers client-side and send them to your server = instant PCI scope expansion. Never do this. Always use Shopify's payment form or a PCI-compliant payment element from a gateway (Stripe Elements, etc.).

**Docs:** https://help.shopify.com/en/manual/payments/shopify-payments/pci-compliance

---

### D2. GDPR

**Key roles:**
- Shopify = Data Processor (processes data on merchant's behalf)
- Merchant = Data Controller (determines why and how data is processed)
- Your agency/app = also Data Processor if you access customer data

**DPA (Data Processing Agreement):**
- Shopify's DPA is incorporated into their Terms of Service
- Your agency should have its own DPA with clients
- Your apps must have a DPA available

**GDPR requirements for apps (mandatory webhooks):**
- `customers/data_request`: customer requests their data → you must provide it within 30 days
- `customers/redact`: customer requests deletion → delete from your systems within 30 days
- `shop/redact`: sent 48 days after app uninstall → delete all shop data

**Cookie consent:**
- Shopify has a built-in cookie consent banner (enabled via theme customizations → Cookie banner)
- For more control: Cookiebot, OneTrust, CookieYes as 3rd-party apps
- Must block non-essential cookies (analytics, marketing) until consent given
- ⚠️ Google Analytics fires by default in many themes — ensure it's blocked until consent

**Right to erasure:**
- Customers can request data deletion
- Admin → Customers → click customer → Actions → Request data export / Erase personal data
- Erasure replaces identifying info with anonymized data; orders are preserved for financial records

⚠️ WARNING: If your app stores customer data (email, order history, etc.) on your servers, YOU must implement data deletion when receiving the `customers/redact` webhook. Ignoring GDPR webhooks = violation of App Store policies and potential legal liability.

**Docs:** https://shopify.dev/docs/apps/build/privacy-law-compliance

---

### D3. CCPA (California Consumer Privacy Act)

**Applicable to merchants:**
- Businesses with annual gross revenue over $25M, OR
- Buy/sell/share personal data of 100,000+ consumers/households, OR
- Derive 50%+ revenue from selling personal data

**Key rights:**
- Right to know what data is collected
- Right to delete personal data
- Right to opt out of data "sale" (includes sharing for advertising)
- Right to non-discrimination

**Implementation:**
- "Do Not Sell or Share My Personal Info" link in footer
- Privacy policy that covers CCPA requirements
- Process deletion requests within 45 days

**Shopify's role:**
- Shopify provides tools for data export and deletion requests
- Cookie consent for opt-out of tracking-based advertising

---

### D4. App Store Submission Requirements

**Required for listing:**
- Working app (no crashes, no placeholder functionality)
- Privacy policy URL (must be live and comprehensive)
- App listing: accurate name, description, screenshots (1280×800px minimum, 2:1.5 aspect ratio), category
- Pricing page (transparent billing, free trial clearly labeled)
- Mandatory GDPR webhooks implemented and working
- Mandatory app webhooks (app/uninstalled) working
- Billing via Shopify Billing API (not direct payment outside Shopify)

**Common rejection reasons:**
- Misleading description (promises features not in app)
- Missing or broken privacy policy
- GDPR webhooks not implemented or returning errors
- Poor onboarding experience (no guidance for first-time users)
- Screenshots don't match actual app UI
- Billing not using Shopify Billing API
- App crashes or throws errors during review
- Permissions requested don't match app functionality (over-scoped)

**Review timeline:** 2-7 business days typically; resubmissions after rejection take additional time

⚠️ WARNING: App reviewers test your app in a development store. Make sure your app handles development stores correctly (no production-only assumptions).

**Docs:** https://shopify.dev/docs/apps/launch/app-review

---

### D5. Chargebacks & Fraud

**Chargeback process:**
1. Customer disputes charge with their bank
2. Bank issues chargeback; funds debited from merchant
3. Merchant has limited time to respond (typically 7-21 days depending on card network)
4. Submit evidence: order confirmation, delivery proof, customer communication, IP logs
5. Card network decides (takes 30-120 days)

**Evidence for winning chargebacks:**
- Proof of delivery (tracking number, delivery confirmation)
- Signed receipt (for in-person)
- Customer IP address and browser fingerprint at time of purchase
- Email correspondence showing customer received/used item
- Terms of service agreed to at checkout
- Order confirmation email log

**Shopify's chargeback assistance:**
- Shopify Payments includes automated chargeback response submissions
- Evidence auto-compiled from order data
- Available in Admin → Payments → Disputes

**Fraud analysis indicators (high risk):**
- AVS (address verification) mismatch
- CVV mismatch
- Billing/shipping address in different countries
- High-value order, expedited shipping, first-time customer
- Multiple failed payment attempts
- IP address doesn't match billing address country

⚠️ WARNING: Do not fulfill high-risk orders automatically. Review manually or require phone verification. Even if payment succeeds, a chargeback can be won by the customer if it's fraud.

---

## E. Common Mistakes & Production Pitfalls

### E1. Theme Performance Traps

**Render-blocking scripts:**
```html
<!-- BAD: blocks rendering -->
<script src="/app.js"></script>

<!-- GOOD: deferred loading -->
<script src="/app.js" defer></script>
<script src="/app.js" async></script>
```

**Unoptimized images:**
- Always use Shopify's image URL filter for responsive images
```liquid
{# BAD: full-size original #}
<img src="{{ product.featured_image | img_url: 'master' }}">

{# GOOD: responsive with srcset #}
{{ product.featured_image | image_tag: widths: '200,400,800,1200', sizes: '(min-width: 768px) 50vw, 100vw' }}
```

**Too many apps injecting scripts:**
- Each app adding `<script>` = more HTTP requests, more JavaScript parse time
- Target: <5 app scripts on any given page
- Audit with Chrome DevTools Network tab — filter by JS, see what's loading

**Excessive Liquid loops:**
```liquid
{# BAD: N+1 — nested loops causing slow renders #}
{% for product in collection.products %}
  {% for tag in product.tags %}     {# this iterates all tags for every product #}
    {% if tag contains 'sale' %}...{% endif %}
  {% endfor %}
{% endfor %}

{# BETTER: filter first, loop once #}
{% assign sale_products = collection.products | where: 'tags', 'sale' %}
```

⚠️ WARNING: Shopify Liquid has a 30-second render timeout. Complex loops over large collections WILL time out in production if not paginated.

⚠️ WARNING: Third-party fonts loaded via `@font-face` from external CDN can add 200-500ms to LCP. Self-host critical fonts in `/assets/` and use `font-display: swap`.

**Page speed checklist:**
- [ ] Images lazy-loaded below the fold (`loading="lazy"`)
- [ ] Images sized correctly (not 2000px wide for a 300px element)
- [ ] Scripts deferred/async
- [ ] Unused app scripts removed from theme
- [ ] CSS minified
- [ ] Lighthouse score > 85 on mobile

---

### E2. App Post-Launch Killers

**Mandatory webhook failures:**
- If `app/uninstalled` webhook fails: you never know merchants uninstalled → orphaned tokens
- If GDPR webhooks fail: App Store compliance violation → app delisted

**Billing plan mismatches:**
- App subscription not set up properly → merchants can use app for free indefinitely
- Shopify Billing API: always check subscription status before serving app functionality
- Handle `app/subscriptions_cancelled` webhook to disable access

**API version expiry:**
- Hard-coded old API version → Shopify retires it → all API calls fail
- Always set up alerts for upcoming API deprecations (Shopify emails, changelog RSS)

**Over-scoping permissions:**
- Requesting `write_customers` when you only need `read_customers`
- App Store reviewers reject over-scoped apps
- More importantly: you become the security attack surface if compromised

---

### E3. Security Mistakes

**Exposed API keys:**
```liquid
{# NEVER DO THIS in theme code #}
{% assign api_key = 'shpat_abc123secrettoken' %}

{# NEVER DO THIS in client-side JS #}
const adminToken = 'shpat_abc123secrettoken'; // exposed in browser
```

**Missing webhook HMAC validation:**
- Anyone can POST to your webhook endpoint and inject fake data
- Always validate `X-Shopify-Hmac-SHA256` (see Stream C3 example)

**OAuth state parameter not validated:**
- Allows CSRF attacks during OAuth flow
- Always generate a random nonce, store it server-side, validate on callback

**SQL injection in app:**
- Parameterize all database queries — never string-concatenate shop domain or user input into queries

**XSS via Liquid:**
```liquid
{# DANGEROUS: unescaped output #}
{{ customer.name }}  {# Liquid auto-escapes — this is safe #}

{# DANGEROUS: using raw filter with user input #}
{{ customer.note | raw }}  {# NEVER use raw on user-supplied content #}
```

⚠️ WARNING: Store API tokens encrypted in your database (AES-256 minimum). Use environment variables only for the encryption key, not the tokens themselves.

⚠️ WARNING: Session tokens (App Bridge) expire and must be re-validated on every request. Never cache session tokens server-side or trust them without re-verification.

---

### E4. Operator Mistakes

**Customizations lost on theme update:**
- Editing theme files directly → those edits are lost when new theme version uploaded
- ⚠️ Solution: duplicate theme before editing; document all changes; use git for theme version control

**Wrong tax settings:**
- "Include tax in prices" turned on/off changes all listed prices dramatically
- Test all price displays after changing tax settings
- Country-specific tax nexus not configured → collecting wrong amount

**Shipping rate errors:**
- No shipping rate for a product's weight → customer sees "No shipping options available"
- Carrier-calculated rates fail if product weights missing
- Free shipping threshold not set per zone → free for domestic but not international

**Duplicate SKUs:**
- Shopify allows duplicate SKUs (it's a warning, not an error)
- Causes: inventory sync failures with 3rd-party systems, incorrect reporting
- ⚠️ Audit SKUs before migrating or integrating with any ERP/WMS

**Metafield namespace conflicts:**
- Creating app metafields in `custom.*` namespace instead of app-specific namespace
- Merchants overwriting app data, or app overwriting merchant's custom data

---

### E5. Partner Mistakes

**Wrong store type — losing commission:**
- Building on a development store then transferring = 0% commission
- Fix: have client sign up via your affiliate link, THEN you get collaborator access

**Collaborator vs staff account confusion:**
- Staff account: counts toward plan's staff limit, managed in Admin
- Collaborator: doesn't count toward limit, managed via Partner Dashboard
- ⚠️ Some clients delete "staff account" thinking it removes your access — but if you're a collaborator, your access is separate

**Requesting too many permissions:**
- Clients get nervous when collaborator request asks for "full access"
- Request only what you need for the project; expand later if needed

**Not completing tax forms:**
- W-8/W-9 not submitted → Shopify withholds all commissions until completed
- Common for new agencies: months of earned commissions sitting unclaimed

**Billing currency mismatch:**
- PayPal account currency doesn't accept USD → payments bounce
- Always confirm PayPal account can receive USD before expecting payment

---

### E6. Migration Pitfalls

**Shopify → Shopify (store migration):**
- Customer passwords cannot be migrated (hashed passwords are not exportable)
- Send password reset email to all customers post-migration
- Product IDs change → update any hardcoded URLs or integrations
- Set up 301 redirects for all old product/collection URLs
- Historical orders can be imported but have limited functionality (no fulfillment actions)
- Apps need to be re-installed and reconfigured

**WooCommerce → Shopify:**
- Product IDs and URLs differ completely → 301 redirects for every URL
- Customer passwords cannot migrate (different hashing)
- Order history: use a migration app (Cart2Cart, LitExtension) or manual import
- WooCommerce plugins have no Shopify equivalents — audit all functionality before migrating
- Custom WooCommerce templates require rewrite as Liquid sections
- Inventory: export from WooCommerce as CSV, map columns to Shopify format, import

**Magento → Shopify:**
- High complexity migration — Magento's data model is significantly different
- Configurable products → Shopify products with variants (mapping required)
- Layered navigation → Shopify filter apps needed
- Custom Magento modules → evaluate if Shopify apps exist as replacements
- Test extensively: promotions, tiered pricing, B2B rules often need full rebuild

**General migration checklist:**
- [ ] Export and map all product data (including metafields)
- [ ] Export all customer data (email, addresses, tags)
- [ ] Note: passwords never migrate
- [ ] Export all orders (for historical reference)
- [ ] Map all URLs → set up 301 redirects
- [ ] Re-create all discount codes
- [ ] Re-install and configure all apps
- [ ] Test checkout end-to-end before DNS cutover
- [ ] Plan DNS cutover during low-traffic period
- [ ] Monitor 404s for first 30 days post-migration

⚠️ WARNING: Never cut DNS over without testing checkout with a real payment in production first (use a $1 test product). Payment gateway, tax, and shipping issues only surface in live environment.

---

### E7. Checkout Mistakes

**Not testing per market:**
- Payment methods enabled in US may not be enabled in EU/UK/AU
- Test checkout with a VPN in each active market, or use Shopify's market-based testing

**Untested edge cases:**
- 100% discount codes (price = $0) — does checkout still require payment info?
- Digital-only orders (no shipping step should appear)
- Mixed cart (physical + digital + gift card) — multiple fulfillment types
- Orders where every item is sold out between add-to-cart and checkout

---

## F. Workflow & Tooling

### F1. Development Environment Setup

**Required software:**
```bash
# Node.js LTS (via nvm — strongly recommended over direct install)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts

# Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Git (usually pre-installed on Mac)
git --version

# Optional but recommended
npm install -g prettier       # code formatting
```

**VS Code extensions:**
- Shopify Liquid (official Shopify extension) — syntax highlighting, IntelliSense, Theme Check integration
- GitLens — enhanced git history/blame
- ESLint — JS linting
- Prettier — code formatting
- DotENV — .env file syntax highlighting

**Recommended .gitignore for Shopify themes:**
```gitignore
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/

# Shopify CLI
.shopify/

# Theme-specific (don't commit settings data — it contains store-specific values)
config/settings_data.json
```

⚠️ WARNING: `config/settings_data.json` contains all the merchant's theme customizations. Committing it and pushing to another store overwrites their settings. Only commit it if you're managing a single-store theme.

---

### F2. Theme Development Workflow

```bash
# 1. Clone or create theme repo
git clone https://github.com/Shopify/dawn.git my-client-theme
cd my-client-theme

# 2. Connect to development store
shopify theme dev --store mydevstore.myshopify.com

# 3. Open browser — live preview at localhost:9292
# Changes to theme files auto-sync to dev store

# 4. Commit changes
git add .
git commit -m "Add custom product badges section"

# 5. Push to staging theme (not published)
shopify theme push --store client-staging.myshopify.com

# 6. Client reviews staging preview
# Staging URL: https://client-staging.myshopify.com/?preview_theme_id=THEME_ID

# 7. After approval, push to production store
shopify theme push --store client.myshopify.com --publish
```

**Theme Check in CI:**
```yaml
# .github/workflows/theme-check.yml
name: Theme Check
on: [push, pull_request]
jobs:
  theme-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g @shopify/cli @shopify/theme
      - run: shopify theme check --fail-level error
```

---

### F3. App Development Workflow

```bash
# 1. Create app from CLI
shopify app init
# Choose: Remix template (recommended)

cd my-app

# 2. Link to Partner Dashboard app
shopify app config link

# 3. Start local dev (uses Cloudflare tunnel automatically)
shopify app dev

# 4. Test on development store at localhost:3000
# or the tunnel URL provided

# 5. Add app to dev store via Partner Dashboard or install URL

# 6. Develop features, commit to git

# 7. Deploy extensions
shopify app deploy

# 8. For hosting: deploy app server to Fly.io / Render / Railway / Vercel
```

**Environment variables (.env):**
```env
SHOPIFY_API_KEY=abc123
SHOPIFY_API_SECRET=def456
SHOPIFY_SCOPES=read_products,write_orders
HOST=https://your-app.fly.dev
DATABASE_URL=postgres://...
ENCRYPTION_KEY=32-char-random-string
```

**Database recommendations:**
- Development: SQLite (included in Remix template via Prisma)
- Production: PostgreSQL (Supabase, Neon, Railway, Fly Postgres)
- Prisma ORM is included in Shopify's Remix template

---

### F4. Testing Strategies

**Development stores:**
- Use Shopify Payments in test mode (Settings → Payments → Shopify Payments → Manage → Test mode)
- Test card: `4111 1111 1111 1111`, any future expiry, any CVV
- Declined card: `4000 0000 0000 0002`
- 3D Secure: `4000 0000 0000 3220`

**Bogus Gateway (no Shopify Payments setup needed):**
- Settings → Payments → Add payment provider → Third-party providers → Bogus Gateway
- Enter "1" as card number for success, "2" for failure, "3" for exception

**Theme preview links:**
- After pushing an unpublished theme: `https://store.myshopify.com/?preview_theme_id=THEME_ID`
- Share with clients for review before publishing

**App testing checklist:**
- [ ] Install app via OAuth on fresh dev store
- [ ] Test all core functionality
- [ ] Test uninstall + reinstall flow
- [ ] Verify GDPR webhooks fire and log correctly
- [ ] Verify `app/uninstalled` webhook fires
- [ ] Test billing plan (create subscription, cancel, upgrade)
- [ ] Test with throttled API (reduce rate limits artificially)
- [ ] Check for console errors in browser

---

### F5. Deployment Workflows

**Theme CI/CD with GitHub Actions:**
```yaml
# .github/workflows/deploy-theme.yml
name: Deploy Theme
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install Shopify CLI
        run: npm install -g @shopify/cli @shopify/theme
        
      - name: Deploy Theme
        env:
          SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
          SHOPIFY_FLAG_STORE: ${{ secrets.SHOPIFY_STORE }}
        run: |
          shopify theme push \
            --store $SHOPIFY_FLAG_STORE \
            --theme ${{ secrets.THEME_ID }} \
            --allow-live
```

**App hosting options:**
| Platform | Best for | Pros | Cons |
|---|---|---|---|
| Fly.io | Production apps | Fast, global, good Postgres support | More DevOps knowledge needed |
| Render | Medium apps | Simple, good free tier | Slower cold starts |
| Railway | Prototypes | Very easy, fast deploy | Pricing at scale |
| Vercel | Remix/Next.js apps | Excellent Remix support, fast | Serverless limitations for long jobs |

---

### F6. Client Handoff Best Practices

**Before handoff:**
- [ ] Remove your collaborator account (or downgrade permissions to minimum needed)
- [ ] Transfer development store to client (if applicable)
- [ ] Document all customizations (custom sections, metafield definitions, app configurations)
- [ ] Verify client has owner account access
- [ ] Change all shared passwords/API keys the client doesn't control
- [ ] Verify client has completed Shopify Payments KYC (if applicable)
- [ ] Confirm client's billing info is on file
- [ ] Run final Lighthouse audit — document baseline performance score

**Handoff documentation (deliver to every client):**
- Store admin URL and how to log in
- List of all installed apps (name, purpose, monthly cost)
- List of all theme customizations and where to find them in theme editor
- List of all metafield definitions and what they're used for
- Shipping profile setup explained
- Tax settings explained
- "How to add a product" walkthrough (video recording recommended)
- Emergency contacts: your agency contact info, Shopify Support (https://help.shopify.com/en/support), payment gateway support

**Access after handoff:**
- Maintain collaborator access if you're doing ongoing support
- Clearly define in contract: what's included in support retainer vs billed separately

---

### F7. Pricing & Proposal Framework

**Discovery call structure (1 hour):**
1. Current situation: what platform are they on, what's broken, what's the goal
2. Scope: products (how many?), collections, pages, apps needed
3. Design: existing brand assets? Existing designs? Starting from scratch?
4. Timeline: when do they need to launch?
5. Budget: do they have a budget in mind?

**Shopify project pricing tiers (rough agency benchmarks — adjust for your market):**
| Project type | Range | Notes |
|---|---|---|
| Basic store setup (theme config + products) | $1,500–$3,500 | Existing theme, <50 products |
| Custom theme build | $5,000–$20,000+ | From Dawn base; design + dev |
| Complex custom theme | $15,000–$50,000+ | Complex UX, custom sections, animations |
| App integration setup | $500–$2,500 | Install + configure existing apps |
| Custom app development | $5,000–$30,000+ | Depends on scope |
| Migration (WooCommerce/Magento → Shopify) | $3,000–$15,000+ | Data complexity drives price |
| Shopify Plus implementation | $15,000–$60,000+ | Checkout customization, B2B, automation |
| Ongoing retainer | $500–$5,000/month | Scope defines the range |

**Revenue from referrals:**
- Refer 10 clients on $79/month Shopify plan → ~$158/month passive revenue
- Refer 3 Plus clients at $2,300/month → ~$1,380/month passive revenue
- Builds over time as client base grows

**Proposal structure:**
1. Executive summary (1 paragraph)
2. Project scope (bullet list of deliverables — be specific)
3. Out of scope (equally important — protects you)
4. Timeline with milestones and client review points
5. Investment (flat fee preferred; hourly for undefined scope work)
6. Payment terms (50% upfront for projects under $5K; 33/33/33 for larger)
7. Maintenance/support post-launch terms
8. Expiry (14-30 days)

---

### F8. Recommended Tools & Resources

**Development tools:**
| Tool | Purpose | URL |
|---|---|---|
| Shopify CLI | Theme + app development | npm: @shopify/cli |
| Theme Check | Liquid linting | Built into Shopify CLI |
| Shopify GraphiQL | GraphQL API explorer | {store}/admin/api/graphiql |
| Shopify Theme Inspector | Chrome extension for Liquid render profiling | Chrome Web Store |
| Metafields Guru | Manage/view metafields (app) | apps.shopify.com |
| Polaris Sandbox | Polaris component playground | polaris.shopify.com |
| Shopify Changelog | Stay current on API/feature changes | shopify.dev/changelog |
| Postman | API testing | postman.com |

**Learning resources:**
| Resource | URL |
|---|---|
| Shopify Dev Docs | shopify.dev |
| Partner Academy | shopify.com/partners/academy |
| Shopify Help Center | help.shopify.com |
| Shopify Community | community.shopify.com |
| Shopify Partner Blog | shopify.com/partners/blog |
| Shopify Changelog | shopify.dev/changelog |
| GitHub (Shopify org) | github.com/Shopify |
| Shopify Liquid Cheatsheet | shopify.dev/docs/api/liquid |

**Agency workflow apps:**
| Category | Tools |
|---|---|
| Project management | Linear, Notion, Asana, ClickUp |
| Design handoff | Figma, Zeplin |
| Client portal | Basecamp, Notion, client.io |
| Time tracking | Harvest, Toggl |
| Proposals | Proposify, PandaDoc, Better Proposals |
| Contracts | Bonsai, HelloSign, DocuSign |

---

*End of Shopify Agency Knowledge Base*
*Verify pricing, rate limits, and commission rates against official sources — these change periodically.*
*Official changelog: https://shopify.dev/changelog*
