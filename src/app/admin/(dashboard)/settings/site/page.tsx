import { getSiteSettings } from "@/lib/db";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Situs</h1>
          <p className="text-muted-foreground">
            Kelola branding dan tampilan website Anda
          </p>
        </div>
      </div>

      <SiteSettingsForm settings={settings} />
    </div>
  );
}
