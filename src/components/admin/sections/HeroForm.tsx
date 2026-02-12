"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeroContent } from "./types";

export default function HeroForm({
  data,
  onChange,
  showSubtitle = true,
  titlePlaceholder = "Judul hero",
  subtitlePlaceholder = "Subtitle hero",
}: {
  data: HeroContent;
  onChange: (data: HeroContent) => void;
  showSubtitle?: boolean;
  titlePlaceholder?: string;
  subtitlePlaceholder?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Hero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-title">Judul</Label>
          <Input
            id="hero-title"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder={titlePlaceholder}
          />
        </div>
        {showSubtitle && (
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subjudul</Label>
            <Input
              id="hero-subtitle"
              value={data.subtitle || ""}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              placeholder={subtitlePlaceholder}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
