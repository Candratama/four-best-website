# Admin Settings Pages Improvements

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all UI/UX and backend issues across the three admin settings pages (Site Settings, Company Info, Social Links) to match the quality and consistency of the already-improved content pages.

**Architecture:** Each settings form gets the same treatment: translate labels to Indonesian, replace text URL inputs with `ImageUploadField`, add dirty-state tracking via `useRef`/`useMemo`, replace inline submit with fixed bottom save button, switch from inline error/success banners to `toast()`. API routes get Zod validation. Social Links list page gets a working delete button.

**Tech Stack:** Next.js 15, TypeScript, shadcn/ui, Zod, sonner toast, `ImageUploadField` component, `cn()` utility

---

## Revised Issue List

| # | Issue | Files |
|---|---|---|
| 1 | Translate all labels to Indonesian | 3 forms + 3 pages + sidebar |
| 2 | Add Zod validation to API routes | 3 API route files |
| 3 | Logo & Favicon: replace text input with `ImageUploadField` | `SiteSettingsForm.tsx` |
| 4 | Add dirty-state + fixed save button + toast (all 3 forms) | 3 form components |
| 5 | Social Links delete button non-functional | `social/page.tsx` |
| 6 | ~~Social links [id] route missing~~ | **EXISTS** — has GET/PUT/DELETE |
| 7 | Color picker: add native `<input type="color">` | `SiteSettingsForm.tsx` |

---

### Task 1: Translate AdminSidebar settings labels

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx:104-117`

**Step 1: Update sidebar labels**

Change the Settings group labels from English to Indonesian:

```tsx
// Line ~104
title: "Pengaturan",
// Line ~107
label: "Pengaturan Situs",
// Line ~112
label: "Info Perusahaan",
// Line ~117
label: "Media Sosial",
```

**Step 2: Verify**

Run: `npx next lint --quiet`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx
git commit -m "style: translate settings sidebar labels to Indonesian"
```

---

### Task 2: Translate settings page headers

**Files:**
- Modify: `src/app/admin/(dashboard)/settings/site/page.tsx`
- Modify: `src/app/admin/(dashboard)/settings/company/page.tsx`
- Modify: `src/app/admin/(dashboard)/settings/social/page.tsx`
- Modify: `src/app/admin/(dashboard)/settings/social/new/page.tsx`
- Modify: `src/app/admin/(dashboard)/settings/social/[id]/page.tsx`

**Step 1: Translate site page header**

```tsx
// site/page.tsx
<h1 className="text-3xl font-bold tracking-tight">Pengaturan Situs</h1>
<p className="text-muted-foreground">
  Kelola branding dan tampilan website Anda
</p>
```

**Step 2: Translate company page header**

```tsx
// company/page.tsx
<h1 className="text-3xl font-bold tracking-tight">Info Perusahaan</h1>
<p className="text-muted-foreground">
  Kelola informasi kontak perusahaan (ditampilkan di footer dan halaman kontak)
</p>
```

**Step 3: Translate social pages**

```tsx
// social/page.tsx
<h1 className="text-3xl font-bold tracking-tight">Media Sosial</h1>
<p className="text-muted-foreground">
  Kelola tautan media sosial (ditampilkan di footer)
</p>
// Button:
<Plus className="mr-2 h-4 w-4" />
Tambah Media Sosial

// Card header:
<CardTitle>Akun Media Sosial</CardTitle>
<CardDescription>Tautan ke profil media sosial Anda</CardDescription>

// Badge:
{link.is_active ? "Aktif" : "Nonaktif"}

// Empty state:
<h3 className="text-lg font-medium">Belum ada media sosial</h3>
<p className="text-muted-foreground mb-4">
  Tambahkan profil media sosial Anda
</p>
// Button:
Tambah Media Sosial
```

```tsx
// social/new/page.tsx
<h1 className="text-3xl font-bold">Tambah Media Sosial</h1>
```

```tsx
// social/[id]/page.tsx
<h1 className="text-3xl font-bold">Edit Media Sosial</h1>
```

**Step 4: Commit**

```bash
git add src/app/admin/\(dashboard\)/settings/
git commit -m "style: translate settings page headers to Indonesian"
```

---

### Task 3: Rewrite SiteSettingsForm — FileUpload, color picker, dirty-state, toast, translate

**Files:**
- Modify: `src/components/admin/SiteSettingsForm.tsx`

**Step 1: Full rewrite**

Replace the entire component. Key changes:
- Import `useRef`, `useMemo` for dirty-state
- Import `ImageUploadField` for logo/favicon
- Import `toast` from sonner, remove inline `error`/`success` state
- Import `cn` from utils
- Add `<input type="color">` for color fields
- Translate all labels to Indonesian
- Replace `<form onSubmit>` with `<div>` + `handleSubmit()` from fixed button
- Add fixed bottom save button with dirty-state indicator

```tsx
"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/db";

interface SiteSettingsFormProps {
  settings: SiteSettings | null;
}

export default function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: settings?.name || "",
    tagline: settings?.tagline || "",
    logo: settings?.logo || "",
    favicon: settings?.favicon || "",
    primary_color: settings?.primary_color || "#162d50",
    secondary_color: settings?.secondary_color || "#0056d6",
  });

  // Dirty-state tracking
  const initialDataRef = useRef(formData);
  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialDataRef.current),
    [formData],
  );

  const handleSubmit = async () => {
    setIsLoading("save");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Gagal menyimpan pengaturan");
      }
      initialDataRef.current = formData;
      toast.success("Pengaturan berhasil disimpan!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Branding</CardTitle>
          </div>
          <CardDescription>
            Atur nama situs, logo, dan warna
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Situs</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="4best"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tagline: e.target.value }))
                }
                placeholder="Property Agent"
              />
            </div>
          </div>

          {/* Logo & Favicon with ImageUploadField */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadField
              value={formData.logo}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, logo: url }))
              }
              onRemove={() =>
                setFormData((prev) => ({ ...prev, logo: "" }))
              }
              category="branding"
              slug="logo"
              label="Logo"
              aspectRatio="3/1"
              maxSizeMB={2}
            />
            <ImageUploadField
              value={formData.favicon}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, favicon: url }))
              }
              onRemove={() =>
                setFormData((prev) => ({ ...prev, favicon: "" }))
              }
              category="branding"
              slug="favicon"
              label="Favicon"
              aspectRatio="1/1"
              maxSizeMB={1}
            />
          </div>

          {/* Color pickers with native input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Warna Utama</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  placeholder="#162d50"
                />
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  className="w-10 h-10 rounded border cursor-pointer shrink-0 p-0.5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Warna Sekunder</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary_color"
                  value={formData.secondary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondary_color: e.target.value,
                    }))
                  }
                  placeholder="#0056d6"
                />
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondary_color: e.target.value,
                    }))
                  }
                  className="w-10 h-10 rounded border cursor-pointer shrink-0 p-0.5"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed save button */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 md:left-[var(--sidebar-width,256px)] flex justify-center px-4",
          isDirty ? "bg-amber-50/95 border-amber-200" : "bg-background/95",
        )}
      >
        <Button
          onClick={handleSubmit}
          disabled={isLoading === "save" || !isDirty}
          className="w-full max-w-md"
          variant={isDirty ? "default" : "outline"}
        >
          {isLoading === "save" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : isDirty ? (
            "Simpan Perubahan"
          ) : (
            "Tidak Ada Perubahan"
          )}
        </Button>
      </div>
      <div className="h-16" />
    </div>
  );
}
```

**Step 2: Verify**

Run: `npx next lint --quiet`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/admin/SiteSettingsForm.tsx
git commit -m "feat: rewrite SiteSettingsForm with FileUpload, color picker, dirty-state, Indonesian labels"
```

---

### Task 4: Rewrite CompanyInfoForm — dirty-state, toast, translate

**Files:**
- Modify: `src/components/admin/CompanyInfoForm.tsx`

**Step 1: Full rewrite**

Key changes:
- Import `useRef`, `useMemo` for dirty-state
- Import `toast` from sonner, remove inline `error`/`success` state
- Import `cn` from utils
- Translate all form labels to Indonesian
- Replace `<form onSubmit>` with `handleSubmit()` from fixed button
- Add fixed bottom save button with dirty-state indicator
- Keep preview section unchanged (already Indonesian)

Translate these labels:
- "Contact Information" → "Informasi Kontak"
- "This information is displayed..." → "Informasi ini ditampilkan di footer dan halaman kontak"
- "Address" → "Alamat"
- "Phone Number" → "Nomor Telepon"
- "WhatsApp Number" → "Nomor WhatsApp"
- "Email Address" → "Alamat Email"
- "Opening Hours" → "Jam Operasional"
- "Google Maps Embed URL" → "URL Embed Google Maps"
- "Paste the embed URL..." → "Tempel URL embed dari Google Maps (Bagikan → Sematkan peta)"
- "Save Changes" → fixed save button
- "Saving..." → "Menyimpan..."
- "Company info saved successfully!" → `toast.success("Info perusahaan berhasil disimpan!")`

Pattern: same as SiteSettingsForm (useRef + useMemo + fixed button + toast).

**Step 2: Verify**

Run: `npx next lint --quiet`

**Step 3: Commit**

```bash
git add src/components/admin/CompanyInfoForm.tsx
git commit -m "feat: rewrite CompanyInfoForm with dirty-state, toast, Indonesian labels"
```

---

### Task 5: Rewrite SocialLinkForm — dirty-state, toast, translate

**Files:**
- Modify: `src/components/admin/SocialLinkForm.tsx`

**Step 1: Full rewrite**

Key changes:
- Import `toast` from sonner, remove inline `error` state
- Translate all labels:
  - "Social Link Details" → "Detail Media Sosial"
  - "Platform *" → "Platform *"
  - "Select platform" → "Pilih platform"
  - "URL *" → "URL *"
  - "Custom Icon (optional)" → "Ikon Kustom (opsional)"
  - "Leave empty to use default icon" → "Kosongkan untuk menggunakan ikon default"
  - "No URL set" → "URL belum diisi"
  - "Preview" → "Preview"
  - "Settings" → "Pengaturan"
  - "Active" → "Aktif"
  - "Display Order" → "Urutan Tampil"
  - "Saving..." → "Menyimpan..."
  - "Create Social Link" → "Buat Media Sosial"
  - "Update Social Link" → "Perbarui Media Sosial"
- Replace `setError` with `toast.error`
- Replace success redirect message with `toast.success`

Note: This form uses redirect after save (not fixed button), so keep inline submit but translate it and use toast for errors.

**Step 2: Verify**

Run: `npx next lint --quiet`

**Step 3: Commit**

```bash
git add src/components/admin/SocialLinkForm.tsx
git commit -m "feat: translate SocialLinkForm labels to Indonesian, switch to toast"
```

---

### Task 6: Fix Social Links delete button + translate list page

**Files:**
- Modify: `src/app/admin/(dashboard)/settings/social/page.tsx`

**Step 1: Convert to client component for delete functionality**

The social links page needs an onClick handler for delete. Since it's currently a Server Component, we have two options:
- Option A: Extract a small client component for the delete button
- Option B: Convert the whole page to use a client wrapper

**Go with Option A** — create a minimal inline client delete button:

Add `"use client"` wrapper component `SocialLinksClient` that receives `socialLinks` as prop and handles delete.

Actually, simpler approach: keep the page as server component but extract the list into a client component file.

Create `src/components/admin/SocialLinksList.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Plus, Edit, Trash2, Loader2, Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { SocialLink } from "@/lib/db";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function SocialLinksList({ socialLinks }: { socialLinks: SocialLink[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus media sosial ini?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/social-links/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Gagal menghapus");
      }
      toast.success("Media sosial berhasil dihapus");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <CardTitle>Akun Media Sosial</CardTitle>
        </div>
        <CardDescription>
          Tautan ke profil media sosial Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {socialLinks.length > 0 ? (
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const PlatformIcon = platformIcons[link.platform.toLowerCase()] || Share2;
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <PlatformIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{link.platform}</span>
                        <Badge variant={link.is_active ? "default" : "secondary"}>
                          {link.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/settings/social/${link.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                    >
                      {deletingId === link.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Belum ada media sosial</h3>
            <p className="text-muted-foreground mb-4">
              Tambahkan profil media sosial Anda
            </p>
            <Button asChild>
              <Link href="/admin/settings/social/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Media Sosial
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

Then update `social/page.tsx` to use this client component:

```tsx
import { getSocialLinks } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import SocialLinksList from "@/components/admin/SocialLinksList";

export const dynamic = "force-dynamic";

export default async function SocialLinksPage() {
  const socialLinks = await getSocialLinks({ activeOnly: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Sosial</h1>
          <p className="text-muted-foreground">
            Kelola tautan media sosial (ditampilkan di footer)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/settings/social/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Media Sosial
          </Link>
        </Button>
      </div>

      <SocialLinksList socialLinks={socialLinks} />
    </div>
  );
}
```

**Step 2: Verify**

Run: `npx next lint --quiet`

**Step 3: Commit**

```bash
git add src/components/admin/SocialLinksList.tsx src/app/admin/\(dashboard\)/settings/social/page.tsx
git commit -m "feat: extract SocialLinksList with working delete, translate to Indonesian"
```

---

### Task 7: Add Zod validation to settings API routes

**Files:**
- Modify: `src/app/api/admin/site-settings/route.ts`
- Modify: `src/app/api/admin/company-info/route.ts`
- Modify: `src/app/api/admin/social-links/route.ts`
- Modify: `src/app/api/admin/social-links/[id]/route.ts`

**Step 1: site-settings — add Zod**

```tsx
import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";
import { z } from "zod";

const siteSettingsSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format warna tidak valid").optional(),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format warna tidak valid").optional(),
});

// GET stays the same...

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = siteSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    await updateSiteSettings(result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
```

**Step 2: company-info — add Zod**

```tsx
const companyInfoSchema = z.object({
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  opening_hours: z.string().optional(),
  map_url: z.string().optional(),
});
```

Same `safeParse` pattern in PUT handler.

**Step 3: social-links POST — add Zod**

```tsx
const createSocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform wajib diisi"),
  url: z.string().url("URL tidak valid"),
  icon: z.string().optional(),
  is_active: z.number().int().min(0).max(1).optional().default(1),
  display_order: z.number().int().optional().default(0),
});
```

**Step 4: social-links/[id] PUT — add Zod**

```tsx
const updateSocialLinkSchema = z.object({
  platform: z.string().min(1).optional(),
  url: z.string().url("URL tidak valid").optional(),
  icon: z.string().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
  display_order: z.number().int().optional(),
});
```

Same `safeParse` pattern. DELETE handler stays unchanged (no body to validate).

**Step 5: Verify**

Run: `npx next lint --quiet`

**Step 6: Commit**

```bash
git add src/app/api/admin/site-settings/route.ts src/app/api/admin/company-info/route.ts src/app/api/admin/social-links/route.ts src/app/api/admin/social-links/\[id\]/route.ts
git commit -m "feat: add Zod validation to settings API routes"
```

---

## Task Dependency Order

```
Task 1 (sidebar labels) ─── independent
Task 2 (page headers)   ─── independent
Task 3 (SiteSettingsForm) ─ independent
Task 4 (CompanyInfoForm)  ─ independent
Task 5 (SocialLinkForm)  ─── independent
Task 6 (SocialLinksList) ─── independent
Task 7 (API Zod)         ─── independent
```

All tasks are independent and can be executed in any order or in parallel.
