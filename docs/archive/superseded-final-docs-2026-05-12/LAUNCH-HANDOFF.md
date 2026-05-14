# Bjerrehuus Fine Jewellery — Launch Handoff

> Last updated: 2026-05-12

---

## Status snapshot

All theme code is done and pushed to the dev theme. The store is functional on `bjerrehuus-fine-jewelry.myshopify.com`. What follows is exactly what needs to happen — and who does it — before going live.

---

## Patrick's list (you do these)

### 1. Confirm the domain with Vibe first (see Vibe's list below)
Once Vibe tells you where the domain is registered, decide how to connect it.

- **If she bought it through Shopify:** Shopify Admin → Settings → Domains → it should already appear. Set it as primary.
- **If it's at a third-party registrar (GoDaddy, Namecheap, etc.):** Shopify Admin → Settings → Domains → Connect existing domain → Shopify will show you which DNS records to add. Vibe needs to log into her registrar and add them (or give you the login).
- **If she has no domain yet:** Buy one via Shopify Admin → Settings → Domains → Buy new domain. ~$14/year. Shopify handles DNS automatically.

Currently the store runs on the myshopify domain. No custom domain is connected.

### 2. Test the inquire form end-to-end
Once Vibe confirms her email is receiving messages:

1. Open the dev theme preview
2. Go to any product with `purchase_type = inquire`
3. Click "Inquire about this piece"
4. Fill in the modal and submit
5. Confirm email arrives at vibe@stylesnob.com with:
   - Product name in subject line (`[BFJ Inquiry] The Pillow`)
   - Product handle and URL in the body
   - Your message

If the email arrives with full product context: done, no further wiring needed.
If it arrives with missing product context: the `/contact` endpoint may not be passing hidden fields — investigate `snippets/inquire-letter-modal.liquid`.

Shopify Forms is still wanted for the final inquire routing, but it is blocked until the client email/account verification is complete. The `/contact` modal is the launch fallback until that can be wired.

### 3. Final QA (after Vibe has payments live)
Do this after step 4 in Vibe's list is done:

- [ ] Chrome, Safari, Firefox — desktop
- [ ] iPhone Safari + Android Chrome — mobile
- [ ] Keyboard navigation (Tab through pages, all interactive elements reachable)
- [ ] All images have alt text (spot-check product pages, inspiration pages)
- [ ] Place a real order with a small amount — confirm confirmation email arrives
- [ ] Submit a real inquire — confirm email arrives at vibe@stylesnob.com
- [ ] Check 404 page, search page, account page, password page — all styled
- [ ] Run `shopify theme check --path bjerrehuus-theme` — must return 0 custom errors

### 4. Loom walkthrough + admin handoff
After QA passes:

- Record a Loom showing Vibe how to:
  - Add a product
  - Change a homepage section
  - Add a Universe story
  - View inquiries / orders
- Go to Shopify Admin → Settings → Users → change Vibe's account to Store Owner
- Confirm she can log in and navigate

---

## Vibe's list (client does these)

### 1. Shopify Payments — business verification
**Where:** Shopify Admin → Settings → Payments

Vibe must complete the business verification flow that Shopify started when Shopify Payments was enabled. Until this is done, no payments can be taken.

- Complete the identity + business verification form
- Once verified, enable:
  - Apple Pay
  - Google Pay
  - Shop Pay
  - MobilePay (requires Danish bank login / MitID)
- Run one test transaction with a real card for a small amount, then refund it

### 2. Transactional emails — paste branded templates
**Where:** Shopify Admin → Settings → Notifications

The branded HTML templates are already built and sitting in the theme (`assets/email-order-confirmation.html` and `assets/email-shipping-confirmation.html`). Vibe just needs to paste them in.

- Order Confirmation → Edit → paste HTML from `email-order-confirmation.html`
- Shipping Confirmation → Edit → paste HTML from `email-shipping-confirmation.html`

This was blocked on account verification. Do it once Shopify Payments verification is complete (same session).

### 3. Domain — where is it registered?
We need to know: does Vibe own `bjerrehuusfinejewellery.com` (or similar), and if so, where is it registered?

- If through Shopify: tell Patrick, he'll connect it
- If through a third-party registrar: Vibe needs to either give Patrick the registrar login, or add the DNS records herself (Patrick will tell her which ones)
- If she has no domain yet: Patrick can buy one through Shopify (~$14/year)

### 4. Shipping rate approval
Current rates configured:
- Denmark: Free shipping (0 DKK)
- International: Standard — 299 DKK

Vibe confirms whether these are correct or if she wants to adjust them before launch.

### 5. Confirm the store launch date + final review
Before Patrick flips the store from password-protected to live, Vibe should:
- Do a walk-through of the dev theme (Patrick sends the preview link)
- Approve the final product copy, images, and pricing
- Confirm she's happy with the English-only setup (no Danish translations needed at launch per current plan)

---

## What is already done

| Task | Status |
|---|---|
| All theme sections, templates, snippets, assets | ✅ Built and pushed |
| Inquire modal product-context bug | ✅ Fixed (form.reset() moved before hidden fields) |
| Bad product handles in inspiration templates | ✅ Fixed (classic-pave-tennis-bracelet, bridal-diamond-band) |
| Theme Check — 0 custom errors | ✅ All 4 custom errors resolved |
| International / EUR market | ✅ Created and configured |
| Store timezone | ✅ Europe/Copenhagen (fixed by Patrick) |
| Shopify policies (placeholder copy) | ✅ Added by Patrick |
| Shipping zones | ✅ Denmark free, International 299 DKK |
| 17 products with correct metafields | ✅ Live in admin |
| All menus, pages, collections | ✅ Live in admin |
| Branded email HTML templates | ✅ Built — just need to be pasted into Notifications |

---

## What is NOT needed (removed from scope)

- **Danish translations / Translate & Adapt** — store launches in English only. Removed from scope.
- **e-conomic integration** — VAT is handled directly in Shopify. No accounting sync needed at launch.
- **Klaviyo** — removed earlier in the project. Shopify Email handles campaigns natively.
- **Local pickup** — removed from launch scope. Delivery only.
