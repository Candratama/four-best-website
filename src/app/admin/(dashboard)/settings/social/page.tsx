import { getSocialLinks } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Plus, Edit, Trash2, Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default async function SocialLinksPage() {
  const socialLinks = await getSocialLinks({ activeOnly: false });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground">
            Manage your social media links (displayed in footer)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/settings/social/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <CardTitle>Social Media Accounts</CardTitle>
          </div>
          <CardDescription>
            Links to your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {socialLinks.length > 0 ? (
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const PlatformIcon = platformIcons[link.platform.toLowerCase()] || Share2;
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
                          <span className="font-medium capitalize">{link.platform}</span>
                          <Badge variant={link.is_active ? "default" : "secondary"}>
                            {link.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/settings/social/${link.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No social links yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your social media profiles
              </p>
              <Button asChild>
                <Link href="/admin/settings/social/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Social Link
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
