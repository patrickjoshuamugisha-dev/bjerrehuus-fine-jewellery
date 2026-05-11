# Demo-Ready Sprint — Bjerrehuus Fine Jewellery
**Goal:** Visually finished, walkable site for client demo today

---

## Context

Patrick needs to walk Vibe through the site today. The build is functionally built but has critical visual bugs and content gaps that would make a client demo embarrassing. This plan closes them in a single sprint.

Vibe's vision (from transcript + email + build plan):
- Sophie Bille Brahe is the reference — editorial, personal, slightly unpolished, not Pandora
- "Hellere rigtigt end hurtigt" — right rather than fast
- Homepage = beautiful business card with hero video
- Inspiration pages = fashion magazine (Notkin Milano series reference)
- Universe = Vibe's personal stories about stones and craft
- Every price inquiry triggers the letter modal — "pris, pris, pris" is what people ask

---

## Gap Analysis

### BUG 1 — CRITICAL: All `bjfj-reveal` content is invisible on every page
`bjerrehuus-tokens.css` lines 89–101: `.bjfj-reveal` starts at `opacity:0; transform:translateY(30px)` and only becomes visible when `.is-visible` is added by JavaScript. No IntersectionObserver exists anywhere in the codebase. Result: hero text, feature pair section, inspiration content, universe content — all invisible on every page. Every page looks empty/broken.

**Fix:** Add a small IntersectionObserver inline script to `layout/theme.liquid` before `</body>`.

### BUG 2 — CRITICAL: Inspiration-2 and Inspiration-3 both show The Pillow
Both pages use `template_suffix: inspiration` → fall back to `page.inspiration.json` defaults → show "THE PILLOW" hero, Pillow Boomrang cutout, Pillow mood board, Pillow product grid. Client clicking around the sidebar sees the same Pillow page three times.

**Fix:** Create `templates/page.inspiration-classic.json` (The Classic) and `templates/page.inspiration-bridal.json` (The Bridal) with distinct content. Reassign pages via API.

### GAP 3 — HIGH: Sidebar nav shows "—" dashes for inspiration-2 and -3
`sections/shop-layout.liquid`: two sidebar links show `&mdash;` as label instead of real names.

**Fix:** Update labels to "Classic" and "Bridal".

### GAP 4 — HIGH: Universe story-1 has 38 chars of content
Client clicking Universe → story sees a beautiful template with no actual text — just placeholder filler. Breaks the editorial illusion.

**Fix:** Update the page via API with real Vibe-voiced placeholder text (her tone from the transcript).

### GAP 5 — MEDIUM: Homepage uses Squarespace CDN images
`templates/index.json` `pair` and `tiles` sections reference Squarespace CDN URLs. These work but are slow. We have proven Shopify CDN product image URLs.

**Fix:** Replace with Shopify CDN images already known to work.

---

## What Is Working (do not touch)

| Item | Status |
|---|---|
| Product handles in all templates | ✓ all match (`pillow-boomrang-earring`, `pillow-studs`, etc.) |
| `/pages/meet-vibe` uses `page.about.json` template | ✓ template_suffix=about |
| `/pages/pillow` inspiration page | ✓ full content |
| Shop grid + campaign tiles + sidebar | ✓ |
| Inquire modal on cards + product pages | ✓ |
| All policy pages | ✓ just populated |
| Classic + Bridal products in collections | ✓ |
| Header: Book Appointment disabled state | ✓ |
| Focus trap, ARIA, accessibility | ✓ |

---

## Execution Plan

### Fix 1 — IntersectionObserver for `bjfj-reveal`

**File:** `layout/theme.liquid` — add before `</body>`

```html
<script>
(function(){
  function revealAll(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.bjfj-reveal').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight){ el.classList.add('is-visible'); }
      else { io.observe(el); }
    });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', revealAll); }
  else { revealAll(); }
})();
</script>
```

This also immediately reveals elements already in the viewport on load (hero content), then uses IntersectionObserver for the rest.

### Fix 2 — `page.inspiration-classic.json`

**New file:** `templates/page.inspiration-classic.json`

Sections (same structure as `page.inspiration.json`):
- **hero-collage:** label "THE CLASSIC", headline "Timeless shapes. Set in gold, worn every day.", body about the Classic line, image = `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/IMG_8653.webp?v=1778094232`
- **cutout:** product `classic-solitaire-hoops`, fallback image, subtext about daily-wear hoops
- **mood-board:** 3 images from Shopify CDN + pullquote "Every day. For ever."
- **product-grid:** collection = `classic`, heading = "The Collection"
- No wedding CTA

### Fix 3 — `page.inspiration-bridal.json`

**New file:** `templates/page.inspiration-bridal.json`

Sections:
- **hero-collage:** label "THE BRIDAL", headline "For the day that changes everything.", image = `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/love.webp?v=1778094232`
- **cutout:** product `bridal-solitaire-ring`, subtext about the solitaire
- **mood-board:** 3 images + pullquote "Made for moments that last a lifetime."
- **product-grid:** collection = `bridal`, heading = "The Collection"
- **wedding-cta:** force_show: true

Then via Shopify API:
- Set `inspiration-2` page `template_suffix` → `"inspiration-classic"`
- Set `inspiration-3` page `template_suffix` → `"inspiration-bridal"`

### Fix 4 — Sidebar nav labels

**File:** `sections/shop-layout.liquid`

Lines 22–30: change `&mdash;` links:
- inspiration-2 → label "Classic" (also update `request.path contains` check)
- inspiration-3 → label "Bridal"

### Fix 5 — Universe story-1 page content

Via Shopify API, update `universe-story-1` page:
- **title:** "On gold, diamonds, and why I make jewellery"
- **body_html:** 4 paragraphs in Vibe's voice — personal, grounded, warm. Reference the Mumbai factory, making pieces for everyday wear, the love of natural materials. Not corporate. Tone from transcript: "smykkerne er dyre, men det er tilgængeligt for alle" and "hellere rigtigt end hurtigt".

### Fix 6 — Homepage image URLs

**File:** `templates/index.json`

Replace Squarespace CDN URLs:
- `hero.fallback_image_url` → `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/5691.webp?v=1778094230`
- `pair.image_1_url` → `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/IMG_8654.webp?v=1778094209`
- `pair.image_2_url` → `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/IMG_8655.webp?v=1778094209`
- `tiles.tile_1.image_url` → `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/5691.webp?v=1778094230`
- `tiles.tile_2.image_url` → `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/love.webp?v=1778094232`
- `tiles.tile_3.image_url` → `https://cdn.shopify.com/s/files/1/1032/3004/6542/files/IMG_8653.webp?v=1778094232`

---

## Files Modified

| File | Change |
|---|---|
| `layout/theme.liquid` | Fix 1 — IntersectionObserver script |
| `templates/page.inspiration-classic.json` | Fix 2 — new file |
| `templates/page.inspiration-bridal.json` | Fix 3 — new file |
| `sections/shop-layout.liquid` | Fix 4 — sidebar labels |
| `templates/index.json` | Fix 6 — homepage images |
| API: `universe-story-1` page body | Fix 5 — story content |
| API: `inspiration-2` page template_suffix | Fix 3 — reassign |
| API: `inspiration-3` page template_suffix | Fix 2 — reassign |

---

## Single Push at End

```
cd bjerrehuus-theme && shopify theme push --store bjerrehuus-fine-jewelry.myshopify.com --theme 196302537038
```

---

## Demo Walkthrough Verification

After push, visually confirm (no client-facing actions, no form submissions):

1. `/` — hero content visible, pair section shows Shopify images, tiles have images + scroll reveals work
2. `/collections/all` — campaign tiles "THE PILLOW / THE BRIDAL / THE CLASSIC", sidebar reads "Pillow / Classic / Bridal"
3. Click a Pillow product → Inquire button → modal opens with letter aesthetic
4. Click a Classic product → Add to Bag button
5. `/pages/pillow` → full editorial: hero, product cutout shows Boomrang ørering, mood board, product grid
6. `/pages/inspiration-2` → "THE CLASSIC" hero, Classic hoops cutout, Classic product grid
7. `/pages/inspiration-3` → "THE BRIDAL" hero, bridal ring cutout, Bridal product grid
8. `/pages/meet-vibe` → portrait + full bio renders
9. `/pages/universe` → index with one story card
10. `/pages/universe-story-1` → Vibe's story text renders with hero image
11. Scroll any page → content fades in as it enters viewport
