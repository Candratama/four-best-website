import { getCompanyInfo, getSocialLinks } from "@/lib/db";
import CompanyInfoForm from "@/components/admin/CompanyInfoForm";

export const dynamic = "force-dynamic";

export default async function CompanyInfoPage() {
  const [companyInfo, socialLinks] = await Promise.all([
    getCompanyInfo(),
    getSocialLinks({ activeOnly: false }),
  ]);

  // Find Instagram from social links for preview
  const activeLinks = socialLinks.filter((l) => l.is_active === 1);
  const instagramLink = activeLinks.find(
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
          <h1 className="text-3xl font-bold tracking-tight">Info Perusahaan</h1>
          <p className="text-muted-foreground">
            Kelola informasi kontak dan media sosial perusahaan
          </p>
        </div>
      </div>

      <CompanyInfoForm companyInfo={companyInfo} instagramHandle={instagramHandle} socialLinks={socialLinks} />
    </div>
  );
}
