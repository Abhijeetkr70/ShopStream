# ShopStream — Google Stitch UI/UX Deep-Dive Prompt

> **Project Name:** ShopStream
> **Tagline:** "Stream shopping, the Swiggy way."
> **Inspiration:** Swiggy's consumer-facing landing experience (location-first, category strip, product cards, deals).
> **Generated via:** [Google Stitch](https://stitch.withgoogle.com/) → MCP (opencode / Antigravity).
> **Reproducibility:** Paste this entire file into Stitch's prompt box → click **Generate** → copy the `projectId` from the URL bar → paste the MCP config from your Stitch profile back into this file under "Generated Config" below.

---

## 1. Project Brief

**ShopStream** is a full-stack e-commerce web app with a mobile-first, app-like landing experience modeled on Swiggy. Visitors should feel that they are scrolling through a hyper-local shopping mall: tap a category, browse a tight product grid, drop items into a slide-in cart, and check out with one tap.

The landing page is the entire marketing surface. It must look polished on a 360 px Android, scale gracefully to 1440 px desktop, and feel native on iOS Safari (PWA-installable).

### 1.1 Target Persona

| Attribute | Value |
|---|---|
| Name | Anika, 28, urban professional |
| Device | Mid-range Android, 4G, Chrome 119 |
| Goal | Quick discovery of deals in Fashion, Electronics, Grocery, Beauty, Home, Books |
| Pain | Slow, generic e-commerce sites with weak mobile UX |
| Expectation | App-like snappiness, instant search, one-tap checkout |

### 1.2 Success Criteria

- LCP ≤ 2.5 s on mobile 4G
- CLS ≤ 0.1
- INP ≤ 200 ms
- Lighthouse mobile ≥ 90 in all four categories (Performance, A11y, Best Practices, SEO)
- Installable as a PWA (Android + iOS)
- WCAG 2.2 AA contrast on every interactive element

---

## 2. Brand Tokens

```jsonc
{
  "color": {
    "brand":      { "primary": "#FF5200", "primaryDark": "#E64A00", "primarySoft": "#FFE6DA" },
    "accent":     { "deal": "#16A34A", "warning": "#F59E0B", "info": "#2563EB", "danger": "#DC2626" },
    "surface":    { "bg": "#FFFFFF", "bgMuted": "#F7F7F7", "bgElevated": "#FFFFFF", "bgDark": "#0F172A" },
    "text":       { "primary": "#0F172A", "secondary": "#475569", "muted": "#94A3B8", "onBrand": "#FFFFFF" },
    "border":     { "subtle": "#E5E7EB", "strong": "#CBD5E1" }
  },
  "radius":  { "xs": "4px", "sm": "8px", "md": "12px", "lg": "20px", "pill": "9999px" },
  "shadow":  {
    "xs": "0 1px 2px rgba(15,23,42,0.06)",
    "sm": "0 2px 8px rgba(15,23,42,0.08)",
    "md": "0 8px 24px rgba(15,23,42,0.10)",
    "lg": "0 20px 48px rgba(15,23,42,0.14)"
  },
  "space":   [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
  "z":       { "base": 1, "dropdown": 50, "sticky": 100, "drawer": 200, "modal": 300, "toast": 400 }
}
```

### 2.1 Typography

| Role | Family | Weight | Size | Line height |
|---|---|---|---|---|
| Display | Manrope | 800 | 48 / 40 / 32 | 1.1 |
| H1 | Manrope | 700 | 32 | 1.2 |
| H2 | Manrope | 700 | 24 | 1.25 |
| H3 | Manrope | 600 | 20 | 1.3 |
| Body | Inter | 400 | 16 | 1.55 |
| Body-sm | Inter | 400 | 14 | 1.5 |
| Caption | Inter | 500 | 12 | 1.4 |
| Mono (prices) | JetBrains Mono | 600 | 14 | 1.4 |

Self-host via `next/font` (Inter + Manrope subset to Latin + Latin-Ext).

### 2.2 Iconography

- Stroke icons: **Lucide** (24 px default, 1.75 stroke).
- Filled category glyphs: custom 48 px rounded squares, orange-tinted background.
- All icons shipped as React components (tree-shakeable), no inline SVGs.

---

## 3. Grid & Breakpoints

| Breakpoint | Min width | Container | Columns | Gutter |
|---|---|---|---|---|
| `xs` | 0 | 100% | 4 | 12 px |
| `sm` | 640 | 100% | 8 | 16 px |
| `md` | 768 | 720 | 12 | 20 px |
| `lg` | 1024 | 960 | 12 | 24 px |
| `xl` | 1280 | 1180 | 12 | 24 px |
| `2xl` | 1536 | 1320 | 12 | 32 px |

Base unit: **8 px**. All paddings/margins snap to {4, 8, 12, 16, 20, 24, 32, 40, 48, 64}.

---

## 4. Page Inventory

| # | Route | Purpose |
|---|---|---|
| 1 | `/` | Landing (Swiggy-style) — primary deliverable |
| 2 | `/category/[slug]` | Category listing with filters |
| 3 | `/product/[slug]` | Product detail with gallery, attributes, reviews |
| 4 | `/search?q=` | Full-text search results |
| 5 | `/cart` | Cart review (also as slide-in drawer on all pages) |
| 6 | `/checkout` | Address → payment (Razorpay) → review |
| 7 | `/orders` | Order history |
| 8 | `/orders/[id]/track` | Live tracking (Leaflet map + Socket.io) |
| 9 | `/account` | Profile, addresses, wallet, security |
| 10 | `/wishlist` | Saved items |
| 11 | `/about` | E-E-A-T author + company bio |
| 12 | `/author/[handle]` | Consistent author identity page |
| 13 | `/offline` | PWA fallback |

---

## 5. Landing Page — Section-by-Section Spec (Swiggy-style)

### 5.1 `TopBar` (sticky, 64 px, backdrop-blur on scroll)

```
[≡] [📍 Bengaluru, Karnataka ▾] ............ [🔍 Search] ............ [♡] [🛒 2] [Sign in]
```

- Left: hamburger (mobile) / logo (desktop).
- Center-left: location pill — click → opens `LocationPicker` (Leaflet mini-map modal).
- Center: search bar (autocomplete, debounce 250 ms).
- Right: wishlist heart, cart with badge, account avatar / Sign in.
- On scroll > 8 px: backdrop blur `12 px`, border-bottom `1 px #E5E7EB`.
- Mobile (< 768): collapses search into a separate `Hero` section; keeps logo + cart.

### 5.2 `Hero` (full-width, 480 px desktop / 360 px mobile)

```
                  Stream shopping,
                  the Swiggy way.

       [🔍 Search "shoes", "milk", "iPhone"...]
       [📍 Deliver to: Bengaluru 560001]

       [Shop Fashion]  [Browse Deals]   (ghost + primary CTA)
```

- Background: gradient `linear-gradient(135deg, #FF5200 0%, #FF7A3D 60%, #FFB07A 100%)` with subtle radial blob.
- Headline: Manrope 800, 48 / 32 responsive.
- Search field: pill, white, shadow-md, 56 px tall.
- Two CTAs: primary `Shop Fashion` (white bg, brand text), secondary `Browse Deals` (ghost).

### 5.3 `CategoryStrip` (horizontal scroll-snap, 96 px tall cards)

Six rounded squares with icon + label, snap each 96 px, hide scrollbar.

- Fashion, Electronics, Grocery, Beauty, Home, Books.
- Icon: 32 px, brand-soft background `rgba(255,82,0,0.08)`.
- Label: 12 px, weight 600, centered.
- On hover: lift `translateY(-2px)` + shadow-sm.
- Edge chevrons at `:hover`.

### 5.4 `ProductCarousel` — "Top picks for you"

- Section header: `H2` left + `See all` link right.
- Horizontal scroll-snap, 220 px wide card on mobile, 240 px on desktop.
- Card spec (`ProductCard`):
  - 1:1 image (Next/Image, lazy), `radius-md`, `shadow-xs`.
  - Wishlist heart (top-right, absolute).
  - Title: 14 px, 2-line clamp.
  - Brand caption: 12 px muted.
  - Price: ₹1,299 (mono) + ₹1,599 strike-through muted.
  - Discount badge: `28% OFF` (green pill).
  - Rating: ★ 4.3 (1k).
  - CTA: full-width `ADD` button (brand) → on add, transforms into `+ −` stepper.
  - Hover (desktop): image scale `1.03`, shadow-md.

### 5.5 `BannerStrip` (auto-rotating, 5 s pause on hover)

- 16:5 ratio, rounded `lg`, two banners visible side-by-side on desktop, stacked on mobile.
- Dots pagination bottom-center.

### 5.6 `DealCountdown` — "Deals of the day"

- Header: `H2 "Deals of the day"` + countdown chip `Ends in 04:23:11` (mono).
- 2-col mobile / 4-col desktop grid of `DealCard` (same as `ProductCard` with a corner ribbon "DEAL").
- Timer auto-ticks every second.

### 5.7 `Footer` (dark surface `#0F172A`, text `#F7F7F7`)

- 4 columns on desktop, accordion on mobile.
- Columns: Shop, Help, Company, Legal.
- Bottom: payment icons (Razorpay/Visa/MC/UPI), socials, © + author link to `/author/[handle]`.

---

## 6. Component Inventory (packages/ui)

```
packages/ui/src/
├── primitives/
│   ├── Button.tsx            // variants: primary | secondary | ghost | danger | icon
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Switch.tsx
│   ├── Badge.tsx
│   ├── Chip.tsx
│   ├── Skeleton.tsx
│   ├── Spinner.tsx
│   └── Kbd.tsx
├── layout/
│   ├── Container.tsx
│   ├── Stack.tsx
│   ├── Grid.tsx
│   └── Divider.tsx
├── overlay/
│   ├── Drawer.tsx            // right slide-in
│   ├── Modal.tsx             // focus-trapped
│   ├── Popover.tsx
│   ├── Toast.tsx
│   └── Tooltip.tsx
├── nav/
│   ├── TopBar.tsx
│   ├── BottomNav.tsx         // PWA-installed
│   └── Breadcrumbs.tsx
├── product/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductGallery.tsx    // keyboard + swipe
│   ├── ProductAttributes.tsx
│   ├── ProductReviews.tsx
│   └── AddToCart.tsx
├── category/
│   ├── CategoryStrip.tsx
│   └── CategoryCard.tsx
├── deal/
│   ├── DealCountdown.tsx
│   └── DealCard.tsx
├── hero/
│   └── Hero.tsx
├── cart/
│   ├── CartDrawer.tsx
│   ├── CartLine.tsx
│   └── CartSummary.tsx
├── checkout/
│   ├── Stepper.tsx
│   ├── AddressForm.tsx
│   ├── PaymentSelector.tsx   // Razorpay
│   └── OrderReview.tsx
├── auth/
│   ├── AuthModal.tsx         // Clerk mounted
│   └── UserMenu.tsx
├── feedback/
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   └── BannerStrip.tsx
└── chat/
    └── AIChatBubble.tsx      // Groq-powered
```

---

## 7. States & Micro-interactions

| Surface | Hover | Active | Loading | Disabled |
|---|---|---|---|---|
| Button | bg darken 8% | scale 0.98 | spinner replaces label | opacity 0.5, no pointer |
| ProductCard | lift -2px, shadow-md | scale 0.99 | skeleton shimmer | opacity 0.4 |
| Drawer | — | — | slide 240 ms cubic(.2,.8,.2,1) | — |
| Toast | — | — | slide-in 200 ms, auto-dismiss 4 s | — |
| Skeleton | shimmer 1.4 s linear infinite | — | — | — |
| Route transition | opacity + 8 px up, 180 ms | — | — | — |

Reduce-motion: all transforms collapse to 0 ms, opacity only.

---

## 8. Accessibility Checklist

- All images have meaningful `alt` or empty alt for decoration.
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI.
- Visible focus ring `2 px #2563EB` offset 2 px.
- Modals: focus-trap, ESC closes, restore focus.
- Skip link "Skip to content" first in tab order.
- Form fields: associated `<label>`, error announced via `aria-live="polite"`.
- Landmarks: `<header> <nav> <main> <aside> <footer>`.
- Touch targets ≥ 44 × 44 px.

---

## 9. Performance Budget

- First-load JS ≤ 180 KB gz (route-level).
- LCP image: preloaded, AVIF + WebP fallback.
- Fonts: 2 families, 4 weights, subset.
- Third-party: lazy-load Chat widget, Razorpay, Maps.
- Cache: ISR for `/`, `/category/[slug]`, `/product/[slug]` (revalidate 60 s).
- Upstash Redis for category lists + product detail (TTL 300 s).

---

## 10. Generated Config (fill after Stitch run)

```
stitch_project_id:  <paste from URL bar after Generate>
stitch_mcp_config:  <paste from Stitch profile → MCP → opencode/Antigravity>
generated_on:       YYYY-MM-DD
```

### 10.1 MCP wiring (opencode example)

```jsonc
// .opencode/mcp.json or equivalent agent config
{
  "mcpServers": {
    "stitch": {
      "command": "<from-stitch-profile>",
      "args": ["<from-stitch-profile>"],
      "env": { "STITCH_PROJECT_ID": "<paste here>" }
    }
  }
}
```

After the agent generates UI, copy the output into `packages/ui/src/` and `apps/web/app/` and confirm parity with the section specs above.

---

## 11. Acceptance Checklist

- [ ] All sections in §5 render at 360 / 768 / 1024 / 1440.
- [ ] All components in §6 implemented.
- [ ] All states in §7 implemented.
- [ ] A11y checks in §8 pass axe-core.
- [ ] Performance budget in §9 holds.
- [ ] PWA manifest + icons shipped.
- [ ] JSON-LD on landing: Organization, WebSite, FAQPage, BreadcrumbList.
