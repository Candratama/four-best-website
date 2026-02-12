"use client";

import { useState, useTransition, useCallback } from "react";
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
    totalMessages: number;
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
  const [filters, setFilters] = useState<{ search: string; status: string }>({
    search: "",
    status: "all",
  });
  const [isPending, startTransition] = useTransition();

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleFilterChange = useCallback((newFilters: { search: string; status: string }) => {
    setFilters(newFilters);
    startTransition(async () => {
      try {
        const submissionFilters = {
          search: newFilters.search || undefined,
          status: newFilters.status !== "all" ? newFilters.status : undefined,
        };
        const result = await getSubmissions(submissionFilters, 1, pagination.limit);
        if (result.success && result.submissions && result.pagination) {
          setSubmissions(result.submissions);
          setPagination(result.pagination);
        } else {
          console.error("Failed to apply filters:", result);
          toast.error("Gagal menerapkan filter");
        }
      } catch (error) {
        console.error("Error applying filters:", error);
        toast.error("Error loading submissions");
      }
    });
  }, [pagination.limit]);

  const handlePageChange = useCallback((page: number) => {
    startTransition(async () => {
      try {
        const submissionFilters = {
          search: filters.search || undefined,
          status: filters.status !== "all" ? filters.status : undefined,
        };
        const result = await getSubmissions(submissionFilters, page, pagination.limit);
        if (result.success && result.submissions && result.pagination) {
          setSubmissions(result.submissions);
          setPagination(result.pagination);
        } else {
          console.error("Failed to load page:", result);
          toast.error("Gagal memuat halaman");
        }
      } catch (error) {
        console.error("Error changing page:", error);
        toast.error("Error loading submissions");
      }
    });
  }, [filters, pagination.limit]);

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
        toast.success("CSV berhasil diekspor");
      } else {
        toast.error("Gagal mengekspor CSV");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor CSV");
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
        onFilterChange={handleFilterChange}
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
