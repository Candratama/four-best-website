"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import type { AboutFormData, Mission } from "./types";
import VisionMissionPreview from "./VisionMissionPreview";
import MissionItemsManager from "./MissionItemsManager";

export default function AboutPageSections({
  data,
  onChange,
  initialMissions,
}: {
  data: AboutFormData;
  onChange: (data: AboutFormData) => void;
  initialMissions: Mission[];
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [missionItems, setMissionItems] = useState<Mission[]>(initialMissions);

  const imageKeys: (keyof AboutFormData)[] = [
    "intro_image_left",
    "intro_image_right",
  ];

  const handleIntroImageUpload =
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
        formData.append("slug", `about-intro-${index + 1}`);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(errData.error || "Upload gagal");
        }

        const result = (await res.json()) as { url: string };
        const key = imageKeys[index];
        onChange({ ...data, [key]: result.url });
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

  const renderIntroImage = (src: string, index: number) => (
    <FileUpload
      key={index}
      accept="image/*"
      maxFiles={1}
      maxSize={10 * 1024 * 1024}
      onUpload={handleIntroImageUpload(index)}
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
              alt={`Intro ${index + 1}`}
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
    <div className="space-y-8">
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
            <div className="bg-white rounded-lg p-6 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Images Grid — matches AboutContent layout (images left) */}
                <div className="lg:col-span-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                      {renderIntroImage(data.intro_image_left, 0)}
                    </div>
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted mt-8">
                      {renderIntroImage(data.intro_image_right, 1)}
                    </div>
                  </div>
                </div>

                {/* Text Content — matches col-lg-6 (text right) */}
                <div className="lg:col-span-6 space-y-4">
                  <span
                    style={{
                      color: "#162d50",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    {data.intro_subtitle || "Tentang Kami"}
                  </span>
                  <h2
                    style={{
                      color: "#1e293b",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {data.intro_title || "4Best Agent Property"}
                  </h2>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {data.intro_description || "Deskripsi perusahaan..."}
                  </p>
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
                <Label>Subjudul</Label>
                <Input
                  value={data.intro_subtitle}
                  onChange={(e) =>
                    onChange({ ...data, intro_subtitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={data.intro_title}
                  onChange={(e) =>
                    onChange({ ...data, intro_title: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={data.intro_description}
                onChange={(e) =>
                  onChange({ ...data, intro_description: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visi & Misi Combined Preview + Edit */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Visi & Misi</h3>
        <VisionMissionPreview data={data} missions={missionItems} />

        {/* Edit Visi */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Visi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subjudul</Label>
                <Input
                  value={data.vision_subtitle}
                  onChange={(e) =>
                    onChange({ ...data, vision_subtitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={data.vision_title}
                  onChange={(e) =>
                    onChange({ ...data, vision_title: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Teks Visi</Label>
              <Textarea
                value={data.vision_text}
                onChange={(e) =>
                  onChange({ ...data, vision_text: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Edit Misi Header */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Misi Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subjudul</Label>
                <Input
                  value={data.mission_subtitle}
                  onChange={(e) =>
                    onChange({ ...data, mission_subtitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={data.mission_title}
                  onChange={(e) =>
                    onChange({ ...data, mission_title: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kelola Misi Items */}
        <MissionItemsManager
          items={missionItems}
          onItemsChange={setMissionItems}
        />
      </div>
    </div>
  );
}
