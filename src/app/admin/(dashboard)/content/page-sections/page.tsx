import { getPageSections, getAboutPage, getHeroSlides } from "@/lib/db";
import PageSectionsLiveEdit from "@/components/admin/PageSectionsLiveEdit";

export const dynamic = "force-dynamic";

export default async function PageSectionsPage() {
  // Fetch sections for each page
  const [homeSections, partnerSections, contactSections, aboutData, heroSlides] = await Promise.all([
    getPageSections({ pageSlug: "home" }),
    getPageSections({ pageSlug: "partners" }),
    getPageSections({ pageSlug: "contact" }),
    getAboutPage(),
    getHeroSlides({ pageSlug: "home", activeOnly: false }),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Page Sections</h1>
        <p className="text-muted-foreground">
          Manage content sections for each page with live preview
        </p>
      </div>

      {/* Live Edit Component with Tabs */}
      <PageSectionsLiveEdit
        homeSections={homeSections}
        partnerSections={partnerSections}
        contactSections={contactSections}
        aboutData={aboutData}
        heroSlides={heroSlides}
      />
    </div>
  );
}
