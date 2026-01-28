# UI/UX + Code Quality Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all P1 and P2 issues identified in the UI/UX review to improve user experience, code quality, and maintainability.

**Architecture:** Server-side data fetching from existing DB queries, consistent Indonesian language across UI, mobile-friendly touch interactions, optimized N+1 queries with SQL JOIN, and removal of dead code/risky CSS overrides.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, D1 SQLite database, TypeScript

---

## Task 1: Fix Contact Page - Use Database Data Instead of Hardcoded

**Files:**
- Modify: `src/app/contact/page.tsx`

**Step 1: Convert to Server Component and fetch data**

The contact page currently uses hardcoded `contactData`. We need to fetch from `getCompanyInfo()` which already exists in `src/lib/db.ts`.

```tsx
// src/app/contact/page.tsx - Replace entire file
import { getCompanyInfo } from "@/lib/db";
import { Hero } from "@/components/sections";
import ContactPageClient from "./ContactPageClient";

export default async function ContactPage() {
  const companyInfo = await getCompanyInfo();

  const contactData = {
    address: companyInfo?.address || "Perum Ungaran Asri JL. Serasi Raya Atas No C1, Ungaran, Kab. Semarang",
    whatsapp: companyInfo?.whatsapp || "+62 812 3456 7890",
    email: companyInfo?.email || "contact@4best.id",
    openingHours: companyInfo?.opening_hours || "Sen - Sab 08:00 - 17:00",
    instagram: "@4best.id",
    mapUrl: companyInfo?.map_url || "https://www.google.com/maps?q=Perum+Ungaran+Asri&output=embed",
  };

  return (
    <>
      <Hero
        variant="parallax-contact"
        title="Jadwalkan Kunjungan"
        subtitle="Kami Siap Membantu Anda!"
        backgroundImage="/images/background/8.webp"
      />
      <ContactPageClient contactData={contactData} />
    </>
  );
}
```

**Step 2: Create ContactPageClient component**

```tsx
// src/app/contact/ContactPageClient.tsx - New file
"use client";

import { useWow } from "@/hooks";
import { ContactForm, ContactInfo, GoogleMap } from "@/components/sections";

interface ContactData {
  address: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  instagram: string;
  mapUrl: string;
}

interface ContactPageClientProps {
  contactData: ContactData;
}

export default function ContactPageClient({ contactData }: ContactPageClientProps) {
  useWow();

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    date: string;
    time: string;
    message: string;
  }) => {
    // TODO: Implement actual form submission logic
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      <section id="section-contact">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <ContactInfo
                address={contactData.address}
                whatsapp={contactData.whatsapp}
                email={contactData.email}
                openingHours={contactData.openingHours}
                instagram={contactData.instagram}
              />
            </div>
            <div className="col-lg-8">
              <div className="contact-form-wrapper">
                <h3 className="contact-info-title mb-4">Jadwalkan Kunjungan</h3>
                <ContactForm variant="inline" onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GoogleMap mapUrl={contactData.mapUrl} address={contactData.address} height="450px" />
    </>
  );
}
```

**Step 3: Verify the changes**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
git add src/app/contact/page.tsx src/app/contact/ContactPageClient.tsx
git commit -m "refactor(contact): use database data instead of hardcoded values

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Fix Language Consistency - Convert English to Indonesian

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/PartnersGrid.tsx`
- Modify: `src/components/cards/PartnerCard.tsx`

**Step 1: Update Header navigation and CTA to Indonesian**

```tsx
// src/components/layout/Header.tsx - Update navigation labels
// Line 81: "Home" -> "Beranda"
// Line 90: "Partners" -> "Partner"
// Line 99: "About" -> "Tentang"
// Line 108: "Contact" -> "Kontak"
// Line 134, 137: "Schedule a Visit" -> "Jadwalkan Kunjungan"
```

**Step 2: Update Homepage section titles**

```tsx
// src/app/page.tsx
// Line 47-48: Update PartnersGrid props
<PartnersGrid
  subtitle="Partner Kami"
  title="Partner Terpercaya"
  limit={4}
/>
```

**Step 3: Update PartnerCard button text**

```tsx
// src/components/cards/PartnerCard.tsx
// Line 33-35: "View Details" -> "Lihat Detail"
<Link
  href={linkHref}
  className="btn-main btn-line btn-line-light fx-slide"
  data-hover="Lihat Detail"
>
  <span>Lihat Detail</span>
</Link>
```

**Step 4: Verify the changes**

Run: `npm run dev`
Expected: All text displays in Indonesian consistently

**Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/app/page.tsx src/components/cards/PartnerCard.tsx
git commit -m "fix(i18n): standardize UI language to Indonesian

- Update navigation: Beranda, Partner, Tentang, Kontak
- Update CTA: Jadwalkan Kunjungan
- Update partner card: Lihat Detail
- Update homepage section titles

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Fix PartnerCard Mobile Touch Accessibility

**Files:**
- Modify: `src/components/cards/PartnerCard.tsx`
- Modify: `src/app/globals.css`

**Step 1: Make entire card clickable and show CTA on touch devices**

```tsx
// src/components/cards/PartnerCard.tsx - Wrap card in Link and add touch-friendly styles
import Link from "next/link";

export default function PartnerCard({
  name,
  slug,
  image,
  productCount,
  href,
}: PartnerCardProps) {
  const linkHref = href || `/partners/${slug}`;

  return (
    <Link href={linkHref} className="partner-card-link">
      <div
        className="hover overflow-hidden relative text-light text-center wow zoomIn rounded-2xl transition-all duration-300"
        data-wow-delay=".0s"
      >
        <div className="wow scaleIn overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} className="hover-scale-1-1 w-100" alt={name} />
        </div>
        <div className="abs w-100 h-100 px-4 hover-op-1 z-4 top-0 left-0 d-flex justify-content-center align-items-center partner-card-cta">
          <span
            className="btn-main btn-line btn-line-light fx-slide"
            data-hover="Lihat Detail"
          >
            <span>Lihat Detail</span>
          </span>
        </div>
        <div className="abs bg-blur z-2 top-0 w-100 h-100 hover-op-1"></div>
        <div
          className="abs z-3 bottom-0 w-100 h-60"
          style={{
            background:
              "linear-gradient(to top, #162d50 0%, rgba(22, 45, 80, 0.95) 40%, transparent 100%)",
          }}
        ></div>
        <div className="abs z-4 bottom-0 p-30 w-100 text-center hover-op-0">
          <div className="partner-card-info">
            <h3 className="partner-card-name">{name}</h3>
            <div className="partner-card-size">
              {productCount > 0 ? `${productCount} Proyek` : "Belum ada proyek"}
            </div>
          </div>
        </div>
        <div className="gradient-edge-bottom abs w-100 h-40 bottom-0 z-1"></div>
      </div>
    </Link>
  );
}
```

**Step 2: Add touch-friendly CSS**

```css
/* src/app/globals.css - Add after existing partner card styles */

/* Partner Card Link wrapper */
.partner-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* Show CTA on touch devices */
@media (hover: none) and (pointer: coarse) {
  .partner-card-cta {
    opacity: 1 !important;
  }

  .partner-card-cta .btn-main {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  .hover .abs-centered a,
  .hover .partner-card-cta span {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Step 3: Verify on mobile**

Run: `npm run dev` and test on mobile device or Chrome DevTools mobile emulation
Expected: CTA button visible on touch devices, entire card is clickable

**Step 4: Commit**

```bash
git add src/components/cards/PartnerCard.tsx src/app/globals.css
git commit -m "fix(partner-card): improve mobile touch accessibility

- Make entire card clickable as a link
- Show CTA button on touch devices (hover: none)
- Maintain hover behavior on desktop

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Fix N+1 Query in Partners Page

**Files:**
- Modify: `src/lib/db.ts`
- Modify: `src/app/partners/page.tsx`

**Step 1: Add optimized query function to db.ts**

```typescript
// src/lib/db.ts - Add new function after getPartners

export interface PartnerWithProductCount extends Partner {
  product_count: number;
}

export async function getPartnersWithProductCount(options?: {
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<PartnerWithProductCount[]> {
  const db = await getDB();
  let query = `
    SELECT p.*, COUNT(pr.id) as product_count
    FROM partners p
    LEFT JOIN products pr ON p.id = pr.partner_id AND pr.is_active = 1
    WHERE 1=1
  `;

  if (options?.activeOnly) query += " AND p.is_active = 1";
  if (options?.featuredOnly) query += " AND p.is_featured = 1";

  query += " GROUP BY p.id ORDER BY p.display_order ASC, p.name ASC";

  const result = await db.prepare(query).all<PartnerWithProductCount>();
  return result.results;
}
```

**Step 2: Update partners page to use optimized query**

```tsx
// src/app/partners/page.tsx - Replace entire file
import { getPartnersWithProductCount } from "@/lib/db";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";
import PartnersClient from "./PartnersClient";

export default async function PartnersPage() {
  let partnerCards: PartnerCardProps[] = [];
  let error: string | null = null;

  try {
    const partners = await getPartnersWithProductCount({ activeOnly: true });

    partnerCards = partners.map((partner) => ({
      name: partner.name,
      slug: partner.slug,
      image: partner.hero_image || "/images/misc/company-placeholder.webp",
      productCount: partner.product_count,
      href: `/partners/${partner.slug}`,
    }));
  } catch (err) {
    console.error("Failed to fetch partners:", err);
    error = "Gagal memuat data partner";
  }

  return <PartnersClient partnerCards={partnerCards} error={error} />;
}
```

**Step 3: Verify the optimization**

Run: `npm run build && npm run dev`
Expected: Partners page loads faster, single query instead of N+1

**Step 4: Commit**

```bash
git add src/lib/db.ts src/app/partners/page.tsx
git commit -m "perf(partners): optimize N+1 query with SQL JOIN

- Add getPartnersWithProductCount() with LEFT JOIN
- Replace N+1 individual product queries with single query
- Improves page load performance

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Fix Footer Issues

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Fix logo path and remove unused socialLinks**

```tsx
// src/components/layout/Footer.tsx - Update imports and data fetching
import Link from "next/link";
import Image from "next/image";
import { getCompanyInfo } from "@/lib/db";

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch company info from database (removed unused socialLinks)
  const companyInfo = await getCompanyInfo();

  const address = companyInfo?.address || "Perum Ungaran Asri, No C1, Ungaran";
  const phone = companyInfo?.whatsapp || companyInfo?.phone || "+62 812 3456 7890";
  const openingHours = companyInfo?.opening_hours || "Sen - Sab 08:00 - 17:00";
  const email = companyInfo?.email || "contact@4best.id";
  const instagram = "@4best.id";

  return (
    <footer className="section-dark footer-compact">
      <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
        <div className="text-center">
          <div className="footer-logo-wrapper">
            <Image
              src="/logo.svg"
              alt="4best Logo"
              width={150}
              height={50}
              className="logo-white footer-logo"
            />
          </div>
          {/* ... rest of footer unchanged ... */}
        </div>
        {/* ... rest unchanged ... */}
      </div>
    </footer>
  );
}
```

**Step 2: Verify the fix**

Run: `npm run build`
Expected: No warnings about unused imports, logo loads correctly on nested pages

**Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "fix(footer): fix logo path and remove unused query

- Change logo src from 'logo.svg' to '/logo.svg'
- Remove unused getSocialLinks import and call

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Fix Global CSS Section Override

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Remove risky section override**

The current override forces all sections to be visible, which can cause issues with conditionally hidden sections.

```css
/* src/app/globals.css - Remove lines 146-150 */
/* DELETE THIS BLOCK:
section {
  display: block !important;
  visibility: visible !important;
}
*/
```

**Step 2: Add more targeted fix if needed**

If specific sections need visibility override, target them specifically:

```css
/* src/app/globals.css - Add targeted override only where needed */
/* Ensure main content sections are visible (not hidden by template CSS) */
#section-contact,
#section-about,
#section-partners {
  display: block;
  visibility: visible;
}
```

**Step 3: Verify no visual regressions**

Run: `npm run dev` and check all pages
Expected: All sections display correctly, no hidden content issues

**Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "fix(css): remove risky global section override

- Remove blanket section display override
- Add targeted overrides for specific sections if needed
- Prevents unintended side effects with hidden sections

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Refactor Homepage Team Section to Use Team Component

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/Team.tsx`

**Step 1: Update Team component to accept custom subtitle/title**

The Team component already accepts these props, so we just need to use it.

**Step 2: Replace inline team section with Team component**

```tsx
// src/app/page.tsx - Replace team section (lines 62-107)
import {
  Hero,
  Overview,
  ValueProposition,
  PartnersGrid,
  Team,
} from "@/components/sections";
import { getTeamMembers } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teamMembers = await getTeamMembers({ activeOnly: true });

  return (
    <>
      <Hero
        title="Property Agency"
        address="Perum Ungaran Asri, No C1, Ungaran"
        mapUrl="https://maps.app.goo.gl/BSpMhDN2Z6Jgp9UL6"
        slides={[
          { image: "/images/slider/apt-1.webp", overlay: 0.4 },
          { image: "/images/slider/apt-2.webp", overlay: 0.4 },
        ]}
      />

      <Overview
        subtitle="4Best"
        title="Pilihan Tepat, Hasil Terbaik"
        description="4Best Agent Property adalah perusahaan agen properti profesional yang menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil. Didukung oleh tim berpengalaman, pemahaman pasar yang kuat, serta sistem kerja transparan, kami berkomitmen membantu klien mendapatkan solusi properti terbaik dan bernilai investasi jangka panjang."
        ctaText="Jadwalkan Kunjungan"
        ctaHref="/contact"
        images={[
          "/images/misc/s2.webp",
          "/images/misc/s3.webp",
          "/images/misc/s4.webp",
          "/images/misc/s5.webp",
        ]}
      />

      <PartnersGrid
        subtitle="Partner Kami"
        title="Partner Terpercaya"
        limit={4}
      />

      <ValueProposition />

      {teamMembers.length > 0 && (
        <Team
          subtitle="Tim Kami"
          title="Kenali Tim 4BEST"
          members={teamMembers}
        />
      )}
    </>
  );
}
```

**Step 3: Verify Team component renders correctly**

Run: `npm run dev`
Expected: Team section on homepage matches About page styling

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor(homepage): use Team component instead of inline markup

- Replace inline team section with reusable Team component
- Ensures consistent styling between homepage and about page
- Update CTA text to Indonesian

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Summary of Changes

| Task | Priority | Issue | Fix |
|------|----------|-------|-----|
| 1 | P1 | Contact page hardcoded data | Fetch from database |
| 2 | P1 | Mixed English/Indonesian | Standardize to Indonesian |
| 3 | P1 | Partner card hover-only CTA | Touch-friendly, full card clickable |
| 4 | P2 | N+1 query on partners page | SQL JOIN optimization |
| 5 | P2 | Footer logo path, unused query | Fix path, remove dead code |
| 6 | P2 | Risky global CSS override | Remove/target specifically |
| 7 | P2 | Inconsistent Team section | Use reusable component |

---

## Verification Checklist

After all tasks complete:

- [ ] `npm run build` succeeds without errors
- [ ] All pages load correctly in browser
- [ ] Contact page shows data from database
- [ ] All UI text is in Indonesian
- [ ] Partner cards work on mobile (touch)
- [ ] Partners page loads quickly (no N+1)
- [ ] Footer logo displays on all pages
- [ ] No hidden section issues
- [ ] Team section consistent across pages
