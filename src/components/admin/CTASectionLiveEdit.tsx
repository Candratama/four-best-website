"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Megaphone } from "lucide-react";
import Image from "next/image";
import type { CTASection } from "@/lib/db";

interface CTASectionLiveEditProps {
  initialData: CTASection;
}

export default function CTASectionLiveEdit({ initialData }: CTASectionLiveEditProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/cta-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save CTA section");
      }

      setSuccess("CTA section updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <CardTitle>Live Preview</CardTitle>
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
                {formData.title || "Your Title Here"}
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
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="e.g., Ready to get started?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Find Your Dream Property"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background_image">Background Image URL</Label>
                <Input
                  id="background_image"
                  value={formData.background_image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      background_image: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons Card */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary_button_text">Primary Button Text</Label>
                <Input
                  id="primary_button_text"
                  value={formData.primary_button_text}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_button_text: e.target.value,
                    }))
                  }
                  placeholder="e.g., Contact Us"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary_button_href">Primary Button Link</Label>
                <Input
                  id="primary_button_href"
                  value={formData.primary_button_href}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_button_href: e.target.value,
                    }))
                  }
                  placeholder="e.g., /contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_button_text">Secondary Button Text</Label>
                <Input
                  id="secondary_button_text"
                  value={formData.secondary_button_text}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondary_button_text: e.target.value,
                    }))
                  }
                  placeholder="e.g., View Properties"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_button_href">Secondary Button Link</Label>
                <Input
                  id="secondary_button_href"
                  value={formData.secondary_button_href}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondary_button_href: e.target.value,
                    }))
                  }
                  placeholder="e.g., /partners"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
