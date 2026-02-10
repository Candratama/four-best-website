"use client";

import { useState, useTransition } from "react";
import { ContactSubmission } from "@/lib/db";
import SubmissionStatsComponent from "@/components/admin/SubmissionStats";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import SubmissionDetailModal from "@/components/admin/SubmissionDetailModal";
import { exportSubmissionsCSV, getSubmissions } from "./actions";
import { toast } from "sonner";

interface SubmissionsPageClientProps {
  initialSubmissions: ContactSubmission[];
  initialStats: {
    thisWeek: number;
    overdue: number;
    newCount: number;
    responseRate: number;
  };
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SubmissionsPageClient({
  initialSubmissions,
  initialStats,
  initialPagination,
}: SubmissionsPageClientProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [pagination, setPagination] = useState(initialPagination);
  const [isPending, startTransition] = useTransition();

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    startTransition(async () => {
      const result = await getSubmissions(undefined, page, pagination.limit);
      if (result.success && result.submissions && result.pagination) {
        setSubmissions(result.submissions);
        setPagination(result.pagination);
      }
    });
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
        submissions={submissions}
        onViewDetails={handleViewDetails}
        onExport={handleExport}
        pagination={pagination}
        onPageChange={handlePageChange}
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
