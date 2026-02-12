import { getSubmissionStats } from "@/lib/db";
import { getSubmissions } from "./actions";
import SubmissionsPageClient from "./SubmissionsPageClient";

export const metadata = {
  title: "Pesan Masuk | Admin",
  description: "Kelola pesan dari formulir kontak",
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
          <h1 className="text-3xl font-bold tracking-tight">Pesan Masuk</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua pesan dari formulir kontak
          </p>
        </div>
        <div className="text-center text-red-600">
          Gagal memuat data pesan
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pesan Masuk</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau semua pesan dari formulir kontak
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
