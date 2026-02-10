"use client";

import { useState } from "react";
import { ContactSubmission } from "@/lib/db";
import SubmissionStatsComponent from "@/components/admin/SubmissionStats";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import SubmissionDetailModal from "@/components/admin/SubmissionDetailModal";
import { exportSubmissionsCSV } from "./actions";
import { toast } from "sonner";

interface SubmissionsPageClientProps {
  initialSubmissions: ContactSubmission[];
  initialStats: {
    thisWeek: number;
    overdue: number;
    newCount: number;
    responseRate: number;
  };
}

export default function SubmissionsPageClient({
  initialSubmissions,
  initialStats,
}: SubmissionsPageClientProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      const result = await exportSubmissionsCSV();
      if (result.success && result.csv) {
        // Create a blob and download
        const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `submissions-${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exported successfully");
      } else {
        toast.error("Failed to export CSV");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    }
  };

  const handleUpdate = () => {
    // Reload the page to get fresh data
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <SubmissionStatsComponent stats={initialStats} />

      {/* Submissions Table */}
      <SubmissionsTable
        submissions={initialSubmissions}
        onViewDetails={handleViewDetails}
        onExport={handleExport}
      />

      {/* Detail Modal */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
