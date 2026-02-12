"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import type { OverviewContent } from "./types";

export default function OverviewPreview({
  data,
  onImageChange,
}: {
  data: OverviewContent;
  onImageChange: (index: number, url: string) => void;
}) {
  const images = data.images || ["", "", "", ""];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleImageUpload =
    (index: number) =>
    async (
      files: File[],
      options: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      const file = files[0];
      if (!file) return;

      setUploadingIndex(index);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "misc");
        formData.append("slug", `overview-${index + 1}`);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(errData.error || "Upload gagal");
        }

        const result = (await res.json()) as { url: string };
        onImageChange(index, result.url);
        options.onSuccess(file);
        toast.success(`Gambar ${index + 1} berhasil diupload`);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload gagal");
        options.onError(file, error);
        toast.error(error.message);
      } finally {
        setUploadingIndex(null);
      }
    };

  const renderImage = (src: string, index: number) => (
    <FileUpload
      key={index}
      accept="image/*"
      maxFiles={1}
      maxSize={10 * 1024 * 1024}
      onUpload={handleImageUpload(index)}
      onFileReject={(file, message) =>
        toast.error(message, { description: `"${file.name}" ditolak` })
      }
      className="group/img relative h-full"
    >
      <FileUploadTrigger asChild>
        <div className="relative cursor-pointer rounded-2xl overflow-hidden bg-muted h-full">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Overview ${index + 1}`}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full min-h-[120px] flex items-center justify-center text-muted-foreground">
              <ImageIcon className="size-8" />
            </div>
          )}
          {uploadingIndex === index ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl">
              <Upload className="size-5 text-white" />
              <span className="text-xs font-medium text-white">
                Ganti Gambar
              </span>
            </div>
          )}
        </div>
      </FileUploadTrigger>
    </FileUpload>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-lg p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Content — col-lg-5 (text left) */}
            <div className="lg:col-span-5 space-y-4">
              <span
                style={{
                  color: "#162d50",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {data.subtitle || "Subtitle"}
              </span>
              <h2
                style={{
                  color: "#1e293b",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {data.title || "Your Title Here"}
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {data.description || "Your description here..."}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 24px",
                  backgroundColor: "#162d50",
                  color: "#ffffff",
                  borderRadius: "50px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {data.cta_text || "Button Text"}
              </span>
            </div>

            {/* Images Grid — col-lg-6 (images right), staggered 2x2 */}
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="grid grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-4">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted w-[70%] ml-[30%]">
                    {renderImage(images[0], 0)}
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                    {renderImage(images[1], 1)}
                  </div>
                </div>
                {/* Right column — offset down */}
                <div className="space-y-4 pt-10">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                    {renderImage(images[2], 2)}
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted w-[70%]">
                    {renderImage(images[3], 3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
