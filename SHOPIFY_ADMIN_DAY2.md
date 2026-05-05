# Shopify Admin Setup — Day 2

Everything in this file needs to be done in the **Shopify Admin** (not in theme code).  
Theme code is done. Admin is the manual layer.

---

## 1. Navigation Menus

Go to **Online Store → Navigation** and create or update these menus.

### Main Menu (handle: `main-menu`)

| Title | Link | Notes |
|---|---|---|
| Shop | `/collections/all` | |
| Universe | — | Parent only — add children below |
| → Meet Vibe | `/pages/about` | Child of Universe |
| → Universe | `/pages/universe` | Child of Universe |
| Book Appointment | `/pages/book-appointment` | Theme auto-disables this link — shows "Coming soon" |

### Footer — Brand Column (handle: `footer-brand`)

| Title | Link |
|---|---|
| Our Purpose | `/pages/our-purpose` |
| Production & Responsibility | `/pages/production-responsibility` |
| Diamonds: Nature & Lab | `/pages/diamonds-nature-lab` |
| Privacy Policy | `/policies/privacy-policy` |
| Terms of Service | `/policies/terms-of-service` |

### Footer — Customer Care Column (handle: `footer-care`)

| Title | Link |
|---|---|
| Shipping & Delivery | `/pages/shipping` |
| Returns & Exchange | `/pages/returns` |
| Jewellery Care & Repair | `/pages/jewellery-care` |
| Size Guides | `/pages/size-guides` |

---

## 2. Pages to Create

Go to **Online Store → Pages**. Create each page with the default `page` template.  
Placeholder copy is fine at launch — real legal/brand copy comes from Vibe before public launch.

| Page Title | Handle (URL) | Placeholder copy |
|---|---|---|
| Our Purpose | `our-purpose` | "At Bjerrehuus Fine Jewellery, we design each collection with the intention of creating timeless pieces..." |
| Production & Responsibility | `production-responsibility` | "We are committed to producing jewellery with thoughtful consideration for the materials, the planet, and everyone in the value chain." |
| Diamonds: Nature & Lab | `diamonds-nature-lab` | "We work with nature's most precious materials — diamonds sourced responsibly, both natural and lab-grown." |
| Customer Care | `customer-care` | "For any questions, please contact us at client@bjerrehuusfinejewellery.com or WhatsApp +45 22 77 36 84." |
| Shipping & Delivery | `shipping` | "We ship to Denmark and the EU. Delivery times and rates are shown at checkout." |
| Returns & Exchange | `returns` | "We accept returns within 14 days of delivery. Contact us to initiate a return." |
| Jewellery Care & Repair | `jewellery-care` | "To keep your jewellery in perfect condition, store pieces separately and avoid contact with chemicals." |
| Size Guides | `size-guides` | "Ring and bracelet size guides coming soon. Contact us for sizing assistance." |
| Meet Vibe Bjerrehuus | `about` | Use the full "Meet Vibe" copy from the build plan §6 |
| Universe | `universe` | "Stories from Vibe and the world of Bjerrehuus Fine Jewellery. Coming soon." |
| Book Appointment | `book-appointment` | "Book a private appointment at our showroom. Appointment booking coming soon." |

---

## 3. Social Links

Go to **Online Store → Themes → Customize → Theme settings → Social media**.

| Platform | URL |
|---|---|
| Instagram | `https://www.instagram.com/bjerrehuusfinejewellery/` |
| Facebook | `https://www.facebook.com/bjerrehuusfinejewellery` |

LinkedIn: confirm with Vibe whether she has a LinkedIn profile. If yes, add the URL in **Footer → Contact block → LinkedIn URL** setting inside the theme customizer.

---

## 4. Footer Contact Block — Customizer

Go to **Online Store → Themes → Customize → Footer → Contact block**.

Verify these are pre-filled (they should be from footer-group.json):
- Email: `client@bjerrehuusfinejewellery.com`
- Phone/WhatsApp: `+45 22 77 36 84`
- Privacy URL: `/policies/privacy-policy`
- LinkedIn URL: _(add if Vibe has one)_

---

## 5. Shopify Policies

Go to **Settings → Policies** and populate the 3 auto-generated policy pages:

- **Privacy Policy** — Use Shopify's policy generator as a starting point. Vibe will review before launch.
- **Terms of Service** — Same.
- **Refund Policy** — Same.

These auto-appear in the shop footer policy links. The build plan lists them as placeholder now, real copy before public launch.

---

## 6. Logo Upload

Go to **Online Store → Themes → Customize → Header**.

Upload the Bjerrehuus logo PNG. Source:
```
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/bd405351-abd1-42b7-9fcd-6826bf7e3e02/LOGO+-+mor.png?format=2500w
```

Download it locally first, then upload. Set logo width to **140px** in header settings.

---

*End of Day 2 admin checklist.*
