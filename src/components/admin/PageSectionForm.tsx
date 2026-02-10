"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { PageSection } from "@/lib/db";

interface PageSectionFormProps {
  pageSection: PageSection;
}

export default function PageSectionForm({ pageSection }: PageSectionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Parse the JSON content
  let parsedContent: Record<string, unknown> = {};
  try {
    parsedContent = JSON.parse(pageSection.content);
  } catch {
    parsedContent = {};
  }

  const [formData, setFormData] = useState({
    page_slug: pageSection.page_slug,
    section_key: pageSection.section_key,
    content: JSON.stringify(parsedContent, null, 2),
    is_active: pageSection.is_active === 1,
    display_order: pageSection.display_order,
  });

  const [jsonError, setJsonError] = useState("");

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
    try {
      JSON.parse(value);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (jsonError) {
      setError("Please fix the JSON format before saving");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/page-sections/${pageSection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          is_active: formData.is_active ? 1 : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save page section");
      }

      router.push("/admin/content/page-sections");
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
              <CardTitle>Section Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page_slug">Page</Label>
                  <Input
                    id="page_slug"
                    value={formData.page_slug}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section_key">Section Key</Label>
                  <Input
                    id="section_key"
                    value={formData.section_key}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (JSON)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
                {jsonError && (
                  <p className="text-sm text-red-600">{jsonError}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
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

          <Button type="submit" className="w-full" disabled={isLoading || !!jsonError}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Section"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
