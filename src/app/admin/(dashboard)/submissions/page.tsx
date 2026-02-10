import { getContactSubmissions, getSubmissionStats } from "@/lib/db";
import SubmissionsPageClient from "./SubmissionsPageClient";

export const metadata = {
  title: "Contact Submissions | Admin",
  description: "Manage contact form submissions",
};

export default async function SubmissionsPage() {
  // Fetch submissions and stats
  const [submissions, stats] = await Promise.all([
    getContactSubmissions(undefined, 100, 0), // Get first 100 submissions
    getSubmissionStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground">
          Manage and track all contact form submissions
        </p>
      </div>

      <SubmissionsPageClient
        initialSubmissions={submissions}
        initialStats={stats}
      />
    </div>
  );
}
