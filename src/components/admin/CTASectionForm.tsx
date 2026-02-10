"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { CTASection } from "@/lib/db";

interface CTASectionFormProps {
  ctaSection: CTASection;
}

export default function CTASectionForm({ ctaSection }: CTASectionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    subtitle: ctaSection.subtitle || "",
    title: ctaSection.title || "",
    description: ctaSection.description || "",
    primary_button_text: ctaSection.primary_button_text || "",
    primary_button_href: ctaSection.primary_button_href || "",
    secondary_button_text: ctaSection.secondary_button_text || "",
    secondary_button_href: ctaSection.secondary_button_href || "",
    background_image: ctaSection.background_image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      router.push("/admin/content/cta");
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {formData.background_image && (
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={formData.background_image}
                    alt="Background preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update CTA Section"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
