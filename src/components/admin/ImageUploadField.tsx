"use client";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  category: "partners" | "slider" | "properties" | "team" | "backgrounds" | "misc" | "branding";
  slug?: string;
  label: string;
  description?: string;
  aspectRatio?: string;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploadField({
  value,
  onChange,
  onRemove,
  category,
  slug = "upload",
  label,
  description,
  aspectRatio = "16/9",
  maxSizeMB = 5,
  className,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);

  // Show existing image as preview
  const displayUrl = preview || value || null;

  const handleUpload = React.useCallback(
    async (
      newFiles: File[],
      options: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      }
    ) => {
      const file = newFiles[0];
      if (!file) return;

      setIsUploading(true);

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        formData.append("slug", slug);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json() as { error?: string };
          throw new Error(errorData.error || "Upload gagal");
        }

        const result = await response.json() as { url: string };
        onChange(result.url);
        options.onSuccess(file);
        toast.success("Gambar berhasil diupload");
      } catch (error) {
        setPreview(null);
        options.onError(
          file,
          error instanceof Error ? error : new Error("Upload gagal")
        );
        toast.error(
          error instanceof Error ? error.message : "Upload gagal"
        );
      } finally {
        setIsUploading(false);
        // Cleanup object URL after a delay to allow preview transition
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    },
    [category, slug, onChange]
  );

  const handleFileReject = React.useCallback(
    (file: File, message: string) => {
      toast.error(message, {
        description: `"${file.name}" ditolak`,
      });
    },
    []
  );

  const handleRemove = React.useCallback(() => {
    setPreview(null);
    setFiles([]);
    onRemove();
  }, [onRemove]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>

      {displayUrl ? (
        // Preview mode — show uploaded/existing image
        <div
          className="group relative overflow-hidden rounded-lg border bg-muted"
          style={{ aspectRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt={label}
            className="h-full w-full object-cover"
          />

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <FileUpload
                accept="image/*"
                maxFiles={1}
                maxSize={maxSizeMB * 1024 * 1024}
                value={files}
                onValueChange={setFiles}
                onUpload={handleUpload}
                onFileReject={handleFileReject}
              >
                <FileUploadTrigger asChild>
                  <Button size="sm" variant="secondary">
                    <Upload className="mr-1.5 size-3.5" />
                    Ganti
                  </Button>
                </FileUploadTrigger>
              </FileUpload>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Dropzone mode — no image yet
        <FileUpload
          accept="image/*"
          maxFiles={1}
          maxSize={maxSizeMB * 1024 * 1024}
          className="w-full"
          value={files}
          onValueChange={setFiles}
          onUpload={handleUpload}
          onFileReject={handleFileReject}
        >
          <FileUploadDropzone className="border-primary/20 bg-primary/5 hover:bg-primary/10 data-dragging:bg-primary/10">
            <div
              className="flex w-full flex-col items-center justify-center gap-2 text-center"
              style={{ aspectRatio }}
            >
              <div className="rounded-lg bg-primary/10 p-3">
                <ImageIcon className="size-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Klik atau drag gambar ke sini
                </p>
                <p className="text-xs text-muted-foreground">
                  {description ||
                    `PNG, JPG, WebP maksimal ${maxSizeMB}MB`}
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button size="sm" variant="outline" className="mt-1">
                  <Upload className="mr-1.5 size-3.5" />
                  Pilih Gambar
                </Button>
              </FileUploadTrigger>
            </div>
          </FileUploadDropzone>
        </FileUpload>
      )}
    </div>
  );
}
