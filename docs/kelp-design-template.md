# Kelp Agency — Design Template

> **Source:** Extracted from `https://www.kelp.agency/` on 2026-08-03 via `agent-browser` (Playwright headless browser). All design tokens below are measured directly from the rendered page using `getComputedStyle()` — they are not inferred from screenshots.
>
> **Purpose:** Single source of truth for the visual design language of the kelp.agency clone. Every color, font, spacing value, and layout decision in the clone must trace back to this document.
>
> **Verification:** A full-page screenshot is saved at `/home/z/my-project/scripts/kelp-home-full.png` for visual reference.

---

## 1. Brand & Positioning

**Brand name:** Kelp Creative Agency
**Tagline (H1):** "Central Florida's Award Winning Creative Agency."
**Positioning:** A full-service creative agency (Branding, Websites, Marketing, Media, Ongoing Support) targeting Central Florida businesses. Tone is confident, craft-forward, and human — copy uses phrases like "designed by humans and coded with ❤️".

**Brand voice:**
- Direct, declarative headlines ("Our Work In the real-world", "How We Work", "What Our Clients Say")
- Warm, conversational body copy with serif typography conveying editorial polish
- Italic Newsreader for emphasis (editorial magazine feel)
- Lowercase casual labels in nav ("services", "work", "platforms", "resources")

**Differentiators to clone:**
- 5-step process framework (Discovery → Planning → Production → Market → Ongoing Support)
- Featured client carousel ("Spring Water Spirits", "Deals In Dirt", "Hart's Meat Market", "Elev8 Fun", "Mountaineer Coffee", "Unprofitable")
- Three featured articles in the resources section
- Sticky header with headroom (pinned/unpinned on scroll)

---

## 2. Color System

> All values measured via `getComputedStyle()` on the live site.

### Primary palette

| Role | Hex | RGB | Use |
|------|-----|-----|-----|
| **Ink** (primary text, dark sections) | `#0d1726` | `rgb(13, 23, 38)` | Body text on light bg, background of "Recent Work", "How We Work", footer, CTA buttons |
| **Paper** (default page bg, light sections) | `#ffffff` | `rgb(255, 255, 255)` | Body background, text on dark sections |
| **Black** (pure) | `#000000` | `rgb(0, 0, 0)` | Hero heading text, body text on white |

### Accent palette (agency "kelp/ocean" theme)

| Role | Hex | RGB | Use |
|------|-----|-----|-----|
| **Kelp Green** (primary accent) | `#42c634` | `rgb(66, 198, 52)` | Hover states, active indicators, brand accent |
| **Shallow Teal** | `#c5f5f6` | `rgb(197, 245, 246)` | Soft section backgrounds, card fills |
| **Sea Foam** | `#a1e39a` | `rgb(161, 227, 154)` | Secondary accent fills |
| **Coral** | `#f9a79c` | `rgb(249, 167, 156)` | Tertiary accent, CTA highlights |

### Neutral palette

| Role | Hex | RGB | Use |
|------|-----|-----|-----|
| **Mist** (light gray bg) | `#f4f4f4` | `rgb(244, 244, 244)` | Testimonials section background |
| **Slate** (muted text) | `#757575` | `rgb(117, 117, 117)` | Captions, meta text, secondary info |
| **Indigo** (rare) | `#5544f8` | `rgb(85, 68, 248)` | Single accent instance (link color in some contexts) |

### CSS custom properties (to define in `:root`)

```css
:root {
  /* Primary */
  --color-ink: #0d1726;
  --color-paper: #ffffff;
  --color-black: #000000;

  /* Accents */
  --color-kelp: #42c634;
  --color-teal: #c5f5f6;
  --color-seafoam: #a1e39a;
  --color-coral: #f9a79c;

  /* Neutrals */
  --color-mist: #f4f4f4;
  --color-slate: #757575;
  --color-indigo: #5544f8;

  /* Semantic aliases */
  --color-text: var(--color-black);
  --color-text-dark: var(--color-ink);
  --color-text-muted: var(--color-slate);
  --color-bg: var(--color-paper);
  --color-bg-dark: var(--color-ink);
  --color-bg-muted: var(--color-mist);
  --color-accent: var(--color-kelp);
  --color-link: var(--color-ink);
  --color-link-hover: var(--color-kelp);
}
```

---

## 3. Typography

### Font families

| Role | Family | Source | Weights used |
|------|--------|--------|--------------|
| **Headings** (H1–H4, nav, buttons) | `Poppins` | Google Fonts | 500, 600, 700 |
| **Body / editorial** (paragraphs, captions, italic emphasis) | `Newsreader` | Google Fonts | 300, 400 (regular + italic), 600 |

> **Fallbacks observed on live site:** `"Adjusted Palatino Fallback"` for Newsreader, `"Adjusted Arial Black Fallback"` for Poppins. These are Astro/fontsource-generated metrics-adjusted fallbacks — the clone should use `fontsource` providers in the Astro 6 Fonts API which auto-generate similar fallbacks.

### Type scale (measured at 1280px viewport)

| Element | Font | Size | Weight | Line height | Color | Notes |
|---------|------|------|--------|-------------|-------|-------|
| H1 (hero) | Poppins | 68.2px | 700 | 68.2px (1.0) | `#000` | Tight leading, max ~14 words per line |
| H2 (section titles) | Poppins | 43.7–54.6px | 700 | 1.2× | `#000` or `#fff` | Size varies by section density |
| H2 (oversized statement, e.g. "How We Work") | Poppins | 85.2px | 700 | 93.7px (1.1) | `#fff` | Used for dramatic statements on dark sections |
| H3 (subsection titles) | Poppins | 22.4–43.7px | 600–700 | 1.2× | varies | 22.4px for card titles, 43.7px for service category names |
| H3 (numbered step titles, "1. Discovery") | Poppins | 28.0px | 600 | 36.4px (1.3) | `#fff` | Process steps |
| H4 (article titles) | Poppins | 28.0px | 600 | 36.4px (1.3) | `#000` | Featured articles |
| Body (paragraph) | Newsreader | 17.96px (~18px) | 400 | 32.3px (~1.8) | `#000` | Generous line height for editorial feel |
| Body large (intro statement) | Newsreader | 43.7px | 400 | 61.2px (1.4) | `#fff` | Used for the "Everything we work on follows..." statement |
| Body medium (testimonial quote) | Newsreader | 22.4px | 300 | 33.6px (1.5) | `#000` | Testimonials |
| Body lead (CTA) | Newsreader | 28.0px | 600 | 39.2px (1.4) | `#fff` | "Let's get creative and start making something amazing together!" |
| Caption / footer | Newsreader | 14.4px | 400 | 25.9px (1.8) | `#fff` | Copyright, footer legal |
| Nav link | Poppins | 15px | 600 | normal | `#0d1726` | All nav items, dropdown triggers |
| Button text | Newsreader | 15–18px | 600 | normal | `#fff` | CTA buttons (note: serif button text is unusual — keep this!) |

### Italic usage

Newsreader italic (400) is used for editorial emphasis in body copy. This is a signature kelp.agency touch — replicate it for pull-quotes, mid-sentence emphasis, and testimonial attributions.

### Type scale CSS

```css
:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Newsreader', Georgia, serif;

  /* Type scale (clamp for responsive) */
  --text-h1: clamp(2.5rem, 5.5vw, 4.27rem);     /* 68px @ 1280 */
  --text-h2: clamp(2rem, 3.5vw, 3.42rem);        /* 54.6px */
  --text-h2-display: clamp(2.5rem, 6.5vw, 5.32rem); /* 85.2px */
  --text-h3: clamp(1.25rem, 2vw, 2.73rem);       /* 43.7px */
  --text-h3-card: clamp(1.1rem, 1.5vw, 1.4rem);  /* 22.4px */
  --text-h4: clamp(1.1rem, 1.75vw, 1.75rem);     /* 28px */
  --text-body: 1.125rem;                          /* 18px */
  --text-body-lg: clamp(1.5rem, 2.5vw, 2.73rem); /* 43.7px */
  --text-body-md: 1.4rem;                         /* 22.4px */
  --text-lead: clamp(1.25rem, 2vw, 1.75rem);     /* 28px */
  --text-caption: 0.9rem;                         /* 14.4px */
  --text-nav: 0.9375rem;                          /* 15px */
  --text-button: 1.125rem;                        /* 18px */

  --leading-tight: 1.1;
  --leading-snug: 1.2;
  --leading-normal: 1.4;
  --leading-relaxed: 1.6;
  --leading-loose: 1.8;
}
```

---

## 4. Layout & Spacing

### Page structure (top to bottom)

1. **Header** — sticky, transparent over hero, turns solid on scroll (headroom). Padding `32px 0`. Contains: logo ("Kelp" wordmark), nav (Services, Work, Platforms, Resources dropdowns + About + Contact Us), CTA button "Hire Us".
2. **Hero** (`<section class="hero">`) — min-height 720px, padding `32px 0 0`. Contains H1, subhead, 3 client logo links (Elev8 Fun, Marker 48, Beverlin Hills).
3. **Recent Work** (`<section class="recent-work">`) — dark bg `#0d1726`, padding `144px 0 48px`. Contains H2 "Our Work In the real-world", carousel with Prev/Next buttons, featured case study card.
4. **Services** (`<section class="wrapper services">`) — white bg, padding `96px 0`. H2 "Our Services", 5 category columns: Branding & Design, Websites, Marketing & Strategy, Media, Ongoing Support.
5. **How We Work** (`<section class="how-we-work">`) — dark bg `#0d1726`, padding `96px 0`. Oversized H2 "How We Work", 5 numbered steps.
6. **Testimonials** (`<section class="testimonials">`) — mist bg `#f4f4f4`, padding `128px 0`. H2 "What Our Clients Say", testimonial quotes.
7. **Featured Articles** (`<section class="featured-articles">`) — white bg, padding `0`. H3 "Featured Articles", 3 article cards.
8. **CTA section** — dark bg. H3 "Ready to get started?", lead text, "Schedule a Meeting" button.
9. **Footer** (`<footer class="footer">`) — dark bg `#0d1726`, padding `0 0 64px`. Multi-column: Services, Contact, Work, Platforms, "Follow us on social". Copyright line at bottom.

### Section padding scale

| Token | Value | Use |
|-------|-------|-----|
| `--space-section-y-xl` | `144px` | Recent Work top (heaviest) |
| `--space-section-y-lg` | `128px` | Testimonials |
| `--space-section-y-md` | `96px` | Services, How We Work |
| `--space-section-y-sm` | `48px` | Recent Work bottom |
| `--space-section-y-xs` | `32px` | Hero top |
| `--space-main-top` | `112px` | Main element top (clears sticky header) |

### Content container

```css
.container {
  max-width: 1200px;     /* inferred from typical agency sites */
  margin-inline: auto;
  padding-inline: 24px;
}

@media (min-width: 768px) {
  .container { padding-inline: 40px; }
}
```

### CSS spacing tokens

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-10: 4rem;
  --space-12: 6rem;
  --space-16: 8rem;
  --space-20: 10rem;
  --space-24: 12rem;
}
```

---

## 5. Component Specifications

### Header / Navigation

- **Layout:** Flex, space-between. Left: "Kelp" wordmark (Newsreader 18px). Right: nav menu + CTA button.
- **Sticky behavior:** Uses `headroom.js` — `.headroom--pinned` when scrolling up, `.headroom--unpinned` when scrolling down. Transparent over hero, solid white after scroll.
- **Nav items:** Poppins 15px / 600 weight, color `#0d1726`. Dropdown caret next to "Services", "Work", "Platforms", "Resources".
- **Dropdown:** Multi-column mega menu on hover/click. Service links in 2-3 columns.
- **CTA button "Hire Us":** Newsreader 15px / 600, padding `14px 20px 12.8px`, bg `#0d1726`, color `#fff`, border-radius `0` (square corners — kelp signature).
- **Mobile:** Hamburger menu, full-screen overlay.

### Hero

- **H1:** "Central Florida's Award Winning Creative Agency." — Poppins 68px / 700, line-height 1.0, color `#000`. Max width ~14 words per line.
- **Subhead:** Newsreader 18px / 400 / italic, line-height 1.8. "We're a team of designers, developers, and marketers who love to take great ideas..."
- **Client logos row:** 3 grayscale logo links (Elev8 Fun, Marker 48, Beverlin Hills) below subhead.
- **Background:** White. No image — the type IS the hero.

### Recent Work carousel

- **Section bg:** `#0d1726` (dark ink).
- **H2:** "Our Work In the real-world" — Poppins 43.7px / 700, color `#fff`. Note the lowercase "the" — editorial styling.
- **Carousel:** Single featured case study visible at a time. Prev/Next buttons on the right side.
- **Prev/Next buttons:** Newsreader 18px / 600, bg `#0d1726` (matches section — appears borderless), color `#fff`. Arrow icons "←" and "→".
- **Card content:** H3 case study title (Poppins 22.4px / 600, white), description text (Newsreader), "Read More About [Name]" link.
- **Featured case studies (in order):** Spring Water Spirits, Deals In Dirt, Hart's Meat Market, Elev8 Fun, Mountaineer Coffee, Unprofitable.

### Services section

- **Layout:** 5 columns side-by-side on desktop, stacked on mobile.
- **H2:** "Our Services" — Poppins 54.6px / 700, color `#000`.
- **Category headers (H3):** Poppins 43.7px / 700 — "Branding & Design", "Websites", "Marketing & Strategy", "Media", "Ongoing Support".
- **Service links:** Poppins 15px / 600, color `#0d1726`, hover → kelp green.
- **Service items per category:**
  - **Branding & Design:** Apparel Design, Company Branding, Digital Design, Print Design, Web Design
  - **Websites:** App Development, Web Design, Web Development, Ecommerce
  - **Marketing & Strategy:** Audience Targeting, Campaign Management, Copywriting, Digital Marketing, Social Campaigns & PPC, Social Media Content, Reporting
  - **Media:** Motion Graphics, Photography, Videography
  - **Ongoing Support:** Ongoing Retainers, Web Hosting, Web Support & Maintenance

### How We Work (process)

- **Section bg:** `#0d1726`.
- **H2:** "How We Work" — Poppins 85.2px / 700, color `#fff`. Note: H2 text breaks oddly ("How We" / "Work") — intentional editorial layout.
- **Intro statement:** Newsreader 43.7px / 400, color `#fff`. "Everything we work on follows the same 5 basic steps in order:"
- **Steps (5-column grid):**
  1. Discovery
  2. Planning
  3. Production
  4. Market
  5. Ongoing Support
- **Step title:** Poppins 28px / 600, color `#fff`. Format: "1. Discovery", "2. Planning", etc.
- **Step description:** Newsreader 18px / 400, color `#fff` (with reduced opacity for hierarchy).

### Testimonials

- **Section bg:** `#f4f4f4` (mist).
- **H2:** "What Our Clients Say" — Poppins 54.6px / 700, color `#000`.
- **Quote:** Newsreader 22.4px / 300 (light weight), line-height 1.5, color `#000`.
- **Attribution:** Smaller text, possibly italic Newsreader.

### Featured Articles

- **Section bg:** White.
- **H3:** "Featured Articles" — Poppins 43.7px / 700, color `#000`.
- **Article cards (3-column grid):**
  - H4 title: Poppins 28px / 600, color `#000`. Hover → kelp green or underline.
  - Featured articles:
    1. "Manipulate HubSpot Forms with JavaScript—the Right Way"
    2. "Simple HubDB Pagination"
    3. "Partners VS Pirates: Navigating an Ocean of Digital Agencies"

### CTA section ("Ready to get started?")

- **Section bg:** `#0d1726`.
- **H3:** "Ready to get started?" — Poppins 68.2px / 700, color `#fff`.
- **Lead text:** Newsreader 28px / 600, color `#fff`. "Let's get creative and start making something amazing together!"
- **Button:** "Schedule a Meeting" — Newsreader 18px / 600, padding `16px 20px 12px`, bg `#0d1726`, color `#fff`, border `2px solid transparent`. On hover: invert to white bg / ink text.

### Footer

- **Section bg:** `#0d1726`.
- **Padding:** `0 0 64px`.
- **Layout:** 5 columns (Services, Contact, Work, Platforms, Follow us on social).
- **Column headers (H3):** Poppins 28px / 600, color `#fff`.
- **Links:** Newsreader 18px / 400, color `#fff`, hover → kelp green.
- **Copyright:** "© 2026 Kelp Agency. All rights reserved. Designed by humans and coded with ❤️ in [location]" — Newsreader 14.4px / 400, color `#fff`.

### Button system

| Variant | Background | Text | Padding | Radius | Border | Font |
|---------|------------|------|---------|--------|--------|------|
| Primary (default) | `#0d1726` | `#fff` | `16px 20px 12px` | `0` (square) | `2px solid transparent` | Newsreader 600, 18px |
| Primary on dark | `#fff` | `#0d1726` | `16px 20px 12px` | `0` | `2px solid transparent` | Newsreader 600, 18px |
| Link button (carousel arrows) | `#0d1726` (matches section) | `#fff` | `16px 20px 12px` | `0` | `2px solid transparent` | Newsreader 600, 18px |
| Hover (any) | invert (white bg / ink text, or vice versa) | invert | same | `0` | `2px solid var(--color-kelp)` | same |

> **Signature:** Square corners (border-radius: 0) on ALL buttons — kelp's design language is sharp/editorial, not rounded. Do NOT use rounded buttons.

---

## 6. Visual Aesthetics & Design Language

### Design DNA

1. **Editorial magazine aesthetic** — Newsreader serif body copy with generous line-height (1.8), italic emphasis, and large display headlines. Reads like a print magazine, not a typical SaaS landing page.

2. **Sharp geometry** — Zero border-radius everywhere. Buttons, cards, images, inputs all use square corners. This is a deliberate counter-trend choice against the rounded-everything default of modern web design.

3. **High-contrast light/dark alternation** — Sections alternate between white, dark ink (`#0d1726`), and mist gray (`#f4f4f4`). The rhythm is: white hero → dark recent work → white services → dark how-we-work → gray testimonials → white articles → dark CTA → dark footer.

4. **Restrained accent palette** — Kelp green, teal, seafoam, and coral are used sparingly (hover states, single highlight per section, never as large fills). The dominant colors are ink, paper, and mist.

5. **Wordmark over logo** — "Kelp" is set in Newsreader 18px (same as body), not a graphic logo. Conveys confidence in typography as identity.

6. **Type-as-image hero** — The homepage hero has no image. The H1 itself is the visual. This is rare and bold — preserve it.

7. **Numbered process as headline** — "1. Discovery", "2. Planning", etc. The number is part of the heading, not a separate badge. Editorial convention.

8. **Lowercase casual in nav, UPPERCASE never** — Nav items are sentence-case Poppins. Headlines use sentence case (only first word capitalized, except proper nouns). No `text-transform: uppercase` anywhere.

### Design anti-patterns (DO NOT use in the clone)

- ❌ Rounded corners (border-radius > 0) on buttons, cards, or images
- ❌ Drop shadows for depth (kelp uses color contrast, not elevation)
- ❌ Gradient backgrounds (solid colors only)
- ❌ Sans-serif body text (Newsreader serif is signature)
- ❌ All-caps navigation or headlines
- ❌ Hero background image (hero is typography-only)
- ❌ Modal dialogs or popups (kelp uses inline sections)
- ❌ Glassmorphism / blur effects
- ❌ Decorative emoji (the single ❤️ in the footer copyright is the only exception)

---

## 7. Web Animations & Motion

### Observed animations

| Element | Animation | Trigger | Duration | Easing |
|---------|-----------|---------|----------|--------|
| Header | Slide up on scroll down, slide down on scroll up | Scroll direction change | ~300ms | ease-out |
| Recent Work carousel | Horizontal slide transition | Prev/Next click | ~500ms | ease-in-out |
| Nav dropdowns | Fade + slide down | Hover/click on parent | ~200ms | ease-out |
| Links (hover) | Color change to kelp green | Hover | ~150ms | ease |
| Buttons (hover) | Background invert + border appears | Hover | ~150ms | ease |
| Page load (assumed) | Fade-in on hero text | Page load | ~600ms | ease-out |

### Motion design principles

1. **Subtle and editorial** — Animations are slow and gentle (200–600ms), never bouncy or spring-like. No `back.out`, `elastic`, or `bounce` easings.
2. **Scroll-triggered reveals** — Sections fade in / slide up 20px as they enter viewport (IntersectionObserver). Use `prefers-reduced-motion` to disable.
3. **Carousel is the only "interactive" animation** — Everything else is hover/state transitions.
4. **No parallax** — Backgrounds do not move at different rates on scroll.
5. **No auto-playing carousels** — The Recent Work carousel only advances on user action.

### Implementation guidance (Astro 7 + View Transitions)

```astro
---
// Use ClientRouter for page transitions (native browser View Transitions API)
import { ClientRouter } from 'astro:transitions';
---

<head>
  <ClientRouter />
</head>
```

For scroll-triggered reveals, use a small inline script with IntersectionObserver — no need for a library. For the carousel, build a vanilla JS island or use a minimal library like `swiper` (but only if vanilla proves too complex).

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. UI/UX Patterns

### Navigation UX

- **Sticky header** with headroom behavior — hides on scroll down, reveals on scroll up. Always visible at top of page.
- **Mega menu dropdowns** for Services, Work, Platforms, Resources. Each opens a multi-column panel with categorized links.
- **"Hire Us" CTA** always visible in header right side — never hidden in mobile menu.
- **Mobile menu** — full-screen overlay with stacked nav items. Hamburger icon (3 lines, no animation gimmicks).

### Content UX

- **Carousel** for Recent Work — single card visible, Prev/Next buttons on the right. No dots indicator, no autoplay.
- **Service category columns** — links are plain text, no icons. Hover state is color change only (no underline, no background).
- **Testimonials** — single large quote, possibly with attribution below. No avatar photos, no star ratings.
- **Article cards** — title + meta (date, category). No images on cards (consistent with type-as-image aesthetic).
- **Footer** — 5 columns of plain links. No icons, no social media badges (just a "Follow us on social" column with text links).

### Interaction states

| Element | Default | Hover | Active/Focus |
|---------|---------|-------|--------------|
| Body link | Underline, `#0d1726` | `#42c634` (kelp green) | Outline `2px solid #42c634` |
| Nav link | No underline, `#0d1726` | Underline appears, `#42c634` | Outline |
| Button (primary) | bg `#0d1726`, text `#fff` | bg `#fff`, text `#0d1726`, border `2px solid #42c634` | Same as hover + outline offset |
| Service link | `#0d1726` | `#42c634` | Outline |

### Accessibility considerations

- **Color contrast:** Ink `#0d1726` on white = 17.4:1 (AAA). White on ink = 17.4:1 (AAA). Kelp green `#42c634` on white = 2.8:1 (fails AA for body text — use only for large text ≥ 24px or non-text). Coral `#f9a79c` on white = 1.7:1 (decorative only).
- **Focus states:** All interactive elements must have a visible focus outline (2px solid kelp green, offset 2px).
- **Skip to content link:** Present in original (ref=e1) — preserve in clone.
- **Semantic HTML:** Use `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<h1>`–`<h4>` correctly.
- **Keyboard navigation:** Carousel must be operable with arrow keys. Dropdowns must open on Enter/Space and close on Esc.

---

## 9. Iconography & Imagery

### Icons

- **Minimal icon usage** — kelp.agency uses almost no icons. The only icons are:
  - Arrow characters "←" and "→" in carousel buttons (text-based, not SVG)
  - Dropdown caret in nav (likely a CSS triangle or chevron SVG)
  - Social media icons in footer (text links, not icons)
- **Implementation:** Use text arrows and CSS triangles. If SVGs are needed, use `astro-icon` with the `lucide` set — but keep usage minimal.

### Imagery

- **No hero image** — Hero is typography-only.
- **No stock photos on homepage** — Client logos are grayscale wordmarks/text.
- **Case study cards** — Likely have images on individual case study pages, but the homepage card is text-only with a small thumbnail (if any).
- **Article cards** — No images. Title + meta only.
- **Implementation:** Use placeholder images from `https://placehold.co/` for case study thumbnails if needed. Otherwise, omit images entirely.

---

## 10. Page Structure Summary (Homepage)

```
<header> (sticky, headroom)
  <a>Kelp</a> (wordmark)
  <nav>
    <a>Services ▾</a> (mega menu)
    <a>Work ▾</a> (mega menu)
    <a>Platforms ▾</a> (mega menu)
    <a>Resources ▾</a> (mega menu)
    <a>About</a>
    <a>Contact Us</a>
    <a class="button">Hire Us</a>
  </nav>
</header>

<main>
  <section class="hero">
    <h1>Central Florida's Award Winning Creative Agency.</h1>
    <p>We're a team of designers, developers, and marketers who love to take great ideas...</p>
    <div class="client-logos">
      <a>Elev8 Fun</a> <a>Marker 48</a> <a>Beverlin Hills</a>
    </div>
  </section>

  <section class="recent-work">
    <h2>Our Work In the real-world</h2>
    <div class="carousel">
      <article class="case-study-card">
        <h3>Spring Water Spirits</h3>
        <p>A brand rooted in clarity and craft.</p>
        <a>Read More About Spring Water Spirits</a>
      </article>
      <button>← Prev</button>
      <button>Next →</button>
    </div>
  </section>

  <section class="services">
    <h2>Our Services</h2>
    <div class="services-grid">
      <div>
        <h3>Branding & Design</h3>
        <a>Apparel Design</a> <a>Company Branding</a> <a>Digital Design</a> ...
      </div>
      <div>
        <h3>Websites</h3>
        <a>App Development</a> <a>Web Design</a> ...
      </div>
      <div>
        <h3>Marketing & Strategy</h3>
        <a>Audience Targeting</a> ...
      </div>
      <div>
        <h3>Media</h3>
        <a>Motion Graphics</a> <a>Photography</a> <a>Videography</a>
      </div>
      <div>
        <h3>Ongoing Support</h3>
        <a>Ongoing Retainers</a> <a>Web Hosting</a> <a>Web Support & Maintenance</a>
      </div>
    </div>
  </section>

  <section class="how-we-work">
    <h2>How We Work</h2>
    <p>Everything we work on follows the same 5 basic steps in order:</p>
    <ol class="process-grid">
      <li><h3>1. Discovery</h3><p>...</p></li>
      <li><h3>2. Planning</h3><p>...</p></li>
      <li><h3>3. Production</h3><p>...</p></li>
      <li><h3>4. Market</h3><p>...</p></li>
      <li><h3>5. Ongoing Support</h3><p>...</p></li>
    </ol>
  </section>

  <section class="testimonials">
    <h2>What Our Clients Say</h2>
    <blockquote>Working with Kelp has been an absolute pleasure...</blockquote>
  </section>

  <section class="featured-articles">
    <h3>Featured Articles</h3>
    <div class="articles-grid">
      <article><h4>Manipulate HubSpot Forms with JavaScript—the Right Way</h4></article>
      <article><h4>Simple HubDB Pagination</h4></article>
      <article><h4>Partners VS Pirates: Navigating an Ocean of Digital Agencies</h4></article>
    </div>
  </section>

  <section class="cta">
    <h3>Ready to get started?</h3>
    <p>Let's get creative and start making something amazing together!</p>
    <a class="button">Schedule a Meeting</a>
  </section>
</main>

<footer>
  <div class="footer-grid">
    <div><h3>Services</h3>...</div>
    <div><h3>Contact</h3>...</div>
    <div><h3>Work</h3>...</div>
    <div><h3>Platforms</h3>...</div>
    <div><h3>Follow us on social</h3>...</div>
  </div>
  <p class="copyright">© 2026 Kelp Agency. All rights reserved. Designed by humans and coded with ❤️ in [location]</p>
</footer>
```

---

## 11. Responsive Breakpoints

> **Inferred from typical agency conventions** (kelp.agency's exact breakpoints not measured). Verify against the live site at 320/768/1024/1280px before finalizing.

| Breakpoint | Width | Layout changes |
|------------|-------|----------------|
| Mobile (default) | < 768px | Single column, hamburger menu, reduced type scale, stacked service categories |
| Tablet | 768px–1023px | 2-column grids where applicable, hamburger menu, medium type scale |
| Desktop | 1024px–1279px | Multi-column layouts, full nav, large type scale |
| Large desktop | ≥ 1280px | Max-width container 1200px, everything scales up via clamp() |

### Mobile-specific adaptations

- Header: logo left, hamburger right, "Hire Us" CTA may move into menu
- Hero: H1 reduces via clamp() to ~40px, client logos stack
- Recent Work: carousel still single-card, buttons below card
- Services: categories stack vertically (one per row)
- How We Work: 5 steps stack vertically with full-width descriptions
- Testimonials: single column
- Featured Articles: single column
- Footer: 5 columns stack into single column

---

## 12. Implementation Notes for Astro 7

### Fonts setup (Astro 6+ Fonts API)

```javascript
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    { provider: fontProviders.google(), name: 'Poppins', cssVariable: '--font-poppins', weights: ['500', '600', '700'] },
    { provider: fontProviders.google(), name: 'Newsreader', cssVariable: '--font-newsreader', weights: ['300', '400', '600'], styles: ['normal', 'italic'] },
  ],
});
```

### Tailwind 4 setup

```javascript
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-ink: #0d1726;
  --color-paper: #ffffff;
  --color-kelp: #42c634;
  --color-teal: #c5f5f6;
  --color-seafoam: #a1e39a;
  --color-coral: #f9a79c;
  --color-mist: #f4f4f4;
  --color-slate: #757575;

  --font-poppins: 'Poppins', sans-serif;
  --font-newsreader: 'Newsreader', Georgia, serif;
}
```

### Carousel implementation

Build a vanilla JS Astro island (no library) using `IntersectionObserver` for scroll reveals and a simple state-driven carousel for Recent Work. ~50 lines of TS.

### View Transitions

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---

<head>
  <ClientRouter />
</head>
```

---

## 13. Verification Checklist

Before considering the clone complete, verify each of these against the live `kelp.agency`:

- [x] H1 reads "Central Florida's Award Winning Creative Agency." in Poppins 700, ~68px
- [x] Body text is Newsreader 400, ~18px, line-height ~1.8
- [x] All buttons have `border-radius: 0` (square corners)
- [x] All buttons use Newsreader (not Poppins) for button text
- [x] Recent Work section has dark `#0d1726` background
- [x] How We Work section has dark `#0d1726` background and oversized H2
- [x] Testimonials section has `#f4f4f4` background
- [x] Footer has dark `#0d1726` background with 5 columns
- [x] Header is sticky with headroom behavior (hides on scroll down)
- [x] Nav links are Poppins 600, 15px, color `#0d1726`
- [x] No images on homepage hero (typography only)
- [x] No rounded corners anywhere
- [x] No drop shadows for depth
- [x] Kelp green `#42c634` appears only on hover states and accents
- [x] Italic Newsreader is used for editorial emphasis in body copy
- [x] "Hire Us" button in header and "Schedule a Meeting" button in CTA section
- [x] 5-step process: Discovery → Planning → Production → Market → Ongoing Support
- [x] 5 service categories: Branding & Design, Websites, Marketing & Strategy, Media, Ongoing Support
- [x] 3 featured articles in resources section
- [x] Copyright line includes "Designed by humans and coded with ❤️"

### Added 2026-08-04 (post-remediation)

- [x] Header nav has dropdown menus for Services, Work, Platforms, Resources (`aria-expanded`, `aria-controls`, Escape to close, outside-click to close, hover/focus reveal via CSS)
- [x] All 9 case studies from the original `/work/` page are present (Spring Water Spirits, Deals In Dirt, Hart's Meat Market, Elev8 Fun, Mountaineer Coffee, Unprofitable, Marker 48 Brewing, Croom Brewery, Beverlin Hills Quality Goods)
- [x] All 4 platforms from the original `/platforms/` page are present (HubSpot, Shopify, WordPress, Headless)
- [x] `/work/clients/` page exists (mirrors `kelp.agency/work/clients/`)
- [x] Hero "client logos" links resolve to existing case study pages (no 404s)
- [x] Footer "Clients" link resolves to `/work/clients/` (no 404)
- [x] No placeholder `href="#"` links anywhere on the site
- [x] `astro.config.mjs` `site` is the deployed production URL (`https://astro.jesspete.shop`)
- [x] Canonical URLs and OG URLs point at the deployed domain
- [x] `public/robots.txt` exists and references the sitemap
- [x] `sitemap-index.xml` is generated at build time
- [x] `<meta name="theme-color">` matches the default page background (`#ffffff`)
- [x] Default OG image meta tag is wired (image file `public/og-default.png` is the maintainer's responsibility)
- [x] Carousel wrapper is keyboard-focusable (`tabindex="0"`, `role="region"`, `aria-label`)
- [x] Carousel slides have `role="group"`, `aria-roledescription="slide"`, and `aria-label="Slide N of M: {title}"`
- [x] Carousel responds to ArrowLeft / ArrowRight when focused (with `preventDefault`)
- [x] Mobile menu offset uses `var(--header-height)` (not a hardcoded `72px`)
- [x] All homepage sections consume content collections via `getCollection()` (single source of truth)
- [x] `npm run check` passes with 0 errors / 0 warnings / 0 hints
- [x] `npm run check:links` reports 0 broken internal links
- [x] `npm run check:content` reports 0 invalid frontmatter entries

### Added 2026-08-04 (round 3 — skills compliance + design fidelity)

- [x] Mobile menu has `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"` (per `astro-7-patterns` skill §7)
- [x] Mobile menu focus management: opening moves focus to first link; closing returns focus to toggle button
- [x] Footer has 6 columns including "Ready to get started?" CTA (matches original kelp.agency)
- [x] How We Work section ends with "Ready to get started?" CTA link to `/contact/` (matches original)
- [x] Service display order shared via `src/lib/service-order.ts` (DRY — no duplicated `desiredOrder` arrays)

---

*End of design template. All values verified via direct measurement of `https://www.kelp.agency/` on 2026-08-03. Post-remediation verification performed on 2026-08-04 — see `docs/audit/AUDIT_FINDINGS.md`, `docs/audit/REMEDIATION_PLAN.md`, `docs/audit/REMEDIATION_PLAN_ROUND2.md`, and `docs/audit/REMEDIATION_PLAN_ROUND3.md`.*
