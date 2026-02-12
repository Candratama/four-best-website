"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Edit,
  Trash2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import type { PageSection, AboutPage, HeroSlide, Mission } from "@/lib/db";
import {
  HeroPreview,
  HeroForm,
  OverviewPreview,
  OverviewForm,
  AboutPageSections,
  parseContent,
} from "@/components/admin/sections";
import type { HeroContent, OverviewContent, AboutFormData } from "@/components/admin/sections";

// ============================================
// Types
// ============================================

interface PageSectionsLiveEditProps {
  section: "beranda" | "partner" | "tentang" | "kontak";
  homeSections: PageSection[];
  partnerSections: PageSection[];
  contactSections: PageSection[];
  aboutSections: PageSection[];
  aboutData: AboutPage | null;
  heroSlides: HeroSlide[];
  missions: Mission[];
}

// ============================================
// Main Component
// ============================================

export default function PageSectionsLiveEdit({
  section,
  homeSections,
  partnerSections,
  contactSections,
  aboutSections,
  aboutData,
  heroSlides,
  missions: initialMissions,
}: PageSectionsLiveEditProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Find sections by key
  const homeHero = homeSections.find((s) => s.section_key === "hero");
  const homeOverview = homeSections.find((s) => s.section_key === "overview");
  const partnerHero = partnerSections.find((s) => s.section_key === "hero");
  const contactHero = contactSections.find((s) => s.section_key === "hero");
  const aboutHero = aboutSections.find((s) => s.section_key === "hero");

  // Default values
  const defaultHero: HeroContent = {
    title: "",
    subtitle: "",
    background_image: "",
  };
  const defaultOverview: OverviewContent = {
    subtitle: "4Best",
    title: "Pilihan Tepat, Hasil Terbaik",
    description:
      "4Best Agent Property adalah perusahaan agen properti profesional.",
    cta_text: "Hubungi Kami",
    cta_href: "/contact",
    images: ["", "", "", ""],
  };

  // State for each section
  const [homeHeroData, setHomeHeroData] = useState<HeroContent>(
    parseContent(homeHero, {
      ...defaultHero,
      title: "Property Agency",
      subtitle:
        "Perum Ungaran Asri JL. Serasi Raya Atas No C1, Ungaran, Kab. Semarang",
    }),
  );
  const [overviewData, setOverviewData] = useState<OverviewContent>(
    parseContent(homeOverview, defaultOverview),
  );
  const [partnerHeroData, setPartnerHeroData] = useState<HeroContent>(
    parseContent(partnerHero, {
      ...defaultHero,
      title: "Partner Kami",
      subtitle: "Developer Terpercaya",
    }),
  );
  const [contactHeroData, setContactHeroData] = useState<HeroContent>(
    parseContent(contactHero, {
      ...defaultHero,
      title: "Hubungi Kami",
      subtitle: "Kami Siap Membantu Anda!",
    }),
  );
  const [aboutHeroData, setAboutHeroData] = useState<HeroContent>(
    parseContent(aboutHero, {
      ...defaultHero,
      title: aboutData?.hero_title || "Tentang 4BEST",
      subtitle: aboutData?.hero_subtitle || "Pilihan Tepat, Hasil Terbaik",
      background_image: aboutData?.hero_background_image || "",
    }),
  );
  const [aboutFormData, setAboutFormData] = useState<AboutFormData>({
    intro_subtitle: aboutData?.intro_subtitle || "Tentang Kami",
    intro_title: aboutData?.intro_title || "4Best Agent Property",
    intro_description: aboutData?.intro_description || "",
    intro_image_left: aboutData?.intro_image_left || "",
    intro_image_right: aboutData?.intro_image_right || "",
    vision_subtitle: aboutData?.vision_subtitle || "Visi Kami",
    vision_title: aboutData?.vision_title || "Menjadi yang Terdepan",
    vision_text: aboutData?.vision_text || "",
    mission_subtitle: aboutData?.mission_subtitle || "Misi Kami",
    mission_title: aboutData?.mission_title || "Komitmen untuk Hasil Terbaik",
  });

  // Dirty state tracking
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
        return (
          JSON.stringify(homeHeroData) !==
            JSON.stringify(initialDataRef.current.homeHero) ||
          JSON.stringify(overviewData) !==
            JSON.stringify(initialDataRef.current.overview)
        );
      case "partner":
        return (
          JSON.stringify(partnerHeroData) !==
          JSON.stringify(initialDataRef.current.partnerHero)
        );
      case "tentang":
        return (
          JSON.stringify(aboutHeroData) !==
            JSON.stringify(initialDataRef.current.aboutHero) ||
          JSON.stringify(aboutFormData) !==
            JSON.stringify(initialDataRef.current.aboutForm)
        );
      case "kontak":
        return (
          JSON.stringify(contactHeroData) !==
          JSON.stringify(initialDataRef.current.contactHero)
        );
      default:
        return false;
    }
  }, [
    section,
    homeHeroData,
    overviewData,
    partnerHeroData,
    contactHeroData,
    aboutHeroData,
    aboutFormData,
  ]);

  // Save page section
  const savePageSection = async (
    pageSlug: string,
    sectionKey: string,
    content: object,
  ) => {
    const res = await fetch("/api/admin/page-sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_slug: pageSlug,
        section_key: sectionKey,
        content: JSON.stringify(content),
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error || "Failed to save section");
    }
  };

  // Delete hero slide
  const handleDeleteSlide = async (slideId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slide ini?")) return;

    setIsLoading(`delete-slide-${slideId}`);
    setError(null);

    try {
      const res = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Failed to delete slide");
      }

      setSuccess("Slide berhasil dihapus!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  // Upload and create hero slide
  const [slideUploadFiles, setSlideUploadFiles] = useState<File[]>([]);

  const handleSlideUpload = async (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    const file = files[0];
    if (!file) return;

    setIsLoading("upload-slide");

    try {
      // 1. Upload image to R2
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "slider");
      formData.append("slug", `slide-${Date.now()}`);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = (await uploadRes.json()) as { error?: string };
        throw new Error(data.error || "Upload gagal");
      }

      const { url } = (await uploadRes.json()) as { url: string };
      options.onProgress(file, 50);

      // 2. Create hero slide with uploaded image
      const slideRes = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_slug: "home",
          image: url,
          is_active: 1,
          display_order: heroSlides.length,
        }),
      });

      if (!slideRes.ok) {
        const data = (await slideRes.json()) as { error?: string };
        throw new Error(data.error || "Gagal membuat slide");
      }

      options.onSuccess(file);
      setSlideUploadFiles([]);
      toast.success("Slide berhasil ditambahkan");
      router.refresh();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload gagal");
      options.onError(file, error);
      toast.error(error.message);
    } finally {
      setIsLoading(null);
    }
  };

  // Save about page
  const saveAboutPage = async () => {
    const res = await fetch("/api/admin/about-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aboutFormData),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error || "Failed to save about page");
    }
  };

  // Unified save for current section
  const handleSaveCurrentTab = async () => {
    setIsLoading("save-tab");
    setError(null);
    setSuccess(null);

    try {
      switch (section) {
        case "beranda":
          await Promise.all([
            savePageSection("home", "hero", homeHeroData),
            savePageSection("home", "overview", overviewData),
          ]);
          break;
        case "partner":
          await savePageSection("partners", "hero", partnerHeroData);
          break;
        case "tentang":
          await Promise.all([
            savePageSection("about", "hero", aboutHeroData),
            saveAboutPage(),
          ]);
          break;
        case "kontak":
          await savePageSection("contact", "hero", contactHeroData);
          break;
      }

      // Reset dirty state after successful save
      initialDataRef.current = {
        ...initialDataRef.current,
        ...(section === "beranda" && {
          homeHero: homeHeroData,
          overview: overviewData,
        }),
        ...(section === "partner" && { partnerHero: partnerHeroData }),
        ...(section === "tentang" && {
          aboutHero: aboutHeroData,
          aboutForm: aboutFormData,
        }),
        ...(section === "kontak" && { contactHero: contactHeroData }),
      };

      setSuccess("Perubahan berhasil disimpan!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md mb-4">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {section === "beranda" && (
          <>
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <HeroPreview
              data={homeHeroData}
              bgImage="https://cdn.4best.id/slider/apt-1.webp"
              variant="home"
            />
            <HeroForm
              data={homeHeroData}
              onChange={setHomeHeroData}
              showSubtitle={false}
              titlePlaceholder="Property Agency"
            />

            {/* Hero Slides Section */}
            <h3 className="text-lg font-semibold mt-8">Hero Slides</h3>
            <Card>
              <CardHeader>
                <CardTitle>Kelola Slides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {heroSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className="overflow-hidden rounded-lg border group relative"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={slide.image}
                          alt={slide.title || `Slide ${slide.id}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/content/hero-slides/${slide.id}`}
                          >
                            <Button size="sm" variant="secondary">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSlide(slide.id)}
                            disabled={isLoading === `delete-slide-${slide.id}`}
                          >
                            {isLoading === `delete-slide-${slide.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-background">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">
                            {slide.title || `Slide ${slide.display_order + 1}`}
                          </span>
                          <Badge
                            variant={slide.is_active ? "default" : "secondary"}
                          >
                            {slide.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Upload Dropzone */}
                  <FileUpload
                    accept="image/*"
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024}
                    value={slideUploadFiles}
                    onValueChange={setSlideUploadFiles}
                    onUpload={handleSlideUpload}
                    onFileReject={(file, message) =>
                      toast.error(message, {
                        description: `"${file.name}" ditolak`,
                      })
                    }
                  >
                    <FileUploadDropzone className="h-full min-h-0 border-dashed border-muted-foreground/30 bg-muted/30 hover:bg-muted/50 data-dragging:bg-muted/50 rounded-lg">
                      <div className="flex flex-col items-center justify-center gap-2 text-center aspect-video">
                        {isLoading === "upload-slide" ? (
                          <>
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              Mengupload...
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="rounded-lg bg-muted p-2.5">
                              <ImageIcon className="size-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Tambah Slide
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                Drag atau klik
                              </p>
                            </div>
                            <FileUploadTrigger asChild>
                              <Button size="sm" variant="outline" className="mt-1">
                                <Upload className="mr-1.5 size-3.5" />
                                Pilih Gambar
                              </Button>
                            </FileUploadTrigger>
                          </>
                        )}
                      </div>
                    </FileUploadDropzone>
                  </FileUpload>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold mt-8">Overview Section</h3>
            <OverviewPreview
              data={overviewData}
              onImageChange={(index, url) => {
                const currentImages = overviewData.images || ["", "", "", ""];
                const newImages = [...currentImages];
                newImages[index] = url;
                const updatedData = { ...overviewData, images: newImages };
                setOverviewData(updatedData);
                savePageSection("home", "overview", updatedData);
              }}
            />
            <OverviewForm
              data={overviewData}
              onChange={setOverviewData}
            />
          </>
        )}

        {section === "partner" && (
          <>
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <HeroPreview
              data={partnerHeroData}
              bgImage={
                partnerHeroData.background_image ||
                "https://cdn.4best.id/misc/gallery/l15.webp"
              }
              variant="parallax"
              onBgImageChange={(url) => {
                const updated = { ...partnerHeroData, background_image: url };
                setPartnerHeroData(updated);
                savePageSection("partners", "hero", updated);
              }}
            />
            <HeroForm
              data={partnerHeroData}
              onChange={setPartnerHeroData}
              titlePlaceholder="Partner Kami"
              subtitlePlaceholder="Developer Terpercaya"
            />
          </>
        )}

        {section === "tentang" && (
          <>
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <HeroPreview
              data={aboutHeroData}
              bgImage={
                aboutHeroData.background_image ||
                "https://cdn.4best.id/backgrounds/5.webp"
              }
              variant="parallax"
              onBgImageChange={(url) => {
                const updated = { ...aboutHeroData, background_image: url };
                setAboutHeroData(updated);
                savePageSection("about", "hero", updated);
              }}
            />
            <HeroForm
              data={aboutHeroData}
              onChange={setAboutHeroData}
              titlePlaceholder="Tentang 4BEST"
              subtitlePlaceholder="Pilihan Tepat, Hasil Terbaik"
            />

            <AboutPageSections
              data={aboutFormData}
              onChange={setAboutFormData}
              initialMissions={initialMissions}
            />
          </>
        )}

        {section === "kontak" && (
          <>
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <HeroPreview
              data={contactHeroData}
              bgImage={
                contactHeroData.background_image ||
                "https://cdn.4best.id/backgrounds/8.webp"
              }
              variant="parallax"
              onBgImageChange={(url) => {
                const updated = { ...contactHeroData, background_image: url };
                setContactHeroData(updated);
                savePageSection("contact", "hero", updated);
              }}
            />
            <HeroForm
              data={contactHeroData}
              onChange={setContactHeroData}
              titlePlaceholder="Hubungi Kami"
              subtitlePlaceholder="Kami Siap Membantu Anda!"
            />
          </>
        )}
      </div>

      {/* Unified fixed save button with dirty-state indicator */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 md:left-[var(--sidebar-width,256px)] flex justify-center px-4",
          isDirty ? "bg-amber-50/95 border-amber-200" : "bg-background/95",
        )}
      >
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
      {/* Spacer for fixed button */}
      <div className="h-16" />
    </div>
  );
}
