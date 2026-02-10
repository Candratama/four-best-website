"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PageSection, AboutPage, HeroSlide } from "@/lib/db";

// ============================================
// Types
// ============================================

interface PageSectionsLiveEditProps {
  homeSections: PageSection[];
  partnerSections: PageSection[];
  contactSections: PageSection[];
  aboutData: AboutPage | null;
  heroSlides: HeroSlide[];
}

interface HeroContent {
  title: string;
  subtitle?: string;
  background_image?: string;
}

interface OverviewContent {
  subtitle: string;
  title: string;
  description: string;
  cta_text: string;
  cta_href: string;
  images: string[];
}

// ============================================
// Main Component
// ============================================

export default function PageSectionsLiveEdit({
  homeSections,
  partnerSections,
  contactSections,
  aboutData,
  heroSlides,
}: PageSectionsLiveEditProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse content helper
  const parseContent = <T,>(section: PageSection | undefined, defaultValue: T): T => {
    if (!section) return defaultValue;
    try {
      return JSON.parse(section.content) as T;
    } catch {
      return defaultValue;
    }
  };

  // Find sections by key
  const homeHero = homeSections.find(s => s.section_key === "hero");
  const homeOverview = homeSections.find(s => s.section_key === "overview");
  const partnerHero = partnerSections.find(s => s.section_key === "hero");
  const contactHero = contactSections.find(s => s.section_key === "hero");

  // Default values
  const defaultHero: HeroContent = { title: "", subtitle: "", background_image: "" };
  const defaultOverview: OverviewContent = {
    subtitle: "4Best",
    title: "Pilihan Tepat, Hasil Terbaik",
    description: "4Best Agent Property adalah perusahaan agen properti profesional.",
    cta_text: "Hubungi Kami",
    cta_href: "/contact",
    images: ["", "", "", ""],
  };

  // State for each section
  const [homeHeroData, setHomeHeroData] = useState<HeroContent>(
    parseContent(homeHero, { ...defaultHero, title: "Property Agency", subtitle: "Perum Ungaran Asri JL. Serasi Raya Atas No C1, Ungaran, Kab. Semarang" })
  );
  const [overviewData, setOverviewData] = useState<OverviewContent>(
    parseContent(homeOverview, defaultOverview)
  );
  const [partnerHeroData, setPartnerHeroData] = useState<HeroContent>(
    parseContent(partnerHero, { ...defaultHero, title: "Partner Kami", subtitle: "Developer Terpercaya" })
  );
  const [contactHeroData, setContactHeroData] = useState<HeroContent>(
    parseContent(contactHero, { ...defaultHero, title: "Hubungi Kami", subtitle: "Kami Siap Membantu Anda!" })
  );
  const [aboutFormData, setAboutFormData] = useState({
    hero_title: aboutData?.hero_title || "Tentang 4BEST",
    hero_subtitle: aboutData?.hero_subtitle || "Pilihan Tepat, Hasil Terbaik",
    hero_background_image: aboutData?.hero_background_image || "",
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

  // Save page section
  const savePageSection = async (pageSlug: string, sectionKey: string, content: object) => {
    const loadingKey = `${pageSlug}-${sectionKey}`;
    setIsLoading(loadingKey);
    setError(null);
    setSuccess(null);

    try {
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
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save section");
      }

      setSuccess(`${pageSlug} ${sectionKey} saved successfully!`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(null);
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
        const data = await res.json() as { error?: string };
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

  // Save about page
  const saveAboutPage = async () => {
    setIsLoading("about");
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/about-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutFormData),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save about page");
      }

      setSuccess("About page saved successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Tabs defaultValue="beranda" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="beranda" className="data-[state=active]:bg-[#162d50] data-[state=active]:text-white">Beranda</TabsTrigger>
        <TabsTrigger value="partner" className="data-[state=active]:bg-[#162d50] data-[state=active]:text-white">Partner</TabsTrigger>
        <TabsTrigger value="tentang" className="data-[state=active]:bg-[#162d50] data-[state=active]:text-white">Tentang</TabsTrigger>
        <TabsTrigger value="kontak" className="data-[state=active]:bg-[#162d50] data-[state=active]:text-white">Kontak</TabsTrigger>
      </TabsList>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-4">{error}</div>
      )}
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md mb-4">{success}</div>
      )}

      {/* Beranda Tab */}
      <TabsContent value="beranda" className="space-y-6">
        <h3 className="text-lg font-semibold">Hero Section</h3>
        <HeroPreview data={homeHeroData} bgImage="https://cdn.4best.id/slider/apt-1.webp" variant="home" />
        <HeroForm
          data={homeHeroData}
          onChange={setHomeHeroData}
          onSave={() => savePageSection("home", "hero", homeHeroData)}
          isLoading={isLoading === "home-hero"}
          showBgImage={false}
        />

        {/* Hero Slides Section */}
        <h3 className="text-lg font-semibold mt-8">Hero Slides</h3>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Kelola Slides</CardTitle>
              <Link href="/admin/content/hero-slides/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Slide
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {heroSlides.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada slide. Tambahkan slide pertama.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="overflow-hidden rounded-lg border group relative">
                    <div className="relative aspect-video">
                      <Image
                        src={slide.image}
                        alt={slide.title || `Slide ${slide.id}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link href={`/admin/content/hero-slides/${slide.id}/edit`}>
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
                        <Badge variant={slide.is_active ? "default" : "secondary"}>
                          {slide.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold mt-8">Overview Section</h3>
        <OverviewPreview data={overviewData} />
        <OverviewForm
          data={overviewData}
          onChange={setOverviewData}
          onSave={() => savePageSection("home", "overview", overviewData)}
          isLoading={isLoading === "home-overview"}
        />
      </TabsContent>

      {/* Partner Tab */}
      <TabsContent value="partner" className="space-y-6">
        <h3 className="text-lg font-semibold">Hero Section</h3>
        <HeroPreview data={partnerHeroData} bgImage={partnerHeroData.background_image || "https://cdn.4best.id/misc/gallery/l15.webp"} variant="parallax" />
        <HeroForm
          data={partnerHeroData}
          onChange={setPartnerHeroData}
          onSave={() => savePageSection("partners", "hero", partnerHeroData)}
          isLoading={isLoading === "partners-hero"}
          showBgImage={true}
        />
      </TabsContent>

      {/* Tentang Tab */}
      <TabsContent value="tentang" className="space-y-6">
        <AboutPageSections
          data={aboutFormData}
          onChange={setAboutFormData}
          onSave={saveAboutPage}
          isLoading={isLoading === "about"}
        />
      </TabsContent>

      {/* Kontak Tab */}
      <TabsContent value="kontak" className="space-y-6">
        <h3 className="text-lg font-semibold">Hero Section</h3>
        <HeroPreview data={contactHeroData} bgImage={contactHeroData.background_image || "https://cdn.4best.id/backgrounds/8.webp"} variant="parallax" />
        <HeroForm
          data={contactHeroData}
          onChange={setContactHeroData}
          onSave={() => savePageSection("contact", "hero", contactHeroData)}
          isLoading={isLoading === "contact-hero"}
          showBgImage={true}
        />
      </TabsContent>
    </Tabs>
  );
}

// ============================================
// Hero Components
// ============================================

function HeroPreview({ data, bgImage, variant = "default" }: { data: HeroContent; bgImage: string; variant?: "home" | "parallax" | "default" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="relative aspect-[21/9] rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${data.background_image || bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay at top */}
          <div className="absolute top-0 left-0 right-0 h-1/3" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)" }} />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />

          {variant === "home" ? (
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Home page style - bottom left aligned */}
              <h1 style={{
                color: "#ffffff",
                fontSize: "3.5rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                marginBottom: "0.5rem",
                lineHeight: 1
              }}>
                {data.title || "PROPERTY AGENCY"}
              </h1>
              <div className="flex items-center gap-4">
                <p style={{ color: "#ffffff", fontSize: "0.875rem" }}>
                  {data.subtitle || "Alamat perusahaan"}
                </p>
                <span style={{
                  padding: "8px 16px",
                  border: "1px solid #ffffff",
                  color: "#ffffff",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  LIHAT DI PETA
                </span>
              </div>
            </div>
          ) : variant === "parallax" ? (
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Parallax style for Partner/Contact/About - bottom left, large uppercase */}
              <h1 style={{
                color: "#ffffff",
                fontSize: "3.5rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                marginBottom: "0.5rem",
                lineHeight: 1
              }}>
                {data.title || "TITLE"}
              </h1>
              {data.subtitle && (
                <h3 style={{
                  color: "#ffffff",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                }}>
                  {data.subtitle}
                </h3>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              {/* Default style - centered */}
              <h1 style={{ color: "#ffffff", fontSize: "2rem", fontWeight: 700, textShadow: "0 2px 4px rgba(0,0,0,0.5)", marginBottom: "0.5rem" }}>
                {data.title || "Your Title Here"}
              </h1>
              {data.subtitle && (
                <p style={{ color: "#ffffff", fontSize: "1rem", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                  {data.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function HeroForm({
  data,
  onChange,
  onSave,
  isLoading,
  showBgImage = false,
}: {
  data: HeroContent;
  onChange: (data: HeroContent) => void;
  onSave: () => void;
  isLoading: boolean;
  showBgImage?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Hero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="e.g., Property Agency"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Subtitle</Label>
          <Input
            id="hero-subtitle"
            value={data.subtitle || ""}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            placeholder="e.g., Find your dream home"
          />
        </div>
        {showBgImage && (
          <div className="space-y-2">
            <Label htmlFor="hero-bg">Background Image URL</Label>
            <Input
              id="hero-bg"
              value={data.background_image || ""}
              onChange={(e) => onChange({ ...data, background_image: e.target.value })}
              placeholder="https://..."
            />
          </div>
        )}
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Hero"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// Overview Components
// ============================================

function OverviewPreview({ data }: { data: OverviewContent }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span style={{ color: "#162d50", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>
                {data.subtitle || "Subtitle"}
              </span>
              <h2 style={{ color: "#1e293b", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
                {data.title || "Your Title Here"}
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {data.description || "Your description here..."}
              </p>
              <span style={{ display: "inline-block", padding: "10px 24px", backgroundColor: "#162d50", color: "#ffffff", borderRadius: "50px", fontSize: "0.875rem", fontWeight: 600 }}>
                {data.cta_text || "Button Text"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  {img ? (
                    <Image src={img} alt={`Overview ${idx + 1}`} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      Image {idx + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewForm({
  data,
  onChange,
  onSave,
  isLoading,
}: {
  data: OverviewContent;
  onChange: (data: OverviewContent) => void;
  onSave: () => void;
  isLoading: boolean;
}) {
  const updateImage = (index: number, value: string) => {
    const newImages = [...data.images];
    newImages[index] = value;
    onChange({ ...data, images: newImages });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input value={data.cta_text} onChange={(e) => onChange({ ...data, cta_text: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input value={data.cta_href} onChange={(e) => onChange({ ...data, cta_href: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="space-y-2">
              <Label>Image {idx + 1} URL</Label>
              <Input value={data.images[idx] || ""} onChange={(e) => updateImage(idx, e.target.value)} placeholder="https://..." />
            </div>
          ))}
          <Button onClick={onSave} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Overview"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// About Page Sections (with previews)
// ============================================

interface AboutFormData {
  hero_title: string;
  hero_subtitle: string;
  hero_background_image: string;
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

function AboutPageSections({
  data,
  onChange,
  onSave,
  isLoading,
}: {
  data: AboutFormData;
  onChange: (data: AboutFormData) => void;
  onSave: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hero Section</h3>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Preview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="relative aspect-[21/9] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${data.hero_background_image || "https://cdn.4best.id/backgrounds/5.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient overlay at top */}
              <div className="absolute top-0 left-0 right-0 h-1/3" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)" }} />
              {/* Dark overlay */}
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />
              {/* Parallax style - bottom left, large uppercase */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h1 style={{
                  color: "#ffffff",
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  marginBottom: "0.5rem",
                  lineHeight: 1
                }}>
                  {data.hero_title || "TENTANG 4BEST"}
                </h1>
                <h3 style={{
                  color: "#ffffff",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                }}>
                  {data.hero_subtitle || "Pilihan Tepat, Hasil Terbaik"}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={data.hero_title} onChange={(e) => onChange({ ...data, hero_title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={data.hero_subtitle} onChange={(e) => onChange({ ...data, hero_subtitle: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input value={data.hero_background_image} onChange={(e) => onChange({ ...data, hero_background_image: e.target.value })} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intro Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Intro Section</h3>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Preview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span style={{ color: "#162d50", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>
                    {data.intro_subtitle || "Tentang Kami"}
                  </span>
                  <h2 style={{ color: "#1e293b", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
                    {data.intro_title || "4Best Agent Property"}
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {data.intro_description || "Deskripsi perusahaan..."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                    {data.intro_image_left ? (
                      <Image src={data.intro_image_left} alt="Intro Left" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Image Left</div>
                    )}
                  </div>
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted mt-8">
                    {data.intro_image_right ? (
                      <Image src={data.intro_image_right} alt="Intro Right" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Image Right</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Intro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={data.intro_subtitle} onChange={(e) => onChange({ ...data, intro_subtitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={data.intro_title} onChange={(e) => onChange({ ...data, intro_title: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={data.intro_description} onChange={(e) => onChange({ ...data, intro_description: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Left Image URL</Label>
                <Input value={data.intro_image_left} onChange={(e) => onChange({ ...data, intro_image_left: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Right Image URL</Label>
                <Input value={data.intro_image_right} onChange={(e) => onChange({ ...data, intro_image_right: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vision Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Visi Section</h3>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Preview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-[#162d50] to-[#1e3a5f] rounded-lg p-6 text-center">
              <span style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8 }}>
                {data.vision_subtitle || "Visi Kami"}
              </span>
              <h2 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem", marginBottom: "1rem" }}>
                {data.vision_title || "Menjadi yang Terdepan"}
              </h2>
              <p style={{ color: "#ffffff", fontSize: "0.875rem", lineHeight: 1.6, opacity: 0.9, maxWidth: "600px", margin: "0 auto" }}>
                {data.vision_text || "Visi perusahaan..."}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Visi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={data.vision_subtitle} onChange={(e) => onChange({ ...data, vision_subtitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={data.vision_title} onChange={(e) => onChange({ ...data, vision_title: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vision Text</Label>
              <Textarea value={data.vision_text} onChange={(e) => onChange({ ...data, vision_text: e.target.value })} rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mission Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Misi Section</h3>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Preview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6">
              <div className="text-center mb-4">
                <span style={{ color: "#162d50", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px" }}>
                  {data.mission_subtitle || "Misi Kami"}
                </span>
                <h2 style={{ color: "#1e293b", fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>
                  {data.mission_title || "Komitmen untuk Hasil Terbaik"}
                </h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.875rem", textAlign: "center" }}>
                (Misi items dikelola terpisah di database)
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Misi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={data.mission_subtitle} onChange={(e) => onChange({ ...data, mission_subtitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={data.mission_title} onChange={(e) => onChange({ ...data, mission_title: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={onSave} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Halaman Tentang"
        )}
      </Button>
    </div>
  );
}
