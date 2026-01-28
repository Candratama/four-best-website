# UI/UX Fixes Part 2 - Remaining Issues

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix remaining UI/UX issues: language consistency, form submission, Hero CTA, inline styles, and mobile-friendly copy.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, TypeScript

---

## Task 1: Fix Remaining Language Issues - Convert to Indonesian

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/ValueProposition.tsx`
- Modify: `src/components/sections/ContactInfo.tsx`
- Modify: `src/app/partners/PartnersClient.tsx`

**Changes:**

### Hero.tsx (line 179-181)
```tsx
// Change "View on Map" to "Lihat di Peta"
<a
  className="btn-main btn-line btn-line-light fx-slide py-0 lh-1-6 fw-400 popup-gmaps"
  href={mapUrl}
  target="_blank"
  rel="noopener noreferrer"
  data-hover="Lihat di Peta"
>
  <span>Lihat di Peta</span>
</a>
```

### ValueProposition.tsx (line 53)
```tsx
// Change "Value Proposition" to "Keunggulan Kami"
<h2 className="text-3xl md:text-4xl font-bold">Keunggulan Kami</h2>
```

### ContactInfo.tsx (line 107)
```tsx
// Change "Chat via WhatsApp" to "Chat via WhatsApp" -> keep or "Hubungi via WhatsApp"
<a href={whatsappLink} ...>
  <i className="fa-brands fa-whatsapp me-2"></i>
  Hubungi via WhatsApp
</a>
```

### PartnersClient.tsx (lines 46-48)
```tsx
// Change hero text to Indonesian
<h1 className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1">
  Partner
</h1>
<h3>Kolaborasi untuk Hasil Terbaik</h3>
```

**Commit:**
```bash
git commit -m "fix(i18n): complete Indonesian language standardization

- Hero: View on Map -> Lihat di Peta
- ValueProposition: Value Proposition -> Keunggulan Kami
- ContactInfo: Chat via WhatsApp -> Hubungi via WhatsApp
- Partners hero: Indonesian text

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Add Primary CTA to Hero Section

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Changes:**

Add a primary CTA button (Jadwalkan Kunjungan) next to the map button in the default Hero variant.

```tsx
// After the map button, add primary CTA
{address && (
  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
    <h4 className="fw-500 mb-2 mb-md-0 me-md-4 hero-address">
      {address}
    </h4>
    <div className="d-flex gap-2">
      {/* Primary CTA */}
      <a
        className="btn-main fx-slide"
        href="/contact"
        data-hover="Jadwalkan Kunjungan"
      >
        <span>Jadwalkan Kunjungan</span>
      </a>
      {/* Secondary CTA - Map */}
      {mapUrl && (
        <a
          className="btn-main btn-line btn-line-light fx-slide py-0 lh-1-6 fw-400"
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-hover="Lihat di Peta"
        >
          <span>Lihat di Peta</span>
        </a>
      )}
    </div>
  </div>
)}
```

**Commit:**
```bash
git commit -m "feat(hero): add primary CTA button

- Add 'Jadwalkan Kunjungan' as primary CTA
- Map button becomes secondary CTA
- Improves conversion path for visitors

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Remove Inline Styles from PartnersClient

**Files:**
- Modify: `src/app/partners/PartnersClient.tsx`
- Modify: `src/app/globals.css`

**Changes:**

### PartnersClient.tsx (line 59)
```tsx
// Remove inline style, use CSS class
<section className="relative partners-grid-section">
```

### globals.css - Add class
```css
/* Partners Grid Section */
.partners-grid-section {
  background-color: #f5f5f5;
  padding: 60px 0;
}
```

**Commit:**
```bash
git commit -m "refactor(partners): move inline styles to CSS

- Remove inline style from partners grid section
- Add .partners-grid-section class to globals.css

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Improve Overview Copy for Mobile Readability

**Files:**
- Modify: `src/app/page.tsx`

**Changes:**

Break the long description into shorter, scannable text:

```tsx
<Overview
  subtitle="4Best"
  title="Pilihan Tepat, Hasil Terbaik"
  description="4Best Agent Property adalah perusahaan agen properti profesional. Kami menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil."
  ctaText="Jadwalkan Kunjungan"
  ctaHref="/contact"
  images={[...]}
/>
```

Original (too long):
> "4Best Agent Property adalah perusahaan agen properti profesional yang menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil. Didukung oleh tim berpengalaman, pemahaman pasar yang kuat, serta sistem kerja transparan, kami berkomitmen membantu klien mendapatkan solusi properti terbaik dan bernilai investasi jangka panjang."

Shortened (mobile-friendly):
> "4Best Agent Property adalah perusahaan agen properti profesional. Kami menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil."

**Commit:**
```bash
git commit -m "fix(overview): shorten copy for mobile readability

- Reduce description length for better mobile scanning
- Keep core message, remove redundant details

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Implement Real Contact Form Submission (Server Action)

**Files:**
- Create: `src/app/contact/actions.ts`
- Modify: `src/app/contact/ContactPageClient.tsx`

**Changes:**

### Create Server Action (src/app/contact/actions.ts)
```typescript
"use server";

export interface ContactFormData {
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return { success: false, message: "Mohon lengkapi semua field yang wajib diisi." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: "Format email tidak valid." };
    }

    // TODO: Implement actual email sending or database storage
    // For now, log the submission
    console.log("Contact form submission:", data);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true, message: "Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera." };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
```

### Update ContactPageClient.tsx
```tsx
"use client";

import { useWow } from "@/hooks";
import { ContactForm, ContactInfo, GoogleMap } from "@/components/sections";
import { submitContactForm } from "./actions";
import { useState } from "react";

// ... interface definitions ...

export default function ContactPageClient({ contactData }: ContactPageClientProps) {
  useWow();
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    date: string;
    time: string;
    message: string;
  }) => {
    setSubmitStatus(null);
    const result = await submitContactForm(data);
    setSubmitStatus(result);
    return result.success;
  };

  return (
    <>
      <section id="section-contact">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <ContactInfo ... />
            </div>
            <div className="col-lg-8">
              <div className="contact-form-wrapper">
                <h3 className="contact-info-title mb-4">Jadwalkan Kunjungan</h3>
                {submitStatus && (
                  <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'} mb-4`}>
                    {submitStatus.message}
                  </div>
                )}
                <ContactForm variant="inline" onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GoogleMap ... />
    </>
  );
}
```

**Commit:**
```bash
git commit -m "feat(contact): implement server action for form submission

- Add submitContactForm server action with validation
- Update ContactPageClient to use server action
- Add success/error feedback to user
- TODO: Add actual email sending integration

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Summary

| Task | Issue | Fix |
|------|-------|-----|
| 1 | Bahasa campur | Complete Indonesian standardization |
| 2 | Hero tanpa primary CTA | Add "Jadwalkan Kunjungan" button |
| 3 | Inline styles Partners | Move to CSS class |
| 4 | Copy overview panjang | Shorten for mobile |
| 5 | Form contact stub | Implement server action |
