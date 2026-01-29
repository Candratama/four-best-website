# Design: Integrasi Cloudflare R2 Storage untuk 4Best Website

**Tanggal:** 2026-01-29
**Status:** Draft - Menunggu Implementasi

## Tujuan

1. **Admin panel untuk upload gambar** - Agar admin bisa upload/ganti gambar tanpa akses ke codebase
2. **Performa & CDN** - Memanfaatkan Cloudflare CDN untuk loading gambar lebih cepat
3. **Skalabilitas** - Antisipasi banyak listing properti dengan banyak foto

## Arsitektur Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        4Best Website                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐         ┌──────────────────────────────┐    │
│   │  Next.js App │         │     Cloudflare R2 Bucket     │    │
│   │              │         │                              │    │
│   │  - Pages     │ ──────► │  cdn.4best.id (custom domain)│    │
│   │  - API Routes│         │                              │    │
│   │  - Admin     │         │  /slider/                    │    │
│   └──────────────┘         │  /team/                      │    │
│          │                 │  /partners/                  │    │
│          │                 │  /properties/                │    │
│          ▼                 │  /backgrounds/               │    │
│   ┌──────────────┐         │  /misc/                      │    │
│   │  /public/    │         │  /branding/  ← logo, dll     │    │
│   │  (lokal)     │         └──────────────────────────────┘    │
│   │  - favicon   │                                             │
│   └──────────────┘                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Pembagian storage:**
- **R2 (cdn.4best.id)**: Semua gambar termasuk logo, slider, team, partners, properties, backgrounds, misc
- **Lokal (/public/)**: Hanya favicon (karena browser expect di root domain)

**Struktur folder R2:**
```
cdn.4best.id/
├── branding/
│   ├── logo.svg
│   ├── logo-white.svg
│   └── logo-dark.svg
├── slider/
├── team/
├── partners/
├── properties/
├── backgrounds/
└── misc/
```

## Technical Stack & Dependencies

**Dependencies yang akan ditambahkan:**

```json
{
  "@aws-sdk/client-s3": "^3.x",
  "@aws-sdk/s3-request-presigner": "^3.x",
  "sharp": "^0.33.x"
}
```

**Environment Variables:**

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=4best-assets
R2_PUBLIC_URL=https://cdn.4best.id
```

**Konfigurasi Next.js (next.config.ts):**

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.4best.id',
      pathname: '/**',
    },
  ],
}
```

## Image Processing & Upload Flow

```
1. Admin pilih file gambar
           │
           ▼
2. Client-side validation
   - Max file size: 10MB
   - Format: jpg, png, webp, svg
           │
           ▼
3. Upload ke API Route (/api/upload)
           │
           ▼
4. Server-side processing (Sharp)
   • Convert to WebP (jika bukan SVG)
   • Resize jika > 2000px
   • Compress (quality 80%)
   • Generate thumbnail
           │
           ▼
5. Upload ke R2
   - Original (processed): /slider/image.webp
   - Thumbnail: /slider/thumbs/image.webp
           │
           ▼
6. Return URL ke client
```

**Processing rules:**

| Kategori    | Max Width | Thumbnail | Format        |
|-------------|-----------|-----------|---------------|
| slider      | 1920px    | 400px     | webp          |
| team        | 800px     | 200px     | webp          |
| partners    | 600px     | 150px     | webp          |
| properties  | 1600px    | 400px     | webp          |
| backgrounds | 1920px    | -         | webp          |
| branding    | original  | -         | keep original |

## Migration Script Flow

```
1. Scan /public/images/ dan /public/*.svg
           │
           ▼
2. Map ke kategori R2:
   /public/images/slider/*     → /slider/
   /public/images/team/*       → /team/
   /public/images/partner/*    → /partners/
   /public/images/background/* → /backgrounds/
   /public/images/misc/*       → /misc/
   /public/logo.svg            → /branding/
           │
           ▼
3. Process setiap gambar:
   - Convert to WebP (kecuali SVG)
   - Resize sesuai kategori
   - Generate thumbnail
           │
           ▼
4. Upload ke R2
           │
           ▼
5. Generate mapping file (old path → new URL)
           │
           ▼
6. Update semua referensi di codebase
```

## Database & Code Updates

**Komponen yang perlu di-update:**

| File | Perubahan |
|------|-----------|
| `src/components/layout/Header.tsx` | Logo URL |
| `src/components/layout/Footer.tsx` | Logo URL |
| `src/components/sections/Hero.tsx` | Default slides URL |
| `src/components/cards/TeamCard.tsx` | Placeholder image URL |
| `src/app/page.tsx` | Hardcoded image paths |
| `src/app/about/AboutPageClient.tsx` | Default fallback images |
| `next.config.ts` | Add remotePatterns |

**Helper function:**

```typescript
// src/lib/r2/utils.ts
export function getAssetUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const cleanPath = path.replace(/^\/images\//, '/');
  return `${process.env.R2_PUBLIC_URL}${cleanPath}`;
}
```

## File Structure

```
src/
├── lib/
│   └── r2/
│       ├── client.ts          # [NEW] R2 S3 client setup
│       ├── upload.ts          # [NEW] Upload + image processing
│       ├── delete.ts          # [NEW] Delete operations
│       └── utils.ts           # [NEW] Helper functions
├── components/
│   └── layout/
│       ├── Header.tsx         # [MODIFY] Logo URL
│       └── Footer.tsx         # [MODIFY] Logo URL
├── app/
│   ├── page.tsx               # [MODIFY] Image URLs
│   └── about/
│       └── AboutPageClient.tsx # [MODIFY] Default image URLs
scripts/
└── migrate-to-r2.ts           # [NEW] Migration script
next.config.ts                 # [MODIFY] Add remotePatterns
.env.local                     # [MODIFY] Add R2 credentials
```

## Urutan Implementasi

1. Setup R2 client library (`src/lib/r2/`)
2. Buat migration script
3. Jalankan migrasi gambar ke R2
4. Update semua referensi di codebase
5. Update database records (team members, about page, dll)
6. Test semua halaman
7. Cleanup `/public/images/` setelah verifikasi
