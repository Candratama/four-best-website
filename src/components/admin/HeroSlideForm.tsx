"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { HeroSlide } from "@/lib/db";

interface HeroSlideFormProps {
  heroSlide?: HeroSlide;
  mode: "create" | "edit";
}

export default function HeroSlideForm({ heroSlide, mode }: HeroSlideFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    page_slug: heroSlide?.page_slug || "home",
    image: heroSlide?.image || "",
    title: heroSlide?.title || "",
    subtitle: heroSlide?.subtitle || "",
    overlay_opacity: heroSlide?.overlay_opacity || 50,
    is_active: heroSlide?.is_active === 1 || mode === "create",
    display_order: heroSlide?.display_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = mode === "create"
        ? "/api/admin/hero-slides"
        : `/api/admin/hero-slides/${heroSlide?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          is_active: formData.is_active ? 1 : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save hero slide");
      }

      router.push("/admin/content/beranda");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konten Slide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page_slug">Halaman</Label>
                <Select
                  value={formData.page_slug}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, page_slug: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih halaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Beranda</SelectItem>
                    <SelectItem value="about">Tentang</SelectItem>
                    <SelectItem value="partners">Partner</SelectItem>
                    <SelectItem value="contact">Kontak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ImageUploadField
                value={formData.image}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, image: url }))
                }
                onRemove={() =>
                  setFormData((prev) => ({ ...prev, image: "" }))
                }
                category="slider"
                slug={formData.page_slug || "slide"}
                label="Gambar Slide *"
                aspectRatio="16/9"
              />
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subjudul</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overlay_opacity">Opasitas Overlay (%)</Label>
                <Input
                  id="overlay_opacity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.overlay_opacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      overlay_opacity: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {formData.image && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Overlay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: formData.overlay_opacity / 100 }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Aktif</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Urutan Tampil</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : mode === "create" ? (
              "Buat Slide"
            ) : (
              "Perbarui Slide"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
