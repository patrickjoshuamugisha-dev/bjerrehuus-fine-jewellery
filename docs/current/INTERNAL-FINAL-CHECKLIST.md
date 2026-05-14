# Bjerrehuus Fine Jewellery — Internal Final Checklist

> Last updated: 2026-05-12  
> Audience: Patrick + Codex. This is the active internal handoff and final launch checklist.

## Status Snapshot

The dev theme is built and pushed. Shopify admin content is live. The store is still password-protected and runs on `bjerrehuus-fine-jewelry.myshopify.com` until the custom domain and final client approvals are done.

Launch scope is locked:
- English-only launch.
- Delivery-only: Denmark free shipping, outside Denmark 299 DKK.
- Shopify-native checkout and inquiries.
- No Danish translations / Translate & Adapt at launch.
- No e-conomic, no Klaviyo, no local pickup.

## Already Done

| Area | Status |
|---|---|
| Theme sections, templates, snippets, assets | Done and pushed to dev theme |
| Product pages | `custom.purchase_type` drives Add-to-Cart vs Inquire modal |
| Inquire modal product context | Fixed; hidden product fields are preserved |
| Homepage, collection, cart, Universe, Meet Vibe | Built |
| Product handles in inspiration templates | Fixed |
| Theme Check | Passing with 0 errors, warnings only |
| Shipping rates | Storefront verified: DK 0 DKK, Germany 299 DKK, US 299 DKK |
| Products | 17 active products live in admin |
| Collections | Launch collections published |
| Menus | Main menu: Shop, Universe, Book Appointment |
| Pages/policies | Live in admin |
| Branded email HTML | Built in `bjerrehuus-theme/assets/` |
| Visual QA workflow | Added in `docs/current/VISUAL-QA-TRACKER.html` |

## Current Verified Checks

- Theme Check command:

```bash
shopify theme check --path bjerrehuus-theme
```

Latest result: exit code `0`, 21 warnings, 0 errors.

- Storefront shipping-rate check used preview password `reibla`, product `Pillow studs - White Gold`, variant `59590303940942`.

Verified results:
- Denmark `2100`: `Gratis fragt`, `0.00 DKK`
- Germany `10115`: `Standard`, `299.00 DKK`
- United States, NY `10001`: `Standard`, `299.00 DKK`

Cart was cleared after testing.

## Client-Dependent Blockers

These are tracked in `docs/current/CLIENT-DEPENDENT-TASKS.html`.

Vibe must complete or confirm:
- Store owner email verification.
- Shopify Payments business/KYC verification.
- MobilePay / wallets after Shopify Payments is verified.
- Domain ownership or registrar location.
- Shipping-rate approval.
- Final content/pricing/image approval and launch date.

Patrick/Codex can only do after Vibe verifies/unblocks:
- Paste branded notification templates.
- Wire or install Shopify Forms for final inquire routing.
- Connect the domain once registrar/domain access is known.
- Run real paid order/refund test.
- Run real inquire email test.
- Final cross-browser/mobile QA.
- Final admin handoff.

## Final Internal Sequence

1. Wait for Vibe email/account verification.
2. Paste transactional email templates:
   - Order confirmation: `bjerrehuus-theme/assets/email-order-confirmation.html`
   - Shipping confirmation: `bjerrehuus-theme/assets/email-shipping-confirmation.html`
3. Install/open Shopify Forms and evaluate final inquire routing. Keep `/contact` modal as fallback if Forms cannot support the needed product-context embed.
4. Wait for Shopify Payments/KYC and wallets.
5. Place one small real paid order and refund it.
6. Submit one real inquire and confirm `vibe@stylesnob.com` receives product name, handle, URL, and customer message.
7. Connect custom domain once Vibe confirms where it lives.
8. Run visual QA using `docs/current/VISUAL-QA-TRACKER.html`:
   - Capture small visual issues with URL, viewport, screenshot, issue, desired result, owner, and status.
   - Keep content/image-choice edits in Shopify admin.
   - Batch repeated layout, crop, spacing, typography, modal, header, footer, and responsive fixes into theme-code groups of 5-12 items.
   - Verify each theme-code batch on desktop and mobile before moving to the next batch.
9. Run final launch QA:
   - Chrome, Safari, Firefox desktop.
   - iPhone Safari and Android Chrome.
   - Keyboard navigation.
   - Product, collection, cart, home, Universe, Meet Vibe, search, 404, account, password.
   - Spot-check image alt text.
10. Record Loom/admin handoff only after QA passes.
11. Remove storefront password and launch only after Vibe gives final approval.

## Phase Two / Post-Launch Actions

- Active phase two checklist: `docs/current/POST-LAUNCH-ACTION-STEPS.md`
- This checklist is the single source of truth for wishlist, Book Appointment activation, international markets, Klarna/invoice payment, Universe story expansion, and e-conomic sync.

## Useful Paths

| Path | Purpose |
|---|---|
| `bjerrehuus-theme/` | Deployable Shopify theme |
| `docs/current/CLIENT-DEPENDENT-TASKS.html` | Client-facing and client-dependent launch tasks |
| `docs/current/POST-LAUNCH-ACTION-STEPS.md` | Phase two / post-launch action checklist |
| `docs/current/VISUAL-QA-TRACKER.html` | Internal visual QA issue tracker and batch workflow |
| `reference/bjerrehuus-fine-jewellery-build-plan.md` | Historical/full build plan, not active checklist |
| `reference/VIBE_EMAIL_AND_TRANSCRIPT.md` | Brand voice and vision |
| `client-docs/` | Client onboarding/packshot docs |
| `client-assets/logo/` | Logo/source assets |
