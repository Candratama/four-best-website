import { getCompanyInfo, getSocialLinks } from "@/lib/db";
import CompanyInfoForm from "@/components/admin/CompanyInfoForm";

export const dynamic = "force-dynamic";

export default async function CompanyInfoPage() {
  const [companyInfo, socialLinks] = await Promise.all([
    getCompanyInfo(),
    getSocialLinks({ activeOnly: true }),
  ]);

  // Find Instagram from social links
  const instagramLink = socialLinks.find(
    (link) => link.platform.toLowerCase() === "instagram",
  );
  const instagramHandle = instagramLink?.url
    ? `@${instagramLink.url.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}`
    : "@4best.id";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Info</h1>
          <p className="text-muted-foreground">
            Manage your company contact information (displayed in footer and contact page)
          </p>
        </div>
      </div>

      <CompanyInfoForm companyInfo={companyInfo} instagramHandle={instagramHandle} />
    </div>
  );
}
