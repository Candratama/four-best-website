import { getSubmissionStats } from "@/lib/db";
import { getSubmissions } from "./actions";
import SubmissionsPageClient from "./SubmissionsPageClient";

export const metadata = {
  title: "Contact Submissions | Admin",
  description: "Manage contact form submissions",
};

export default async function SubmissionsPage() {
  // Fetch submissions with pagination and stats
  const [submissionsResult, stats] = await Promise.all([
    getSubmissions(undefined, 1, 20), // Page 1, 20 items per page
    getSubmissionStats(),
  ]);

  if (!submissionsResult.success || !submissionsResult.submissions || !submissionsResult.pagination) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Manage and track all contact form submissions
          </p>
        </div>
        <div className="text-center text-red-600">
          Failed to load submissions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground">
          Manage and track all contact form submissions
        </p>
      </div>

      <SubmissionsPageClient
        initialSubmissions={submissionsResult.submissions}
        initialStats={stats}
        initialPagination={submissionsResult.pagination}
      />
    </div>
  );
}
