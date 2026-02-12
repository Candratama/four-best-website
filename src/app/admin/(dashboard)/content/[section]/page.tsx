import { notFound } from "next/navigation";
import { getPageSections, getAboutPage, getHeroSlides, getMissions } from "@/lib/db";
import PageSectionsLiveEdit from "@/components/admin/PageSectionsLiveEdit";

export const dynamic = "force-dynamic";

const sectionConfig = {
  beranda: {
    title: "Beranda",
    description: "Kelola konten halaman beranda",
  },
  partner: {
    title: "Partner",
    description: "Kelola konten halaman partner",
  },
  tentang: {
    title: "Tentang",
    description: "Kelola konten halaman tentang",
  },
  kontak: {
    title: "Kontak",
    description: "Kelola konten halaman kontak",
  },
} as const;

type SectionKey = keyof typeof sectionConfig;

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!(section in sectionConfig)) {
    notFound();
  }

  const sectionKey = section as SectionKey;
  const config = sectionConfig[sectionKey];

  // Fetch only the data needed for this section
  const fetchMap = {
    beranda: async () => {
      const [homeSections, heroSlides] = await Promise.all([
        getPageSections({ pageSlug: "home" }),
        getHeroSlides({ pageSlug: "home", activeOnly: false }),
      ]);
      return { homeSections, heroSlides };
    },
    partner: async () => {
      const partnerSections = await getPageSections({ pageSlug: "partners" });
      return { partnerSections };
    },
    tentang: async () => {
      const [aboutSections, aboutData, missions] = await Promise.all([
        getPageSections({ pageSlug: "about" }),
        getAboutPage(),
        getMissions(),
      ]);
      return { aboutSections, aboutData, missions };
    },
    kontak: async () => {
      const contactSections = await getPageSections({ pageSlug: "contact" });
      return { contactSections };
    },
  };

  const data = await fetchMap[sectionKey]();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <PageSectionsLiveEdit
        section={sectionKey}
        homeSections={"homeSections" in data ? data.homeSections : []}
        partnerSections={"partnerSections" in data ? data.partnerSections : []}
        contactSections={"contactSections" in data ? data.contactSections : []}
        aboutSections={"aboutSections" in data ? data.aboutSections : []}
        aboutData={"aboutData" in data ? data.aboutData : null}
        heroSlides={"heroSlides" in data ? data.heroSlides : []}
        missions={"missions" in data ? data.missions : []}
      />
    </div>
  );
}
