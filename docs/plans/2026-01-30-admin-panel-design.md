# Admin Panel Design

**Date**: 2026-01-30
**Status**: Draft
**Tech Stack**: Next.js 15, shadcn/ui + shadcnblocks, Cloudflare D1, Cloudflare R2

---

## Overview

Admin panel untuk mengelola konten website 4best Property Agent. Fokus utama pada **Content-first** approach dengan prioritas Partners & Products management.

## Design Principles

1. **Content-first** - Fokus pada editing content yang sering berubah
2. **Sidebar collapsible** - Modern, hemat space, responsive
3. **Full Featured CRUD** - Bulk actions, search, filter, drag & drop reorder

---

## Route Structure

```
/admin/login              → Login page
/admin                    → Dashboard (stats overview)
/admin/partners           → Partners list (data table)
/admin/partners/new       → Create partner form
/admin/partners/[id]      → Edit partner form
/admin/products           → Products list (data table)
/admin/products/new       → Create product form
/admin/products/[id]      → Edit product form
/admin/content/hero-slides    → Hero slides management
/admin/content/page-sections  → Page sections editor
/admin/content/cta            → CTA section editor
/admin/settings           → Site settings (tabbed)
/admin/settings/company   → Company info
/admin/settings/navigation → Navigation items
/admin/settings/social    → Social links
```

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (collapsible)  │        Main Content           │
│  ┌───────────────────┐  │  ┌─────────────────────────┐  │
│  │ Logo              │  │  │ Breadcrumb              │  │
│  │ ─────────────────│  │  │ Page Title + Actions    │  │
│  │ Dashboard         │  │  │ ─────────────────────── │  │
│  │ Partners ▼        │  │  │                         │  │
│  │   └ All Partners  │  │  │    Content Area         │  │
│  │   └ Add New       │  │  │    (Table/Form/etc)     │  │
│  │ Products ▼        │  │  │                         │  │
│  │   └ All Products  │  │  │                         │  │
│  │   └ Add New       │  │  │                         │  │
│  │ Content ▼         │  │  │                         │  │
│  │ Settings ▼        │  │  └─────────────────────────┘  │
│  │ ─────────────────│  │                                │
│  │ User Profile      │  │                                │
│  │ Logout            │  │                                │
│  └───────────────────┘  │                                │
└─────────────────────────────────────────────────────────┘
```

---

## Feature Details

### 1. Dashboard (`/admin`)

**Stats Cards:**
- Total Partners (active)
- Total Products (active)
- Products by Category (Commercial vs Subsidi)

**Recent Activity:**
- Last 5 partners added/updated
- Last 5 products added/updated

**Quick Actions:**
- Add Partner
- Add Product
- Edit Homepage

### 2. Partners Management

**List Features:**
- Data table dengan sortable columns
- Checkbox selection untuk bulk delete
- Drag & drop reorder (display_order)
- Quick actions: Edit, View Products, Toggle Featured, Delete
- Filters: Status (Active/Inactive), Featured (Yes/No)
- Search: By name, slug

**Form Fields:**
- Name, Slug (auto-generate)
- Short Description
- Full Profile (rich text)
- Logo (image upload)
- Hero Image (image upload)
- Contact Phone, Email
- Is Active, Is Featured
- Display Order

**Nested Products:**
- Inline table showing related products
- Quick add/edit/delete from partner form

### 3. Products Management

**List Features:**
- Data table dengan sortable columns
- Checkbox selection untuk bulk delete
- Drag & drop reorder
- Quick actions: Edit, View on Site, Duplicate, Delete
- Filters: Partner, Category (Commercial/Subsidi), Status
- Search: By name, location

**Form Fields:**
- Partner (dropdown with search)
- Name, Slug
- Category (Commercial/Subsidi)
- Location
- Description (rich text)
- Main Image (single upload)
- Gallery Images (multiple upload, sortable)
- Is Active
- Display Order

### 4. Content Management

**Hero Slides:**
- Grid view grouped by page (home, partners, etc)
- Drag & drop reorder
- Upload image, set overlay opacity
- Toggle active status

**Page Sections:**
- Card grid grouped by page
- Edit via drawer/sheet
- Dynamic form based on section type (hero, overview, etc)
- Support for images array

**CTA Section:**
- Single form for global CTA
- Title, description, buttons, background image

### 5. Settings

**Site Settings Tab:**
- Logo upload
- Favicon upload
- Site name, tagline
- Language
- Primary/Secondary colors (color picker)

**Company Info Tab:**
- Address, Address Line 2
- Phone, WhatsApp
- Email
- Opening Hours
- Map URL

**Navigation Tab:**
- Sortable list of menu items
- Add/Edit/Delete items
- Label, URL, Active status

**Social Links Tab:**
- Table of social platforms
- Platform name, URL, Icon, Active status

---

## Authentication

### Login Flow
1. User visits `/admin/*`
2. Middleware checks session cookie
3. If invalid → redirect to `/admin/login`
4. If valid → allow access

### Implementation
```typescript
// lib/auth.ts
- hashPassword(password) → bcrypt hash
- verifyPassword(password, hash) → boolean
- createSession(userId) → session token (stored in DB)
- validateSession(token) → user | null
- deleteSession(token) → void

// middleware.ts
- Protect all /admin/* except /admin/login
- Check session cookie
- Redirect if invalid
```

### Database Tables (existing)
- `admin_users`: id, username, password_hash, name, is_active
- `sessions`: id, user_id, expires_at, created_at

---

## Shadcnblocks Components

### To Install
```bash
# Core Layout
npx shadcn@latest add sidebar -r @shadcnblocks
npx shadcn@latest add stats-card -r @shadcnblocks

# Data Management
npx shadcn@latest add data-table -r @shadcnblocks
npx shadcn@latest add form -r @shadcnblocks

# Settings
npx shadcn@latest add settings-profile -r @shadcnblocks
```

### Custom Components to Build

| Component | Purpose |
|-----------|---------|
| `ImageUpload` | Single image upload to R2 |
| `ImageGallery` | Multiple images + sortable |
| `RichTextEditor` | TipTap for descriptions |
| `SortableList` | Drag & drop reorder |
| `ColorPicker` | Site color settings |

---

## API Routes

### Auth
- `POST /api/admin/login` - Login
- `POST /api/admin/logout` - Logout

### Partners
- `GET /api/admin/partners` - List all
- `POST /api/admin/partners` - Create
- `GET /api/admin/partners/[id]` - Get one
- `PUT /api/admin/partners/[id]` - Update
- `DELETE /api/admin/partners/[id]` - Delete
- `POST /api/admin/partners/reorder` - Bulk reorder

### Products
- `GET /api/admin/products` - List all
- `POST /api/admin/products` - Create
- `GET /api/admin/products/[id]` - Get one
- `PUT /api/admin/products/[id]` - Update
- `DELETE /api/admin/products/[id]` - Delete
- `POST /api/admin/products/reorder` - Bulk reorder

### Content
- `GET /api/admin/hero-slides` - List all
- `POST /api/admin/hero-slides` - Create
- `PUT /api/admin/hero-slides/[id]` - Update
- `DELETE /api/admin/hero-slides/[id]` - Delete
- `GET /api/admin/page-sections` - List all
- `PUT /api/admin/page-sections/[id]` - Update

### Settings
- `GET /api/admin/settings/site` - Get site settings
- `PUT /api/admin/settings/site` - Update site settings
- `GET /api/admin/settings/company` - Get company info
- `PUT /api/admin/settings/company` - Update company info
- Similar for navigation, social links

### Upload
- `POST /api/admin/upload` - Upload file to R2

---

## Implementation Phases

### Phase 1: Foundation
1. Auth system (login, logout, session, middleware)
2. Admin layout with collapsible sidebar
3. Dashboard with stats

### Phase 2: Partners & Products
1. Partners CRUD with full features
2. Products CRUD with full features
3. Image upload integration

### Phase 3: Content Management
1. Hero slides management
2. Page sections editor
3. CTA section editor

### Phase 4: Settings
1. Site settings
2. Company info
3. Navigation items
4. Social links

---

## Notes

- All forms use React Hook Form + Zod validation
- Image uploads go to Cloudflare R2 via existing `/api/storage` route
- Drag & drop uses @dnd-kit library
- Rich text uses TipTap editor
- Session expires after 7 days by default
