# Admin Content Pages Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 6 quality issues across admin content pages — CTA image upload, label translation, hero slides redundancy, component splitting, API validation, and save pattern consistency.

**Architecture:** Refactor the monolithic PageSectionsLiveEdit.tsx (~1900 lines) into focused sub-components in `src/components/admin/sections/`. Add Zod validation to admin API routes. Replace CTA text input with FileUpload. Standardize all UI text to Bahasa Indonesia. Add dirty-state indicator for unsaved changes.

**Tech Stack:** Next.js 15 App Router, TypeScript, shadcn/ui, Zod, Cloudflare R2 (upload), Lucide icons, sonner (toasts)

---

## Save Pattern Decision

The current hybrid approach is architecturally correct:
- **Image uploads** → auto-save (URL from R2 must persist immediately)
- **Mission CRUD** → auto-save per item (separate DB table, separate API)
- **Text fields** → manual save via "Simpan Perubahan" (batched writes)

The fix is NOT to change this architecture but to **make it visible** via:
1. A dirty-state indicator on the save button when unsaved text changes exist
2. Toast notifications clarifying what was auto-saved

---

### Task 1: Extract Shared Types & Helpers

**Files:**
- Create: `src/components/admin/sections/types.ts`
- Create: `src/components/admin/sections/mission-icons.ts`

**Step 1: Create shared types file**

```typescript
// src/components/admin/sections/types.ts
import type { PageSection, AboutPage, HeroSlide, Mission } from "@/lib/db";

export type { PageSection, AboutPage, HeroSlide, Mission };

export interface HeroContent {
  title: string;
  subtitle?: string;
  background_image?: string;
}

export interface OverviewContent {
  subtitle: string;
  title: string;
  description: string;
  cta_text: string;
  cta_href: string;
  images: string[];
}

export interface AboutFormData {
  intro_subtitle: string;
  intro_title: string;
  intro_description: string;
  intro_image_left: string;
  intro_image_right: string;
  vision_subtitle: string;
  vision_title: string;
  vision_text: string;
  mission_subtitle: string;
  mission_title: string;
}

export function parseContent<T>(
  pageSection: PageSection | undefined,
  defaultValue: T,
): T {
  if (!pageSection) return defaultValue;
  try {
    const parsed = JSON.parse(pageSection.content) as T;
    return { ...defaultValue, ...parsed };
  } catch {
    return defaultValue;
  }
}
```

**Step 2: Create mission icons file**

Extract `missionIconMap`, `defaultIconCycle`, `getMissionIcon`, and `iconPickerOptions` from PageSectionsLiveEdit.tsx (lines 1439–1870) into `src/components/admin/sections/mission-icons.ts`. This file contains all 18 lucide icon imports and mappings.

**Step 3: Commit**
```
feat: extract shared types and mission icons from PageSectionsLiveEdit
```

---

### Task 2: Extract Hero Components

**Files:**
- Create: `src/components/admin/sections/HeroPreview.tsx`
- Create: `src/components/admin/sections/HeroForm.tsx`

**Step 1: Extract HeroPreview**

Move lines 619–831 from `PageSectionsLiveEdit.tsx` into `HeroPreview.tsx`. It uses:
- `useState` (for `isUploading`)
- `FileUpload`, `FileUploadTrigger` from `@/components/ui/file-upload`
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Loader2`, `Eye`, `Upload` from lucide
- `toast` from sonner
- `HeroContent` from `./types`

The component signature stays the same:
```tsx
export default function HeroPreview({
  data, bgImage, variant, onBgImageChange
}: {
  data: HeroContent;
  bgImage: string;
  variant?: "home" | "parallax" | "default";
  onBgImageChange?: (url: string) => void;
})
```

**Step 2: Extract HeroForm**

Move lines 833–875 into `HeroForm.tsx`. Translate labels to Bahasa Indonesia at the same time:
- "Edit Hero" → "Edit Hero"  (keep, it's a section name)
- "Title" → "Judul"
- "Subtitle" → "Subjudul"

```tsx
export default function HeroForm({
  data, onChange, showSubtitle, titlePlaceholder, subtitlePlaceholder
}: {
  data: HeroContent;
  onChange: (data: HeroContent) => void;
  showSubtitle?: boolean;
  titlePlaceholder?: string;
  subtitlePlaceholder?: string;
})
```

**Step 3: Commit**
```
refactor: extract HeroPreview and HeroForm into separate files
```

---

### Task 3: Extract Overview Components

**Files:**
- Create: `src/components/admin/sections/OverviewPreview.tsx`
- Create: `src/components/admin/sections/OverviewForm.tsx`

**Step 1: Extract OverviewPreview**

Move lines 881–1064 into `OverviewPreview.tsx`. Uses FileUpload for inline image upload. Keep the staggered 2x2 grid layout that matches the actual landing page.

**Step 2: Extract OverviewForm**

Move lines 1066–1125 into `OverviewForm.tsx`. Translate labels:
- "Content" → "Konten"
- "Subtitle" → "Subjudul"
- "Title" → "Judul"
- "Description" → "Deskripsi"
- "Button Text" → "Teks Tombol"
- "Button Link" → "Link Tombol"

**Step 3: Commit**
```
refactor: extract OverviewPreview and OverviewForm into separate files
```

---

### Task 4: Extract About Section Components

**Files:**
- Create: `src/components/admin/sections/AboutPageSections.tsx`
- Create: `src/components/admin/sections/VisionMissionPreview.tsx`
- Create: `src/components/admin/sections/MissionItemsManager.tsx`
- Create: `src/components/admin/sections/MissionIconPicker.tsx`

**Step 1: Extract MissionIconPicker** (leaf component, no dependencies)

Move lines 1871–1933 into `MissionIconPicker.tsx`. Import `iconPickerOptions`, `defaultIconCycle`, `getMissionIcon` from `./mission-icons`.

**Step 2: Extract MissionItemsManager**

Move lines 1615–1844 into `MissionItemsManager.tsx`. Import `MissionIconPicker` from `./MissionIconPicker`. Uses `GripVertical`, `Plus`, `Trash2`, `Loader2`, `Switch`, `Textarea`, `Button`.

**Step 3: Extract VisionMissionPreview**

Move lines 1467–1609 into `VisionMissionPreview.tsx`. Import `getMissionIcon` from `./mission-icons`.

Translate labels at the same time:
- "Subtitle" → "Subjudul"
- "Title" → "Judul"
- "Vision Text" → "Teks Visi"

**Step 4: Extract AboutPageSections**

Move lines 1144–1433 into `AboutPageSections.tsx`. Import `VisionMissionPreview`, `MissionItemsManager` from siblings. Uses FileUpload for intro images.

Translate labels:
- "Edit Intro" → "Edit Intro"
- "Subtitle" → "Subjudul"
- "Title" → "Judul"
- "Description" → "Deskripsi"
- "Edit Visi" → "Edit Visi" (keep Indonesian)
- "Edit Misi Header" → "Edit Misi Header"

**Step 5: Create barrel export**

Create `src/components/admin/sections/index.ts`:
```typescript
export { default as HeroPreview } from "./HeroPreview";
export { default as HeroForm } from "./HeroForm";
export { default as OverviewPreview } from "./OverviewPreview";
export { default as OverviewForm } from "./OverviewForm";
export { default as AboutPageSections } from "./AboutPageSections";
export type { HeroContent, OverviewContent, AboutFormData } from "./types";
export { parseContent } from "./types";
```

**Step 6: Commit**
```
refactor: extract About, VisionMission, and Mission components
```

---

### Task 5: Slim Down Main PageSectionsLiveEdit

**Files:**
- Modify: `src/components/admin/PageSectionsLiveEdit.tsx`

**Step 1: Replace inline sub-components with imports**

The main file should shrink to ~350 lines. It keeps:
- All `useState` declarations for section data
- `savePageSection` and `saveAboutPage` helper functions
- `handleDeleteSlide` and `handleSlideUpload`
- `handleSaveCurrentTab` unified save
- Hero Slides inline grid (this is specific to beranda, not reusable)
- Conditional rendering per section
- Fixed save button with dirty-state indicator

Import everything else from `@/components/admin/sections`.

Remove unused imports: all 18 mission icons, `Popover*`, `Switch`, `GripVertical`, `Plus` — these are now used in extracted files.

**Step 2: Commit**
```
refactor: slim down PageSectionsLiveEdit to orchestrator-only
```

---

### Task 6: CTA Section — Add FileUpload for Background Image

**Files:**
- Modify: `src/components/admin/CTASectionLiveEdit.tsx`
- Delete: `src/components/admin/CTASectionForm.tsx` (redundant duplicate)

**Step 1: Add FileUpload to CTASectionLiveEdit**

Replace the background image text input:

```tsx
// Before:
<Label htmlFor="background_image">Background Image URL</Label>
<Input ... placeholder="https://..." />

// After: Upload dropzone in the preview card itself (same pattern as HeroPreview)
```

Add upload handler:
```tsx
const handleBgUpload = async (files: File[], options: { ... }) => {
  const file = files[0];
  if (!file) return;
  setIsUploadingBg(true);
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "backgrounds");
    formData.append("slug", "cta");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload gagal");
    const { url } = await res.json() as { url: string };
    setFormData(prev => ({ ...prev, background_image: url }));
    options.onSuccess(file);
    toast.success("Background berhasil diupload");
  } catch (err) { ... }
  finally { setIsUploadingBg(false); }
};
```

Wrap the preview with `FileUpload` + `FileUploadTrigger` so clicking the preview opens file picker. Add hover overlay "Ganti Background" matching HeroPreview pattern.

**Step 2: Translate CTA labels to Bahasa Indonesia**

- "Live Preview" → "Preview"
- "Content" → "Konten"
- "Subtitle" → "Subjudul"
- "Title" → "Judul"
- "Description" → "Deskripsi"
- "Background Image URL" → remove (replaced with upload)
- "Buttons" → "Tombol"
- "Primary Button Text" → "Teks Tombol Utama"
- "Primary Button Link" → "Link Tombol Utama"
- "Secondary Button Text" → "Teks Tombol Sekunder"
- "Secondary Button Link" → "Link Tombol Sekunder"
- "Save Changes" → "Simpan Perubahan"
- Page header "CTA Section" → "CTA Section"
- Page description → "Kelola section Call-to-Action yang ditampilkan di semua halaman"
- English placeholders → Indonesian

**Step 3: Delete CTASectionForm.tsx**

This file is a redundant duplicate of CTASectionLiveEdit with a slightly different layout. It's not imported anywhere that matters since the CTA page uses CTASectionLiveEdit.

Verify no imports reference it first:
```bash
grep -r "CTASectionForm" src/
```

**Step 4: Commit**
```
feat: add image upload to CTA section, translate labels to Indonesian
```

---

### Task 7: Translate HeroSlideForm Labels

**Files:**
- Modify: `src/components/admin/HeroSlideForm.tsx`

**Step 1: Translate all labels**

- "Slide Content" → "Konten Slide"
- "Page" → "Halaman"
- "Slide Image *" → "Gambar Slide *"
- "Title" → "Judul"
- "Subtitle" → "Subjudul"
- "Overlay Opacity (%)" → "Opacity Overlay (%)"
- "Overlay Preview" → "Preview Overlay"
- "Settings" → "Pengaturan"
- "Active" → "Aktif"
- "Display Order" → "Urutan Tampil"
- "Create Slide" → "Buat Slide"
- "Update Slide" → "Perbarui Slide"
- "Saving..." → "Menyimpan..."
- Select items: "Home" → "Beranda", "About" → "Tentang", "Partners" → "Partner", "Contact" → "Kontak"

**Step 2: Update redirect after save**

Currently redirects to `/admin/content/hero-slides`. Change to `/admin/content/beranda` since the standalone hero-slides page will be removed.

```tsx
router.push("/admin/content/beranda");
```

**Step 3: Commit**
```
style: translate HeroSlideForm labels to Indonesian
```

---

### Task 8: Remove Redundant Hero Slides List Page

**Files:**
- Modify: `src/app/admin/(dashboard)/content/hero-slides/page.tsx` → redirect
- Keep: `src/app/admin/(dashboard)/content/hero-slides/[id]/page.tsx` (edit page, referenced by inline edit buttons)
- Keep: `src/app/admin/(dashboard)/content/hero-slides/new/page.tsx` (not needed but harmless)
- Modify: `src/components/admin/AdminSidebar.tsx` → remove hero-slides from nav if it exists

**Step 1: Redirect hero-slides list to beranda**

```tsx
// src/app/admin/(dashboard)/content/hero-slides/page.tsx
import { redirect } from "next/navigation";
export default function HeroSlidesPage() {
  redirect("/admin/content/beranda");
}
```

**Step 2: Verify edit page link**

The inline hero slide edit button in PageSectionsLiveEdit links to:
```tsx
href={`/admin/content/hero-slides/${slide.id}/edit`}
```

But the actual route is `[id]/page.tsx` not `[id]/edit/page.tsx`. Check and fix if needed. The current route file is at:
```
src/app/admin/(dashboard)/content/hero-slides/[id]/page.tsx
```
This matches `/admin/content/hero-slides/[id]` not `/admin/content/hero-slides/[id]/edit`. Fix the Link href in PageSectionsLiveEdit to remove `/edit`.

**Step 3: Commit**
```
refactor: redirect hero-slides list page, fix edit link
```

---

### Task 9: Add Zod Validation to API Routes

**Files:**
- Modify: `src/app/api/admin/page-sections/route.ts`
- Modify: `src/app/api/admin/cta-section/route.ts`
- Modify: `src/app/api/admin/about-page/route.ts` (if exists, check first)

**Step 1: Add Zod schema for page-sections PUT**

```typescript
import { z } from "zod";

const heroContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  background_image: z.string().optional(),
});

const overviewContentSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  cta_text: z.string(),
  cta_href: z.string(),
  images: z.array(z.string()).length(4),
});

const pageSectionUpdateSchema = z.object({
  page_slug: z.string().min(1),
  section_key: z.string().min(1),
  content: z.string().min(1).refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: "content must be valid JSON" }),
});

// In PUT handler:
const parsed = pageSectionUpdateSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { error: parsed.error.errors[0].message },
    { status: 400 }
  );
}
```

**Step 2: Add Zod schema for cta-section PUT**

```typescript
const ctaSectionSchema = z.object({
  subtitle: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  primary_button_text: z.string().optional(),
  primary_button_href: z.string().optional(),
  secondary_button_text: z.string().optional(),
  secondary_button_href: z.string().optional(),
  background_image: z.string().optional(),
});
```

**Step 3: Add Zod schema for about-page PUT** (check file first)

Similar pattern — validate that incoming fields match expected `AboutPage` columns.

**Step 4: Commit**
```
feat: add Zod validation to page-sections, cta-section, about-page APIs
```

---

### Task 10: Add Dirty-State Indicator to Save Button

**Files:**
- Modify: `src/components/admin/PageSectionsLiveEdit.tsx`

**Step 1: Track dirty state**

Add refs to store initial values, compare with current state:

```tsx
const initialDataRef = useRef({
  homeHero: homeHeroData,
  overview: overviewData,
  partnerHero: partnerHeroData,
  contactHero: contactHeroData,
  aboutHero: aboutHeroData,
  aboutForm: aboutFormData,
});

const isDirty = useMemo(() => {
  switch (section) {
    case "beranda":
      return JSON.stringify(homeHeroData) !== JSON.stringify(initialDataRef.current.homeHero)
        || JSON.stringify(overviewData) !== JSON.stringify(initialDataRef.current.overview);
    case "partner":
      return JSON.stringify(partnerHeroData) !== JSON.stringify(initialDataRef.current.partnerHero);
    case "tentang":
      return JSON.stringify(aboutHeroData) !== JSON.stringify(initialDataRef.current.aboutHero)
        || JSON.stringify(aboutFormData) !== JSON.stringify(initialDataRef.current.aboutForm);
    case "kontak":
      return JSON.stringify(contactHeroData) !== JSON.stringify(initialDataRef.current.contactHero);
    default:
      return false;
  }
}, [section, homeHeroData, overviewData, partnerHeroData, contactHeroData, aboutHeroData, aboutFormData]);
```

**Step 2: Update save button visual**

```tsx
<div className={cn(
  "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 md:left-[var(--sidebar-width,256px)] flex justify-center px-4",
  isDirty ? "bg-amber-50/95 border-amber-200" : "bg-background/95"
)}>
  <Button
    onClick={handleSaveCurrentTab}
    disabled={isLoading === "save-tab" || !isDirty}
    className="w-full max-w-md"
    variant={isDirty ? "default" : "outline"}
  >
    {isLoading === "save-tab" ? (
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
```

**Step 3: Reset dirty state after successful save**

After `setSuccess(...)` in `handleSaveCurrentTab`, update the ref:
```tsx
initialDataRef.current = {
  ...initialDataRef.current,
  ...(section === "beranda" && { homeHero: homeHeroData, overview: overviewData }),
  ...(section === "partner" && { partnerHero: partnerHeroData }),
  ...(section === "tentang" && { aboutHero: aboutHeroData, aboutForm: aboutFormData }),
  ...(section === "kontak" && { contactHero: contactHeroData }),
};
```

**Step 4: Commit**
```
feat: add dirty-state indicator to save button
```

---

### Task 11: CTA Section — Add Fixed Save Button Pattern

**Files:**
- Modify: `src/components/admin/CTASectionLiveEdit.tsx`

**Step 1: Replace form submit button with fixed bottom bar**

Match the pattern used in PageSectionsLiveEdit — fixed bottom save button instead of inline form submit:

```tsx
{/* Remove the inline <Button type="submit"> */}

{/* Add fixed save button at the end of the component */}
<div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t p-3 md:left-[var(--sidebar-width,256px)] flex justify-center px-4">
  <Button onClick={handleSubmit} disabled={isLoading} className="w-full max-w-md">
    ...
  </Button>
</div>
<div className="h-16" />
```

Change the `<form onSubmit>` to a `<div>` since the fixed button won't be inside the form.

**Step 2: Commit**
```
style: add fixed save button to CTA section page
```

---

## Execution Order Summary

| Task | Description | Depends On |
|------|-------------|------------|
| 1 | Extract shared types & mission icons | — |
| 2 | Extract Hero components | Task 1 |
| 3 | Extract Overview components | Task 1 |
| 4 | Extract About/Mission components | Task 1 |
| 5 | Slim down main PageSectionsLiveEdit | Tasks 2–4 |
| 6 | CTA FileUpload + translate labels | — |
| 7 | Translate HeroSlideForm labels | — |
| 8 | Remove hero-slides list page | Task 7 |
| 9 | Add Zod validation to APIs | — |
| 10 | Add dirty-state indicator | Task 5 |
| 11 | CTA fixed save button | Task 6 |

Tasks 1–5 are sequential (component split). Tasks 6, 7, 9 can run in parallel with each other. Tasks 8, 10, 11 depend on their prerequisites.
