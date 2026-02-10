"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette } from "lucide-react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/db";

interface SiteSettingsFormProps {
  settings: SiteSettings | null;
}

export default function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: settings?.name || "",
    tagline: settings?.tagline || "",
    logo: settings?.logo || "",
    favicon: settings?.favicon || "",
    primary_color: settings?.primary_color || "#162d50",
    secondary_color: settings?.secondary_color || "#0056d6",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess("Settings saved successfully!");
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
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Branding</CardTitle>
          </div>
          <CardDescription>
            Configure your site name, logo, and colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.logo && (
            <div className="space-y-2">
              <Label>Current Logo</Label>
              <div className="p-4 bg-muted rounded-lg inline-block">
                <Image
                  src={formData.logo}
                  alt="Site Logo"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
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

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, logo: e.target.value }))
                }
                placeholder="https://cdn.4best.id/branding/logo.svg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={formData.favicon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, favicon: e.target.value }))
                }
                placeholder="/favicon.svg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
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
                <div
                  className="w-10 h-10 rounded border shrink-0"
                  style={{ backgroundColor: formData.primary_color }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
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
                <div
                  className="w-10 h-10 rounded border shrink-0"
                  style={{ backgroundColor: formData.secondary_color }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
