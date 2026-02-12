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
        const data = (await res.json()) as { error?: string };
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
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
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
            </div>
            <div className="w-32">
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
