# Last Day Additional Steps

These tasks require manual action in Shopify Admin or the App Store. They cannot be done via code.

---

## 1. Markets — Language & Currency Toggle

**Where:** Shopify Admin → Settings → Markets

**What to do:**
- Create a "Denmark" market: currency DKK, language Danish
- Create an "International" market: currency EUR, language English

**Why:** The language/currency toggle in the header is already built. It shows nothing until markets are configured here. Once done, visitors can switch between DK and EN.

---

## 2. Translate & Adapt — Danish Translation

**Where:** Shopify App Store → search "Translate & Adapt" (by Shopify, free)

**What to do:**
- Install the app
- Translate all storefront content (product titles, page content, navigation) into Danish

**Why:** Markets (step 1) sets up the toggle, but this app is what delivers the actual Danish text. Without it, clicking "DK" just reloads the page in English.

---

## 4. Shopify Payments — Verify Enabled

**Where:** Shopify Admin → Settings → Payments

**What to do:**
- Confirm Shopify Payments is active (not just saved — must be fully onboarded)
- Confirm Apple Pay, Google Pay, and Shop Pay are all ticked under "Wallets"
- Test with a real card using a small amount, then refund

**Why:** Cannot be verified via API. Required before any orders can be taken.

---

## 5. MobilePay — Payment Method

**Where:** Shopify Admin → Settings → Payments → Shopify Payments → Manage

**What to do:**
- Enable MobilePay under "Wallets"
- Requires your Danish business bank login (MitID / NemID) to verify

**Why:** MobilePay is the dominant mobile payment method in Denmark. Without it a large share of Danish customers won't complete checkout.

---

## 5. e-conomic — Accounting Sync

**Where:** Shopify App Store → search "e-conomic" → install the official integration

**What to do:**
- Install the app
- Log in with your e-conomic account credentials (OAuth)
- Map Shopify products → e-conomic product groups

**Why:** Required for automatic invoice creation and VAT reporting. Cannot be set up via API — requires OAuth with your e-conomic account.

---

## 6. Shopify Forms — Inquire Submission Routing

**Where:** Shopify Admin → Apps → Forms

**What to do:**
- Create a new form
- Set recipient email to client@bjerrehuusfinejewellery.com
- Note the form ID, then add it to the inquire modal in `bjfj-product-main.liquid` (replace the `mailto:` fallback)

**Why:** The inquire modal currently submits via `mailto:`. Shopify Forms gives you a proper server-side submission with confirmation emails and spam protection. Forms app configuration is not accessible via the Admin API.

---

## 7. Transactional Emails — Brand Styling

**Where:** Shopify Admin → Settings → Notifications

**What to do:**
- Open "Order Confirmation" → click Edit → paste the branded HTML below
- Repeat for "Shipping Confirmation" and "Order Cancelled"

**Brand tokens to apply manually:**
```
Background:   #FAF8F5
Text:         #1A1A1A
Accent:       #6B1F2A
Border:       #E8E4DD
Font heading: Cormorant Garamond, Georgia, serif
Font body:    Inter, system-ui, sans-serif
Logo URL:     https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/bd405351-abd1-42b7-9fcd-6826bf7e3e02/LOGO+-+mor.png?format=2500w
```

**Why:** Shopify removed the Notifications REST API in v2024-10. Cannot be done programmatically — must be edited in the Admin UI.

---

## 3. Klaviyo — Email Campaigns

**Where:** Shopify App Store → search "Klaviyo"

**What to do:**
- Install the app
- Connect it to the Shopify store
- Set up welcome flow and any campaign templates

**Why:** The newsletter sign-up form in the footer already works and collects emails via Shopify native forms. Klaviyo is only needed when you're ready to actually send campaigns or automated emails. Not urgent for launch.
