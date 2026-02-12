"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { SocialLink } from "@/lib/db";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function SocialLinksList({ socialLinks }: { socialLinks: SocialLink[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus media sosial ini?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/social-links/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Gagal menghapus");
      }
      toast.success("Media sosial berhasil dihapus");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <CardTitle>Akun Media Sosial</CardTitle>
        </div>
        <CardDescription>
          Tautan ke profil media sosial Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {socialLinks.length > 0 ? (
          <>
            {socialLinks.map((link) => {
              const PlatformIcon =
                platformIcons[link.platform.toLowerCase()] || Share2;
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <PlatformIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {link.platform}
                        </span>
                        <Badge
                          variant={link.is_active ? "default" : "secondary"}
                        >
                          {link.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/settings/company/social/${link.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                    >
                      {deletingId === link.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/settings/company/social/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Media Sosial
              </Link>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Share2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Belum ada media sosial
            </p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin/settings/company/social/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Media Sosial
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
