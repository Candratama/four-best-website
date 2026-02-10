import { getCTASection } from "@/lib/db";
import CTASectionForm from "@/components/admin/CTASectionForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCTASectionPage() {
  const ctaSection = await getCTASection();

  if (!ctaSection) {
    redirect("/admin/content/cta");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit CTA Section</h1>
      <p className="text-muted-foreground">
        Configure the call-to-action section displayed across the website
      </p>
      <CTASectionForm ctaSection={ctaSection} />
    </div>
  );
}
