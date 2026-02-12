# CLAUDE.md — 4Best Agent Property Website

## Project Overview

Website perusahaan agen properti **4Best Agent Property** — menampilkan profil mitra (developer), daftar perumahan (produk), dan halaman kontak. Dilengkapi admin dashboard untuk manajemen konten.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack dev)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives, shadcn/ui pattern, Lucide React icons
- **Animation**: Framer Motion (custom `AnimatedSection`, `AnimatedCard`, `AnimatedCounter` wrappers)
- **Slider**: Swiper
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack React Table
- **Database**: Cloudflare D1 (SQLite edge)
- **Storage**: Cloudflare R2 (S3-compatible, for images/assets)
- **Email**: Brevo (Sendinblue) for contact form
- **Deployment**: Cloudflare Pages via `@opennextjs/cloudflare`
- **Testing**: Vitest + Testing Library + jsdom
- **Auth**: Custom session-based (bcryptjs, cookie `admin_session`)

## Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              # Homepage
│   │   ├── about/                # Tentang
│   │   ├── partners/             # Mitra / Developer
│   │   ├── products/             # Perumahan
│   │   └── contact/              # Kontak
│   ├── admin/
│   │   ├── (auth)/login/         # Login page
│   │   └── (dashboard)/          # Protected dashboard
│   │       ├── content/          # Hero slides, page sections, CTA
│   │       ├── partners/         # CRUD mitra
│   │       ├── products/         # CRUD perumahan
│   │       ├── submissions/      # CRM contact submissions
│   │       └── settings/         # Site, company, social settings
│   └── api/
│       ├── admin/                # Admin API routes (CRUD, auth)
│       └── storage/[...path]/    # R2 asset proxy
├── components/
│   ├── ui/                       # Atomic UI (button, input, dialog, etc.)
│   ├── sections/                 # Page sections (Hero, Gallery, Stats, etc.)
│   ├── layout/                   # Navbar, Footer, Preloader, ScrollToTop
│   ├── cards/                    # Partner & Product cards
│   └── admin/                    # Admin dashboard components
├── lib/
│   ├── cloudflare.ts             # getDB(), getStorage(), uploadToR2(), deleteFromR2()
│   ├── db.ts                     # All DB queries + type definitions
│   ├── auth.ts                   # Session auth (login, validate, logout)
│   ├── brevo.ts                  # Email sending via Brevo
│   ├── form-validation.ts        # Zod schemas for forms
│   ├── animations.ts             # Framer Motion variants
│   ├── animation-config.ts       # Animation config constants
│   ├── swiper-config.ts          # Swiper config
│   └── utils.ts                  # cn() (clsx + tailwind-merge)
├── middleware.ts                  # Protects /admin/* routes (cookie check)
db/
├── schema.sql                    # Full DB schema
└── seed-partners.sql             # Seed data for partners
```

## Database Schema (Cloudflare D1)

Key tables:
- `partners` — Mitra/developer (name, slug, logo, hero_image, contact, is_featured)
- `products` — Perumahan (partner_id FK, category: 'commercial'|'subsidi', location, main_image)
- `product_images` — Gallery images for products
- `contact_submissions` — CRM data from contact form
- `homepage`, `about_page`, `missions` — CMS content
- `page_sections`, `hero_slides` — Dynamic homepage sections
- `site_settings`, `company_info`, `social_links` — Global settings
- `admin_users`, `sessions` — Auth

All timestamps stored as TEXT using `datetime('now')`. Boolean flags use INTEGER (0/1).

## Cloudflare Bindings

Defined in `wrangler.jsonc`:
- `DB` — D1 database (`four-best-db`)
- `STORAGE` — R2 bucket (`four-best-storage`)
- `ASSETS` — Static assets
- `IMAGES` — Image optimization
- `WORKER_SELF_REFERENCE` — Self-reference for caching

Access bindings via `src/lib/cloudflare.ts`:
```ts
const db = await getDB();
const storage = await getStorage();
```

## Key Patterns & Conventions

### Data Fetching
- Server Components fetch data directly using functions from `src/lib/db.ts`
- No external API calls for reads — all direct D1 queries in server context
- Admin mutations go through API routes at `src/app/api/admin/`

### Component Patterns
- Server Components by default for SEO and performance
- Client Components (`"use client"`) only for interactivity (sliders, forms, animations)
- Animation wrappers: `AnimatedSection`, `AnimatedCard`, `AnimatedCounter`

### API Routes
- RESTful pattern: `GET` for list, `POST` for create in `route.ts`
- `GET`, `PUT`, `DELETE` in `[id]/route.ts` for individual resources
- Reorder endpoints: `PUT` to `/api/admin/{resource}/reorder`
- Auth check via session cookie in admin API routes

### Auth Flow
- Login: `POST /api/admin/login` → sets `admin_session` cookie
- Middleware (`src/middleware.ts`) checks cookie on `/admin/*` (except `/admin/login`)
- Session stored in `sessions` table with expiry

### File Upload
- Upload to R2 via `uploadToR2(key, file, contentType)` from `src/lib/cloudflare.ts`
- Serve files via proxy: `/api/storage/{key}` → R2

### Naming
- Database: snake_case (e.g., `partner_id`, `is_active`, `display_order`)
- TypeScript interfaces: PascalCase (e.g., `Partner`, `Product`, `ContactSubmission`)
- Components: PascalCase files (e.g., `AnimatedSection.tsx`, `PartnerForm.tsx`)
- Routes: kebab-case directories (e.g., `hero-slides`, `page-sections`)

### Bahasa
- UI text dan konten dalam **Bahasa Indonesia**
- Code, comments, dan variable names dalam **English**

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run deploy       # Build + deploy to Cloudflare Pages
npm run preview      # Build + local preview
npm run test         # Run Vitest
npm run lint         # ESLint
npm run cf-typegen   # Generate Cloudflare binding types
```

## Commit Convention

Format: `type: description` (lowercase)
Types used: `feat`, `fix`, `refactor`, `style`, `docs`

## Important Notes

- R2 images are served through `/api/storage/[...path]` proxy route, not direct R2 URLs
- Product categories are strictly `'commercial'` or `'subsidi'` (enforced by DB CHECK constraint)
- `is_active` and `is_featured` are INTEGER (0/1), not boolean
- All `display_order` fields control sorting in lists
- Slugs must be unique per table (partners, products)
- `contact_submissions` table powers the CRM/submissions admin page with server-side filtering
