"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OverviewContent } from "./types";

export default function OverviewForm({
  data,
  onChange,
}: {
  data: OverviewContent;
  onChange: (data: OverviewContent) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Konten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Subjudul</Label>
          <Input
            value={data.subtitle}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            placeholder="4BEST"
          />
        </div>
        <div className="space-y-2">
          <Label>Judul</Label>
          <Input
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Pilihan Tepat, Hasil Terbaik"
          />
        </div>
        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            rows={4}
            placeholder="Deskripsi overview..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Teks Tombol</Label>
            <Input
              value={data.cta_text}
              onChange={(e) => onChange({ ...data, cta_text: e.target.value })}
              placeholder="Hubungi Kami"
            />
          </div>
          <div className="space-y-2">
            <Label>Link Tombol</Label>
            <Input
              value={data.cta_href}
              onChange={(e) => onChange({ ...data, cta_href: e.target.value })}
              placeholder="/contact"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
