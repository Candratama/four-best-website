import { getAboutPage, getMissions, getStats, getTeamMembers } from "@/lib/db";
import AboutPageClient from "./AboutPageClient";

// Force dynamic rendering to fetch from database at runtime
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  // Fetch data from database
  const [aboutData, missions, stats, teamMembers] = await Promise.all([
    getAboutPage(),
    getMissions({ activeOnly: true }),
    getStats({ activeOnly: true }),
    getTeamMembers({ activeOnly: true }),
  ]);

  // Transform missions data for component
  const missionItems = missions.map((m) => ({ text: m.text }));

  // Transform stats data for component
  const statsData = stats.map((s) => ({
    value: s.value,
    label: s.label,
    suffix: s.suffix || undefined,
  }));

  // Transform team members data for component
  const teamData = teamMembers.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    image: t.image || "https://cdn.4best.id/team/placeholder.webp",
    social_facebook: t.social_facebook,
    social_twitter: t.social_twitter,
    social_instagram: t.social_instagram,
    social_linkedin: t.social_linkedin,
  }));

  return (
    <AboutPageClient
      aboutData={aboutData}
      missionItems={missionItems}
      statsData={statsData}
      teamData={teamData}
    />
  );
}
