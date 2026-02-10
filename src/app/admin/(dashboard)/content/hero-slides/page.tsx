import { getHeroSlides } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HeroSlidesPage() {
  const heroSlides = await getHeroSlides({ activeOnly: false });

  // Group slides by page_slug
  const slidesByPage = heroSlides.reduce((acc, slide) => {
    const page = slide.page_slug || "home";
    if (!acc[page]) acc[page] = [];
    acc[page].push(slide);
    return acc;
  }, {} as Record<string, typeof heroSlides>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Slides</h1>
          <p className="text-muted-foreground">
            Manage hero slider images for different pages
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/hero-slides/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Slide
          </Link>
        </Button>
      </div>

      {/* Slides by Page */}
      {Object.entries(slidesByPage).map(([pageSlug, slides]) => (
        <Card key={pageSlug}>
          <CardHeader>
            <CardTitle className="capitalize">{pageSlug} Page Slides</CardTitle>
            <CardDescription>
              {slides.length} slide{slides.length !== 1 ? "s" : ""} configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="relative group rounded-lg overflow-hidden border"
                >
                  <div className="aspect-video relative bg-muted">
                    {slide.image ? (
                      <Image
                        src={slide.image}
                        alt={slide.title || `Slide ${slide.id}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/admin/content/hero-slides/${slide.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {slide.title || `Slide ${slide.display_order}`}
                      </span>
                      <Badge variant={slide.is_active ? "default" : "secondary"}>
                        {slide.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {slide.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {heroSlides.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hero slides yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first hero slide to get started
            </p>
            <Button asChild>
              <Link href="/admin/content/hero-slides/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Slide
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
