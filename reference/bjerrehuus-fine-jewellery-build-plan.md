# Bjerrehuus Fine Jewellery — Shopify Build Plan

**Project:** Custom Shopify theme for Bjerrehuus Fine Jewellery
**Owner:** Vibe Bjerrehuus
**Build lead:** Patrick Mugisha (Mugisha Marketing)
**Build tool:** Claude Code
**Domain:** bjerrehuusfinejewellery.com
**Existing site:** https://www.bjerrehuusfinejewellery.com (Squarespace, to be replaced)
**Instagram:** [@bjerrehuusfinejewellery](https://www.instagram.com/bjerrehuusfinejewellery/)
**Contact:** vibe@stylesnob.com · +45 22 77 36 84
**Showroom:** Bredgade 32, 1260 København K (shared with The Jewelry Room / Aqva)

---

## 1. Project Brief

Bjerrehuus Fine Jewellery is a Danish fine-jewellery brand by Vibe Bjerrehuus. Pieces are 14K/18K gold, white gold, and rose gold with diamonds and other fine gemstones, produced in a small Mumbai workshop Vibe co-founded in 2010. Price points range from ~10,000 DKK to 130,000+ DKK.

The brand's core sales motion today is private appointments + word-of-mouth through high-net-worth networks in Denmark. The new site is **not replacing that motion** — it extends it. The site is a beautiful business card with a small classic shop attached, an inspiration/editorial layer for collections that aren't yet directly purchasable, and the architecture for booking appointments later.

**Aesthetic direction:** Editorial, slightly unpolished, personal. Old-meets-new. Premium without being cold or corporate. Closer to *Sophie Bille Brahe* than *Pandora*. Vibe explicitly avoids the "lyserød / beige / havregrød" (oat-and-millennial-pink) e-commerce look.

---

## 2. Constraints & Non-Negotiables

| Constraint | Decision |
|---|---|
| Timeline (build) | 1 week to functional Shopify store |
| Timeline (launch-ready) | 2–3 weeks total (content + photography + final QA) |
| Build language | English-only at launch. Danish/Translate & Adapt is post-launch unless Patrick reopens scope. |
| Geographic scope at launch | Denmark free shipping; International shipping 299 DKK |
| Catalog at launch | 80–100 SKUs (the Classic shop), partly seedable from IG inventory |
| Long-term catalog | 300 styles × 2 variants × up to 6 sizes |
| Vibe's involvement | Build proceeds without blocking on her — pull from existing site, IG, and the call recording |
| Quality bar | "Hellere rigtigt end hurtigt" — right rather than fast. No shipping anything that looks like Lemele or Lesoonar |

---

## 3. Locked Architecture Decisions

1. **Theme base:** Fork **Shopify's Dawn** (the official reference theme). Custom-section everything bespoke. Reasoning: Dawn is ~10–12k lines of clean, currently-maintained reference Liquid that Claude Code can read fully and extend cleanly. Premium themes (Prestige, Impact) ship 30–60k lines of opinionated code that becomes noise to fight on a heavily custom build.

2. **Data model:** All pieces are **Shopify Products**. A product metafield `purchase_type` (`shoppable | inquire`) drives whether the product page shows Add-to-Cart (Classic) or the Inquire letter modal (Inspiration, Bridal). One unified system for photography, SEO, search, related products, and inventory. The "no direct sale" requirement is presentation, not a different data type.

3. **Geography:** Denmark is the primary market with free shipping. International shipping is enabled at 299 DKK for launch.

4. **Languages:** English-only at launch. Danish/Translate & Adapt is post-launch unless Patrick reopens scope.

5. **Shopify account:** Fresh account, Patrick has access. No legacy data to migrate.

6. **Supply chain:** One contact in India (name TBC — call says "Sachin", packshot brief addressed to "Madhur"). Worth confirming with Vibe casually — doesn't block build.

7. **Inquire flow:** Pop-up letter modal triggered by Inquire button on product cards and product pages. Pre-fills product context (name, image, link). User adds short message + email. Submits to Shopify form → email to vibe@stylesnob.com. Visual: branded "letter" aesthetic, logo, envelope/card feel — designed once as a reusable component that the wishlist phase-2 build will inherit.

8. **Wishlist:** Phase 2. **Heart icon UX placeholder in the header at launch** (no function — clicking does nothing or shows a "coming soon" tooltip). Functional wishlist with Paperless-Post-style email send to recipient = post-launch build. Vibe agrees in transcript at 30:48 that this is not first-priority.

9. **Universe content:** Each story is a Shopify **Page** using a custom template `page.universe-story.json`. "Meet Vibe Bjerrehuus" is a separate evergreen About page using its own `page.about.json` template. Universe index page lists stories chronologically.

10. **Inspiration collections:** All 3 inspiration page templates instantiated at launch. **Pillow** fully populated (we have real product data from IG). Other 2 = scaffolded placeholders Vibe fills as content/photography arrive.

11. **Pay-by-invoice:** Phase 2. Klarna requires merchant approval (3–10 business days), don't block week 1 on it. Cards + MobilePay + Apple Pay + Google Pay + Shop Pay at launch.

12. **Accounting sync:** e-conomic is removed from launch scope.

13. **Style tile (Path 2):** Single static HTML deliverable on Day 1 before any template work. Vibe reviews. Lock tokens before scaling to the rest of the site.

14. **Sitemap and navigation:** As specified in §4.

15. **Build sequence:** Day-by-day plan as specified in §7.

---

## 4. Sitemap & Navigation

### URL Structure

| Path | Template | Notes |
|---|---|---|
| `/` | `index.json` | Hero video, 2 feature images, text break, 3 Discover tiles |
| `/collections/all` | `collection.json` | Full Shop landing page with sidebar nav |
| `/collections/classic` | `collection.json` | Classic main collection |
| `/collections/classic-tennis` | `collection.json` | Tennis sub-cat |
| `/collections/classic-necklaces` | `collection.json` | Necklaces sub-cat |
| `/collections/classic-hoops` | `collection.json` | Hoops sub-cat |
| `/collections/classic-alliancering` | `collection.json` | Alliance/eternity rings sub-cat |
| `/collections/classic-studs` | `collection.json` | Studs sub-cat |
| `/collections/bridal` | `collection.json` | Bridal collection |
| `/pages/pillow` | `page.inspiration.json` | Inspiration 1, fully populated at launch |
| `/pages/inspiration-2` | `page.inspiration.json` | Placeholder, name TBD |
| `/pages/inspiration-3` | `page.inspiration.json` | Placeholder, name TBD |
| `/pages/about` | `page.about.json` | Meet Vibe Bjerrehuus (evergreen) |
| `/pages/universe` | `page.universe-index.json` | Lists all Universe stories |
| `/pages/universe/[handle]` | `page.universe-story.json` | Individual story |
| `/pages/book-appointment` | `page.book-appointment.json` | Exists, inactive at launch |
| `/products/[handle]` | `product.json` | Single template, branches on `purchase_type` metafield |
| `/cart` | `cart.json` | Pickup-or-ship logic |
| `/pages/our-purpose` | `page.json` | Footer link |
| `/pages/production-responsibility` | `page.json` | Footer link |
| `/pages/diamonds-nature-lab` | `page.json` | Footer link |
| `/pages/customer-care` | `page.json` | Hub |
| `/pages/shipping` | `page.json` | Footer link |
| `/pages/returns` | `page.json` | Footer link |
| `/pages/jewellery-care` | `page.json` | Footer link |
| `/pages/size-guides` | `page.json` | Footer link |
| `/policies/privacy-policy` | Auto | Shopify policy |
| `/policies/terms-of-service` | Auto | Shopify policy |
| `/policies/refund-policy` | Auto | Shopify policy |

### Header (sticky, on every page)

**Left:** SHOP · UNIVERSE (dropdown: Meet Vibe + 3 latest stories) · BOOK APPOINTMENT (visible but link disabled / "coming soon" cursor)

**Center:** Logo (links to `/`)

**Right:** Search icon · Wishlist heart (placeholder at launch, no function) · Cart · EN/DK toggle (active week 2)

### Footer (3 columns, on every page)

**Column 1 — Bjerrehuus Fine Jewellery**
- Our Purpose
- Production & Responsibility
- Privacy Policy
- Diamonds: Nature & Lab
- Terms of Service

**Column 2 — Customer Care**
- Shipping & Delivery
- Returns & Exchange
- Jewellery Care & Repair
- Size Guides

**Column 3 — Contact**
- vibe@stylesnob.com
- WhatsApp +45 22 77 36 84
- Newsletter signup form
- Privacy policy link (small)
- Social: Instagram, Facebook, LinkedIn

---

## 5. Brand Foundation

### Voice & Tone

Grounded, personal, slightly editorial. Speaks as Vibe, not as a faceless brand. Down-to-earth premium ("smykkerne er dyre, men det er tilgængeligt for alle"). Not aspirational-corporate. Not "luxury" cliché. Not lifestyle-influencer.

### References (in priority order)

| Reference | Why | Specifically pull from |
|---|---|---|
| [Sophie Bille Brahe](https://sophiebillebrahe.com) | Top reference for whole feel + packshots | Product photography, type pairing, editorial feel |
| [Aqva Jewellery](https://akvajewellery.com) | Hand shots reference, livelier feel, 360° video | Hand photography, product page motion, [360° video example](https://akvajewellery.com/da/shop/consilium-da/ora-open-ring/) |
| [Fie Isolde](https://fieisolde.com/en-dk) | General look-and-feel mix | — |
| [Notkin Milano series](https://notkin.com) | Editorial inspiration page reference | Inspiration page layout: hero collage + clean product shots + mood board |

### Anti-references (avoid)

- Lemele — "havregrød" (oats), Pandora-esque, too polished/American
- Lesoonar — too generic e-commerce
- Christian von Arenstorff — launches a competing site Sunday after the call; aesthetically too close to the avoid pile
- Pandora itself — too polished, too commercial

### Recommended Design Tokens (validate in style tile, Day 1)

```css
/* Colors */
--color-bg:        #FAF8F5;  /* warm off-white */
--color-bg-alt:    #F1ECE5;  /* warm second tone */
--color-text:      #1A1A1A;  /* near-black */
--color-text-mut:  #6E6862;  /* muted body */
--color-accent:    #6B1F2A;  /* deep burgundy — primary lean */
--color-accent-alt:#1F3D2C;  /* deep forest — alternative if Vibe prefers */
--color-border:    #E8E4DD;

/* Type — needs validation against Vibe's reaction */
--font-display: 'Cormorant Garamond', 'EB Garamond', serif;  /* free, transitional, personality */
--font-body:    'Inter', system-ui, sans-serif;              /* clean grotesk */

/* Type scale */
--fs-h1: clamp(2.5rem, 5vw, 4.5rem);
--fs-h2: clamp(2rem, 4vw, 3rem);
--fs-h3: 1.5rem;
--fs-body: 1.0625rem;        /* 17px */
--fs-small: 0.875rem;
--lh-body: 1.7;

/* Spacing — 8pt scale */
--s-1: 0.5rem;  --s-2: 1rem;   --s-3: 1.5rem;
--s-4: 2rem;    --s-6: 3rem;   --s-8: 4rem;
--s-12: 6rem;   --s-16: 8rem;

/* Container */
--container-max: 1440px;
--container-pad: clamp(1.5rem, 4vw, 4rem);

/* Motion */
--ease: cubic-bezier(0.22, 1, 0.36, 1);
--dur-fast: 200ms;
--dur-base: 400ms;
```

### Motion Rules

- Hover image-swap on product cards: 200ms cross-fade
- Section fade-in-on-scroll: 400ms ease, 30px Y-offset
- **No parallax**
- **No auto-play carousels**
- **No scroll-jacking**
- One editorial flourish on Inspiration pages: mood board element extending beyond viewport horizontal edge (Vibe drew this on sketch 4)

### Photography Direction (from packshot brief to Mumbai)

- Reference: sophiebillebrahe.com packshots
- Same uniform view across the catalog (so 30 thumbnails read as one set)
- 3 angles per piece per variant
- White background version + colored background version (burgundy / soft rose / similar)
- Stones and gold colors must read accurate and natural
- 360° video per product, akva style
- Open to AI-generated model + hand shots in Sophie Bille Brahe / Aqva style
- Short fingernails, no glittery nails ("ikke glimt")

---

## 6. Asset Inventory

### Logo

```
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/bd405351-abd1-42b7-9fcd-6826bf7e3e02/LOGO+-+mor.png?format=2500w
```
Wordmark style. Pull at 2500w, vectorize for build. Transparent PNG.

### Lifestyle / Brand Photos (placeholder use)

```
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/74ca42e0-aa86-4bcb-9e59-42ec2c5be26e/5691.jpg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/e60a3f74-d135-4103-bbe6-03096181b73c/love.jpg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/033919a5-fa5e-411e-a9ca-b65bb7d26d87/signet.jpg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/74bd8508-433d-4417-9624-c4a988a42d65/vibe+med+mere.jpg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/fe0e869c-69ab-4b3e-8918-5c407cf79033/Vibe+TJR.jpg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/9f94eaab-b486-4d99-9ce1-2025213bcbd1/5794.jpg
```

`Vibe+TJR.jpg` is the About page portrait — use on Meet Vibe page.

### Product Photos from Instagram (placeholder seed)

```
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1731500264711-XG4M4JNRTYIT0XXA8NSA/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1728912431974-89B0NVMJGXH5MO9GZDD6/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1728491158258-UZRLUO7DSVA92GGN8VIX/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1726692174065-85UWEBPU08PVAYXI6N8U/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1723893550322-6NQ8TFK4EXRDERS4E8PQ/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1723215954877-GV3EX7YND7PVN1N2CVB3/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1723126462390-6350U7Z323TX481ARRO8/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722970300994-FT6EA3Y7MY38J7ADQHKK/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861371391-P7SZKYJH530PUN71C175/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861372968-YONOSYSR1BN99L7G98WN/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861373637-W2R2FXLZWK975UY1WOUQ/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861374525-67XGGPJYJNBUV68U6Q7G/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861375325-63DB65IPCAWLOMMGVNW4/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861376190-V993KUDHXD8XP9SNZG5I/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861377028-PP30ELY4SWP5H3QLHLKP/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861377757-LRUHALK1IIE7TBL3MEC3/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861378650-YLV6FBPAG6RG978CZPFU/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861379404-4QFVLIJ6E9311GOAEYKB/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861380081-P4M2M3RHGDVML905A91E/image-asset.jpeg
https://images.squarespace-cdn.com/content/v1/659566aa46154a29b6c7b387/1722861380850-PU1ONQM6W3RKRUBY8ETX/image-asset.jpeg
```

`curl` these on Day 1 in Claude Code. Replace as real packshots arrive from Mumbai.

### Brand Copy — English (use directly or lightly adapt)

**Homepage / sustainability statement:**
> At Bjerrehuus Fine Jewellery, we design each of our collections with the intention of creating timeless pieces that can be cherished and passed down through generations. Our commitment to minimal waste and a minimal carbon footprint is at the heart of everything we create.

**Meet Vibe (full About page copy, ready to use):**
> Vibe Bjerrehuus has been immersed in the world of fashion and design production since 2003, working with her own brand and assisting others in bringing their visions to life from all corners of the globe.
>
> In 2010, she took a significant step by co-founding a small jewelry factory in Mumbai, India, with her Indian business partner — a place that has become her second home.
>
> Throughout her career, Vibe has collaborated with various high-end jewelry brands, honing her skills and deepening her understanding of the industry. Now, she is focusing solely on what has always been her greatest passion: jewelry. This shift aligns perfectly with her current mindset, as she embraces the opportunity to create meaningful pieces for those who wear them and to be involved in every step of the process.
>
> Working with nature's most precious materials — gold, diamonds, and other fine gemstones — holds a special significance for Vibe. These materials, which have been surrounded by mystique and admiration for centuries, are at the heart of her creations.
>
> Vibe is committed to producing jewelry with thoughtful consideration for the materials used, the planet, and everyone involved in the value chain. This dedication to craftsmanship and sustainability reflects the depth and passion that resonate with where she is in her life today.
>
> Her work is not just about creating beautiful jewelry, but about forging connections and stories that will endure for generations.

**Brand-voice tagline candidates (extract):**
- "Timeless pieces. Cherished. Passed down."
- "Hand made and made for you especially."
- "Forging connections and stories that will endure for generations."
- "Working with nature's most precious materials."

### Pillow Inspiration Collection — Real Product Seed Data

Pulled from IG captions. Use as live products at launch under `/pages/pillow`.

| Product Handle | Name (DK) | Material | Diamonds | Price (DKK) | Variants |
|---|---|---|---|---|---|
| `pillow-boomrang-earring` | Pillow Boomrang ørering (single) | 18K hvidguld | 0.80 TW/VVS-VS | 16,200 | hvidguld / guld / rosaguld; venstre / højre |
| `pillow-studs` | Pillow studs | 18K hvidguld | 0.68 TW/VVS-VS | 14,200 | hvidguld / guld / rosaguld |
| `pillow-bracelet-small` | Pillow bracelet small | 18K hvidguld | 2.02 CT TW/VVS-VS | 41,100 | hvidguld / guld / rosaguld |
| `pillow-13link-earring` | Pillow 13-link pavé ørering | 18K hvidguld | 2.0 CT TW/VVS-VS | 36,600/stk | hvidguld / guld / rosaguld |

Vibe's IG description of the series: *"Linket små pavé puder fuld besat af diamanter. Serien indeholder kæde, armbånd, øreringe, ørestikker og laves også i guld og rosa guld."* (Linked small pavé pillows fully set with diamonds. The series includes necklace, bracelet, earrings, studs, and is also made in gold and rose gold.)

### Other Products (seed data for Classic shop)

| Name (DK) | Material | Spec | Price (DKK) | Category |
|---|---|---|---|---|
| Ovale hoops 18mm | 14K guld | 0.52 ct TW/VS | 10,600 | classic-hoops |
| Halskæde 40cm | 14K hvidguld | 915 Nature TW(F)/VS1 | 94,000 | classic-necklaces |
| Open bangle (1-line / 2-lines) | 18K guld | TW/VVS-VS | TBD | classic |
| Classic 5-stone ring | 18K guld | 5×0.40 = 2.0 CT TW/VS | 65,000 | classic |
| Armbånd | 18K hvidguld | 0.86 CT TW/VVS-VS | 32,600 | classic |
| Statement armbånd 588 stones | 18K hvidguld | 8.24 CT TW/VVS-VS | 130,300 | classic |
| Collier 3-stone | 18K guld | 5.7 CT TW/VVS-VS | 94,500 | classic-necklaces |
| Single stone | TBD | 5.74 CT River/IF | TBD | inspiration |

---

## 7. Build Sequence (Day-by-Day)

### Day 1 — Foundations

- [ ] Fork Dawn into Vibe's Shopify
- [ ] Strip Dawn demo content; reset theme settings
- [ ] Install dev workflow (Shopify CLI, theme dev locally with hot reload)
- [ ] Pull all asset URLs from §6 to local `assets/`
- [ ] Vectorize logo or save high-res transparent PNG
- [ ] **Generate the style tile** (single static HTML page) — see §8
- [ ] Apply locked tokens to Dawn's `config/settings_data.json` and CSS variable layer
- [ ] Set up Markets for the current launch scope
- [ ] Danish/Translate & Adapt is post-launch unless Patrick reopens scope

**End of Day 1:** Style tile ready for Vibe; foundations laid.

### Day 2 — Header, footer, layout, policy pages

- [ ] `header.liquid` section with: logo, nav (SHOP / UNIVERSE / BOOK APPOINTMENT), search icon, wishlist heart placeholder (no function), cart drawer trigger, EN/DK toggle stub
- [ ] UNIVERSE dropdown: links to Meet Vibe + Universe index
- [ ] BOOK APPOINTMENT styled but disabled (cursor: not-allowed; tooltip "Coming soon")
- [ ] `footer.liquid` section with 3-column structure from §4
- [ ] `theme.liquid` layout: typography, container, base resets
- [ ] Create all policy + customer-care pages with placeholder copy (see §4)
- [ ] Newsletter signup form in footer (Shopify-native; Klaviyo removed from launch scope)
- [ ] Social icon row: Instagram, Facebook, LinkedIn (LinkedIn → confirm with Vibe; placeholder for now)

### Day 3 — Product page + product data model

- [ ] Define product metafields in Shopify admin:
    - `purchase_type` — single line, choices: `shoppable`, `inquire` (default `shoppable`)
    - `inspiration_collection` — single line text (e.g., `pillow`)
    - `is_bridal` — boolean
    - `wedding_inquire_eligible` — boolean
- [ ] `product.json` template using sections:
    - `product-gallery.liquid` — main image, thumbnails, supports 360° video slot (use `<video>` tag with looping MP4 for now; akva-style)
    - `product-info.liquid` — name, material, diamond spec, price, variant selector (gold color × size)
    - `product-cta.liquid` — branches on `purchase_type`:
        - `shoppable` → Add-to-Cart button + quantity selector
        - `inquire` → Inquire button (triggers `inquire-letter-modal`)
    - `product-description.liquid` — long-form copy, care, materials
    - `product-related.liquid` — related products via `inspiration_collection` metafield or collection
- [ ] Build `inquire-letter-modal.liquid` snippet (reusable component, see §9)
- [ ] Upload 3–5 placeholder products to validate both states
- [ ] Hover image-swap on product cards: 200ms cross-fade between first and second product image

### Day 4 — Shop landing + collections

- [ ] `collection.json` template with sidebar layout
- [ ] `shop-sidebar.liquid` section: Inspiration / Bridal / Classic with sub-cats (tennis, necklaces, hoops, alliancering, studs)
- [ ] `shop-campaign-tiles.liquid` section: 3 inspiration campaign tiles ("THE X / Y / Z" placeholder labels) at top of `/collections/all`
- [ ] `product-grid.liquid` — 3-up desktop, 2-up tablet, 1-up mobile
- [ ] Create all collections in Shopify admin per §4
- [ ] Seed Pillow products from §6 product table
- [ ] Auto-tag rules: products with `inspiration_collection: pillow` → Pillow collection

### Day 5 — Inspiration pages + Universe template + About

- [ ] `page.inspiration.json` template using sections:
    - `inspiration-hero-collage.liquid` — large hero image with multi-element overlays
    - `inspiration-product-cutout.liquid` — cutout product image with INQUIRE button under it
    - `inspiration-mood-board.liquid` — editorial mood board section, **one element extends beyond viewport horizontal edge** (overflow-x: visible on parent; element positioned with negative margin or transform)
    - `inspiration-product-grid.liquid` — grid of products with INQUIRE buttons (no Add-to-Cart)
    - `wedding-inquire-cta.liquid` — bottom CTA, only renders if `wedding_inquire_eligible` metafield set on at least one page product
- [ ] Instantiate 3 pages: `/pages/pillow` (full content), `/pages/inspiration-2`, `/pages/inspiration-3` (scaffolds with TBD copy)
- [ ] `page.universe-story.json` template using sections:
    - `universe-story-hero.liquid` — image + headline + body text
    - `universe-story-video.liquid` — embedded video block
    - `universe-story-favorites.liquid` — "My Favorites" — pulls 3 products from page metafield
    - `universe-story-next-wish.liquid` — "My Next Wish" — pulls 1 product + free-text note
- [ ] `page.about.json` template for Meet Vibe (separate, evergreen)
- [ ] Create About page, populate with full Meet Vibe copy from §6
- [ ] `page.universe-index.json` — chronological list of stories
- [ ] Instantiate 1 placeholder Universe story to validate the template

### Day 6 — Homepage + cart + payments + integrations

- [ ] `index.json` homepage sections:
    - `hero-video.liquid` — full-bleed or inset toggle (Vibe drew both options)
    - `feature-images-pair.liquid` — 2 large images side-by-side with text below
    - `text-divider.liquid` — text break section
    - `discover-tiles.liquid` — 3 "Discover" tiles linking to inspiration pages
- [ ] Cart drawer + `cart.json` page:
    - Delivery-only cart flow
    - Order notes field
- [ ] Payment methods enabled in Shopify Payments admin:
    - Visa, Mastercard, Apple Pay, Google Pay, Shop Pay (all included with Shopify Payments)
    - **MobilePay** — install via Shopify (Denmark gateway, one-time setup)
- [ ] Shipping zones:
    - Denmark — free shipping
    - International — 299 DKK
- [ ] e-conomic removed from launch scope
- [ ] Branded transactional email templates (order confirmation, shipping confirmation) — apply Bjerrehuus typography + logo + footer
- [ ] Install **Shopify Forms** for the Inquire form submissions once client email/account verification allows it; until then the `/contact` modal is the launch fallback

### Day 7 — QA, polish, handoff

- [ ] Cross-browser test: Chrome, Safari, Firefox, mobile Safari, mobile Chrome
- [ ] Mobile responsive audit on all templates
- [ ] Accessibility check: keyboard nav, focus states, alt text, color contrast (WCAG AA)
- [ ] Test order end-to-end with each payment method
- [ ] Test Inquire submission end-to-end (form submits, email received at client@)
- [ ] Verify 404, search, password-protect, account pages styled correctly
- [ ] Verify all policy pages have placeholder content (real legal copy comes from Vibe later)
- [ ] Loom walkthrough for Vibe: how to add a product, add a Universe story, change a homepage section, view orders, view inquiries
- [ ] Hand off Shopify admin access; confirm she's the store owner

---

## 8. Style Tile Spec (Day 1 deliverable)

Single static HTML file rendered locally, screenshotted for Vibe. Contents:

```
1. Logo at three sizes (header ~140px tall, footer ~80px, hero ~280px)
2. Display serif at H1, H2, H3 with sample headlines:
   - H1: "Timeless pieces. Cherished. Passed down."
   - H2: "Discover the Pillow Collection"
   - H3: "Pillow Boomrang earring"
3. Body sans at paragraph (17px / 1.7 line height) with the Meet Vibe opening paragraph
4. Color swatches: bg, bg-alt, text, text-mut, accent, accent-alt (forest), border
5. One sample product card:
   - Image (400px square, no shadow, no rounding)
   - Product name in body sans
   - Price in slightly larger body sans
   - Subtle hover state: image-swap to 2nd image (200ms cross-fade)
6. One sample Inspiration headline + 2-paragraph editorial body block
7. Buttons in three states (default, hover, disabled):
   - Primary: "Add to Bag" (filled accent)
   - Secondary: "Inquire" (outlined)
   - Tertiary: "Read more →" (text-only with arrow)
8. Inquire letter pop-up mock (static, see §9)
9. Footer preview (3-column compact)
```

Run by Vibe before any template work begins.

---

## 9. Inquire Letter Component (Reusable)

The single most distinctive UX element on the site. Designed once, reused for wishlist phase 2.

### Trigger

- Inquire button on any product card (Inspiration / Bridal / `purchase_type: inquire`)
- Inquire button on product detail page
- "Wedding Inquire" CTA on Inspiration pages

### Visual

A modal that opens with an envelope/letter aesthetic:
- Subtle paper texture on the modal background (CSS gradient or PNG overlay at 5% opacity)
- Logo at top center
- Soft shadow, no aggressive border
- Dim/blur the page behind it
- Open animation: 400ms ease, scale from 0.96 → 1, opacity 0 → 1

### Form Fields

```
┌──────────────────────────────────────────┐
│              [Logo small]                │
│                                          │
│           Inquire about this piece       │
│  ─────────────────────────────────────   │
│                                          │
│   [thumbnail]  Pillow Boomrang ørering   │
│                18K hvidguld              │
│                Pris: 16.200 kr           │
│                                          │
│   Your name:        [____________]       │
│   Your email:       [____________]       │
│   Your message:     [____________]       │
│                     [____________]       │
│                     [____________]       │
│                                          │
│              [ Send inquiry ]            │
│                                          │
│   We'll respond within 24 hours.         │
└──────────────────────────────────────────┘
```

### Submission

- Uses Shopify Forms (or a custom form posting to `/contact#contact_form` with hidden product context)
- Hidden fields auto-populated: product handle, product name, product URL, page URL, language
- On submit: success state inside modal ("Your inquiry is on its way") + close after 3s
- Server-side: routes to vibe@stylesnob.com with product context in subject line: `[BFJ Inquiry] Pillow Boomrang ørering`

### Reuse for Wishlist (Phase 2)

Same modal shell. Different payload:
- Multiple product thumbnails (the wishlist items)
- Extra fields per item: size, gold color, free-text note
- Recipient email field instead of "your email"
- Sender's email + message
- Subject from sender: "Min ønskeseddel"
- Email rendered with same letter aesthetic for the recipient

---

## 10. Wishlist Heart Icon at Launch

Visual only. No backend.

- Heart icon in header between search and cart
- Heart icon on each product card (top-right corner, on hover)
- Click = nothing yet, OR a small toast: "Wishlist coming soon"
- Reserved space and styled state so phase 2 functionality slots in without re-layout

---

## 11. Phase 2 Scope (Post-Launch)

Active source of truth: `docs/current/POST-LAUNCH-ACTION-STEPS.md`.

Current phase-two themes: functional wishlist, active Book Appointment, international markets, Klarna/pay-by-invoice, Universe story expansion, and e-conomic sync via Storebuddy.

Note: replacing placeholder/current product images with client-delivered real assets is part of launch/client asset readiness, not a phase-two feature.

---

## 12. Apps to Install (Week 1)

| App | Purpose | Cost |
|---|---|---|
| Shopify Markets | Current market/currency setup | Free / built-in |
| Shopify Forms | Inquire form routing once email/account verification is complete | Free |

---

## 13. Open Items (Non-Blocking)

These get resolved as the build progresses or in a quick check-in with Vibe:

1. **Supply chain contact name**: Sachin (per call) vs. Madhur (per packshot brief). One person two names, or two people?
2. **Inspiration collection 2 + 3 names**: Pillow is locked. Other 2 TBD when Vibe has campaigns ready.
3. **Universe story names**: Meet Vibe locked. Event stories (Launch of Power, Bezel, Bugatti Race) come as content.
4. **LinkedIn handle**: footer placeholder; confirm Vibe has one or remove.
5. **Color choice burgundy vs deep forest**: validated in style tile review.
6. **Logo source file**: ideally vector — pull existing PNG, vectorize for build, request original from Vibe later if needed.
7. **Real shipping rates and free-shipping threshold**: Vibe to confirm before payment goes live.
8. **Real legal copy** for Privacy Policy, Terms of Service, Shipping & Returns, Diamonds: Nature & Lab, Production & Responsibility — placeholder copy on launch, real copy from Vibe before public launch.

---

## 14. Reference Links

### Look & feel
- Sophie Bille Brahe: https://sophiebillebrahe.com
- Aqva Jewellery: https://akvajewellery.com
- Aqva 360° video example: https://akvajewellery.com/da/shop/consilium-da/ora-open-ring/
- Fie Isolde: https://fieisolde.com/en-dk
- Notkin (Milano series specifically): https://notkin.com

### Anti-references (avoid)
- Lemele
- Lesoonar
- Christian von Arenstorff
- Pandora

### Project artifacts
- Existing Squarespace site: https://www.bjerrehuusfinejewellery.com
- Vibe's Instagram: https://www.instagram.com/bjerrehuusfinejewellery/
- Call recording (Vibe × Patrick, May 1): https://fathom.video/share/g8TTa8bsxa2xj66fbPNxb8qAy-2Vz8km
- Original Shopify theme candidates Vibe browsed (not used, retained for reference):
    - Prestige (Strass preset)
    - Honey (Maravella preset)

### Build references
- Shopify Dawn: https://github.com/Shopify/dawn
- Shopify Online Store 2.0 docs: https://shopify.dev/docs/themes/architecture
- Liquid reference: https://shopify.dev/docs/api/liquid

---

*End of build plan. Drop into Claude Code as `PROJECT_BRIEF.md` at project root.*
