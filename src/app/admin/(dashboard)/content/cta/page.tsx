import { getCTASection } from "@/lib/db";
import CTASectionLiveEdit from "@/components/admin/CTASectionLiveEdit";

export const dynamic = "force-dynamic";

export default async function CTASectionPage() {
  const ctaData = await getCTASection();

  // Create default data if none exists
  const initialData = ctaData || {
    id: 0,
    subtitle: "",
    title: "",
    description: "",
    primary_button_text: "",
    primary_button_href: "",
    secondary_button_text: "",
    secondary_button_href: "",
    background_image: "",
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CTA Section</h1>
        <p className="text-muted-foreground">
          Manage the Call-to-Action section displayed on all pages
        </p>
      </div>

      {/* Live Edit Component */}
      <CTASectionLiveEdit initialData={initialData} />
    </div>
  );
}
