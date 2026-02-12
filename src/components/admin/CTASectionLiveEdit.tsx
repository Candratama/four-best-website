"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Megaphone,
  Eye,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import type { CTASection } from "@/lib/db";

interface CTASectionLiveEditProps {
  initialData: CTASection;
}

export default function CTASectionLiveEdit({ initialData }: CTASectionLiveEditProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subtitle: initialData.subtitle || "",
    title: initialData.title || "",
    description: initialData.description || "",
    primary_button_text: initialData.primary_button_text || "",
    primary_button_href: initialData.primary_button_href || "",
    secondary_button_text: initialData.secondary_button_text || "",
    secondary_button_href: initialData.secondary_button_href || "",
    background_image: initialData.background_image || "",
  });

  // Dirty-state tracking
  const initialDataRef = useRef(formData);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialDataRef.current),
    [formData],
  );

  // Background image upload
  const handleBgUpload = async (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    const file = files[0];
    if (!file) return;

    setIsLoading("upload-bg");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "backgrounds");
      fd.append("slug", `cta-bg-${Date.now()}`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Upload gagal");
      }

      const { url } = (await res.json()) as { url: string };
      setFormData((prev) => ({ ...prev, background_image: url }));
      options.onSuccess(file);
      toast.success("Gambar background berhasil diupload");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload gagal");
      options.onError(file, error);
      toast.error(error.message);
    } finally {
      setIsLoading(null);
    }
  };

  // Save handler
  const handleSubmit = async () => {
    setIsLoading("save");

    try {
      const res = await fetch("/api/admin/cta-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Gagal menyimpan CTA section");
      }

      initialDataRef.current = formData;
      toast.success("Perubahan berhasil disimpan!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle>Preview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[3/1] rounded-lg overflow-hidden bg-muted">
            {formData.background_image ? (
              <Image
                src={formData.background_image}
                alt="CTA Background"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(22, 45, 80, 0.9) 0%, rgba(22, 45, 80, 0.85) 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              {formData.subtitle && (
                <span
                  style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.5rem" }}
                >
                  {formData.subtitle}
                </span>
              )}
              <h3
                style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
              >
                {formData.title || "Judul CTA Anda"}
              </h3>
              {formData.description && (
                <p
                  style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: "500px", textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
                >
                  {formData.description}
                </p>
              )}
              <div className="flex gap-3">
                {formData.primary_button_text && (
                  <span
                    style={{ padding: "10px 24px", backgroundColor: "#ffffff", color: "#162d50", borderRadius: "50px", fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    {formData.primary_button_text}
                  </span>
                )}
                {formData.secondary_button_text && (
                  <span
                    style={{ padding: "10px 24px", border: "2px solid #ffffff", color: "#ffffff", borderRadius: "50px", fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    {formData.secondary_button_text}
                  </span>
                )}
              </div>
            </div>

            {/* Background image upload overlay */}
            <FileUpload
              accept="image/*"
              maxFiles={1}
              maxSize={10 * 1024 * 1024}
              onUpload={handleBgUpload}
              onFileReject={(file, message) =>
                toast.error(message, { description: `"${file.name}" ditolak` })
              }
              className="absolute bottom-3 right-3 z-10"
            >
              <FileUploadTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="shadow-lg"
                  disabled={isLoading === "upload-bg"}
                >
                  {isLoading === "upload-bg" ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : formData.background_image ? (
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                  ) : (
                    <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {formData.background_image ? "Ganti Background" : "Upload Background"}
                </Button>
              </FileUploadTrigger>
            </FileUpload>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Konten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subjudul</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="cth: Siap untuk memulai?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="cth: Temukan Properti Impian Anda"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tombol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary_button_text">Teks Tombol Utama</Label>
              <Input
                id="primary_button_text"
                value={formData.primary_button_text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primary_button_text: e.target.value,
                  }))
                }
                placeholder="cth: Hubungi Kami"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_button_href">Link Tombol Utama</Label>
              <Input
                id="primary_button_href"
                value={formData.primary_button_href}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primary_button_href: e.target.value,
                  }))
                }
                placeholder="cth: /contact"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_button_text">Teks Tombol Sekunder</Label>
              <Input
                id="secondary_button_text"
                value={formData.secondary_button_text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    secondary_button_text: e.target.value,
                  }))
                }
                placeholder="cth: Lihat Perumahan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_button_href">Link Tombol Sekunder</Label>
              <Input
                id="secondary_button_href"
                value={formData.secondary_button_href}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    secondary_button_href: e.target.value,
                  }))
                }
                placeholder="cth: /partners"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed save button with dirty-state indicator */}
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
      {/* Spacer for fixed button */}
      <div className="h-16" />
    </div>
  );
}
