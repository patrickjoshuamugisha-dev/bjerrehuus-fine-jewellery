# Last Day Additional Steps

These tasks require manual action in Shopify Admin or the App Store. They cannot be fully completed via code.

---

## 1. Shopify Payments — Verify Enabled

**Where:** Shopify Admin → Settings → Payments

**What to do:**
- Confirm Shopify Payments is fully onboarded, not just saved
- Confirm Apple Pay, Google Pay, and Shop Pay are enabled under Wallets
- Enable MobilePay once Vibe can complete the Danish bank / MitID verification
- Test with a real card using a small amount, then refund

**Why:** Cannot be verified reliably via API. Required before any orders can be taken.

---

## 2. Shipping Rates — Confirm Final Amounts

**Where:** Shopify Admin → Settings → Shipping and delivery

**Current launch setup:**
- Denmark: Free shipping
- International: 299 DKK

**What to do:**
- Confirm Vibe is happy with 299 DKK international shipping
- Place one checkout test to confirm the expected rate appears

---

## 3. Shopify Forms — Inquire Submission Routing

**Status: WANTED, BLOCKED — waiting for client email/account verification.**

**Where:** Shopify Admin → Apps → Forms

**What to do once unblocked:**
- Install/open Shopify Forms
- Create an inquiry form
- Set recipient email to `vibe@stylesnob.com`
- Wire the form into the existing inquire modal if Shopify Forms exposes the needed form/embed endpoint

**Current launch fallback:** The inquire modal posts to Shopify's `/contact` endpoint with hidden product context. Test this end-to-end once Vibe confirms the email is receiving messages.

---

## 4. Transactional Emails — Brand Styling

**Status: BLOCKED — waiting for client account/email verification so notifications can be edited.**

**Where:** Shopify Admin → Settings → Notifications

**What to do once unblocked:**
- Open Order Confirmation → Edit code → paste `bjerrehuus-theme/assets/email-order-confirmation.html`
- Open Shipping Confirmation → Edit code → paste `bjerrehuus-theme/assets/email-shipping-confirmation.html`
- Send test emails from Shopify Admin and confirm rendering

---

## Removed From Launch Scope

- Danish translations / Translate & Adapt
- e-conomic
- Klaviyo
- Local pickup
