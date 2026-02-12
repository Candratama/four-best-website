"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import type { HeroContent } from "./types";

export default function HeroPreview({
  data,
  bgImage,
  variant = "default",
  onBgImageChange,
}: {
  data: HeroContent;
  bgImage: string;
  variant?: "home" | "parallax" | "default";
  onBgImageChange?: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleBgUpload = async (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => {
    const file = files[0];
    if (!file || !onBgImageChange) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "backgrounds");
      formData.append("slug", "hero");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = (await res.json()) as { error?: string };
        throw new Error(errData.error || "Upload gagal");
      }

      const result = (await res.json()) as { url: string };
      onBgImageChange(result.url);
      options.onSuccess(file);
      toast.success("Background image berhasil diupload");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload gagal");
      options.onError(file, error);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

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
          <div
            className="absolute top-0 left-0 right-0 h-1/3"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
            }}
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          />

          {variant === "home" ? (
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  marginBottom: "0.5rem",
                  lineHeight: 1,
                }}
              >
                {data.title || "PROPERTY AGENCY"}
              </h1>
              <div className="flex items-center gap-4">
                <p style={{ color: "#ffffff", fontSize: "0.875rem" }}>
                  {data.subtitle || "Alamat perusahaan"}
                </p>
                <span
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ffffff",
                    color: "#ffffff",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  LIHAT DI PETA
                </span>
              </div>
            </div>
          ) : variant === "parallax" ? (
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  marginBottom: "0.5rem",
                  lineHeight: 1,
                }}
              >
                {data.title || "TITLE"}
              </h1>
              {data.subtitle && (
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {data.subtitle}
                </h3>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "2rem",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  marginBottom: "0.5rem",
                }}
              >
                {data.title || "Your Title Here"}
              </h1>
              {data.subtitle && (
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "1rem",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {data.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Upload button - bottom right corner */}
          {onBgImageChange && (
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
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (data.background_image || bgImage) ? (
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                  ) : (
                    <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {(data.background_image || bgImage) ? "Ganti Background" : "Upload Background"}
                </Button>
              </FileUploadTrigger>
            </FileUpload>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
