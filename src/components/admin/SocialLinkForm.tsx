"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Instagram, Facebook, Twitter, Youtube, Linkedin, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { SocialLink } from "@/lib/db";

interface SocialLinkFormProps {
  socialLink?: SocialLink;
  mode: "create" | "edit";
}

const platforms = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "twitter", label: "Twitter / X", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "tiktok", label: "TikTok", icon: Share2 },
  { value: "whatsapp", label: "WhatsApp", icon: Share2 },
];

export default function SocialLinkForm({ socialLink, mode }: SocialLinkFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    platform: socialLink?.platform || "instagram",
    url: socialLink?.url || "",
    icon: socialLink?.icon || "",
    is_active: socialLink?.is_active === 1 || mode === "create",
    display_order: socialLink?.display_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === "create"
        ? "/api/admin/social-links"
        : `/api/admin/social-links/${socialLink?.id}`;

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
        throw new Error(data.error || "Gagal menyimpan media sosial");
      }

      toast.success(mode === "create" ? "Media sosial berhasil dibuat!" : "Media sosial berhasil diperbarui!");
      router.push("/admin/settings/company");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlatform = platforms.find(p => p.value === formData.platform);
  const PlatformIcon = selectedPlatform?.icon || Share2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Media Sosial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <platform.icon className="h-4 w-4" />
                          {platform.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://instagram.com/yourprofile"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ikon Kustom (opsional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="Kosongkan untuk menggunakan ikon default"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PlatformIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-medium capitalize">{formData.platform}</span>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {formData.url || "URL belum diisi"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
              "Buat Media Sosial"
            ) : (
              "Perbarui Media Sosial"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
