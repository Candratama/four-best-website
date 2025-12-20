# 4best Landing Pages Design

## Overview

Property agent landing page website for 4best, built with Next.js 15 + Tailwind 4, deployed to Cloudflare. Uses Residem HTML templates as reference, converted to React components with hybrid styling approach.

## Routes & Pages

| Route | Template Source | Purpose |
|-------|-----------------|---------|
| `/` | `apartment-homepage-1` | Homepage with hero, overview, facilities, highlighted partners, stats, agents |
| `/partners` | `apartment-rooms-fluid` | Grid of all partners (2-col fluid layout) |
| `/partners/[slug]` | `single-property-3` | Partner profile + products list (komersil/subsidi tabs) |
| `/partners/[slug]/products/[productSlug]` | `single-property-2` | Housing product detail with gallery, specs, floorplan |
| `/about` | `apartment-about` | About 4best, mission, team members, stats |
| `/contact` | `apartment-contact` | Contact form with date picker |

## Technical Approach

### Styling Strategy: Hybrid

- **Tailwind 4** for layout, spacing, typography, colors
- **Custom CSS** for micro-interactions (imported/adapted from template):
  - `hover-scale-1-1`, `hover-scale-1-2` - scale on hover
  - `wow` scroll-triggered animations (fadeInUp, scaleIn, zoomIn)
  - `fx-slide` button slide effects
  - `bg-blur` glass/blur effects
  - Parallax backgrounds (jarallax alternative)

### Dependencies

```json
{
  "swiper": "for carousels/sliders",
  "framer-motion": "for scroll animations (WOW.js alternative)"
}
```

### Component Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── partners/
│   │   ├── page.tsx                # Partners list
│   │   └── [slug]/
│   │       ├── page.tsx            # Partner detail
│   │       └── products/
│   │           └── [productSlug]/
│   │               └── page.tsx    # Product detail
│   ├── about/
│   │   └── page.tsx                # About page
│   └── contact/
│       └── page.tsx                # Contact page
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Shared navigation
│   │   └── Footer.tsx              # Shared footer
│   ├── sections/
│   │   ├── Hero.tsx                # Hero with parallax/slider
│   │   ├── Overview.tsx            # Overview with icons
│   │   ├── Gallery.tsx             # Filterable image gallery
│   │   ├── Stats.tsx               # Animated counters
│   │   ├── Team.tsx                # Team members grid
│   │   ├── Facilities.tsx          # Facilities icons grid
│   │   ├── NearbyPlaces.tsx        # Nearby highlights
│   │   └── ContactForm.tsx         # Contact/booking form
│   ├── cards/
│   │   ├── PartnerCard.tsx         # Partner grid card
│   │   └── ProductCard.tsx         # Product grid card
│   └── ui/
│       ├── Button.tsx              # fx-slide button
│       ├── Tabs.tsx                # Product type tabs
│       └── ImageSlider.tsx         # Swiper wrapper
└── styles/
    └── effects.css                 # Micro-interaction effects
```

## Page Sections

### Homepage (`/`)
1. Hero - full-width image with tagline, CTA
2. Overview - about 4best with feature icons
3. Partners highlight - featured partners grid
4. Stats - animated counters (partners count, products, etc.)
5. Contact agents section
6. Footer

### Partners List (`/partners`)
1. Hero banner
2. 2-column fluid grid of partner cards with hover effects

### Partner Detail (`/partners/[slug]`)
1. Hero with partner info
2. Overview with partner description
3. Products section with tabs (Komersil / Subsidi)
4. Product cards grid
5. Gallery
6. Nearby places
7. Contact form

### Product Detail (`/partners/[slug]/products/[productSlug]`)
1. Hero slider with property specs overlay
2. Overview with feature checklist
3. Room details (tabbed)
4. Floorplan
5. Image gallery with filters
6. Facilities icons
7. Nearby places
8. Contact/inquiry form

### About (`/about`)
1. Hero banner
2. About section with images
3. Mission statement
4. Stats counters
5. Team members grid
6. CTA section

### Contact (`/contact`)
1. Hero banner
2. Contact form with date picker

## Micro-Interactions to Implement

| Effect | CSS Class | Description |
|--------|-----------|-------------|
| Scale on hover | `hover-scale-1-1` | 1.1x scale on hover |
| Scale on hover (large) | `hover-scale-1-2` | 1.2x scale on hover |
| Fade in up | `fadeInUp` | Element fades in from below on scroll |
| Scale in | `scaleIn` | Element scales from 0 to 1 on scroll |
| Zoom in | `zoomIn` | Element zooms in on scroll |
| Button slide | `fx-slide` | Background slides on hover |
| Glass blur | `bg-blur` | Backdrop blur effect |
| Opacity on hover | `hover-op-1` | Show element on parent hover |

## Data Model (Reference)

Based on brief, data includes:
- **Partners**: name, slug, description, logo, images, location
- **Products**: name, slug, type (komersil/subsidi), specs, images, floorplan, price
- **Homepage content**: hero, tagline, features
- **About content**: description, mission, team members
- **Contact info**: address, phone, email, hours
