"use server";

import {
  getContactSubmissions,
  getContactSubmissionById,
  updateContactSubmission,
  getSubmissionStats,
  getContactSubmissionsCount,
  type ContactSubmission,
  type SubmissionFilters,
  type SubmissionStats,
} from "@/lib/db";
import { sendAdminNotification, sendVisitorConfirmation, addToContactList } from "@/lib/brevo";
import { revalidatePath } from "next/cache";

// Get submissions with filters
export async function getSubmissions(
  filters?: SubmissionFilters,
  page: number = 1,
  limit: number = 20
) {
  try {
    const offset = (page - 1) * limit;
    const submissions = await getContactSubmissions(filters, limit, offset);

    // Get total count for pagination
    const total = await getContactSubmissionsCount(filters);

    return {
      success: true,
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return { success: false, error: "Failed to fetch submissions" };
  }
}

// Get single submission
export async function getSubmission(id: number) {
  try {
    const submission = await getContactSubmissionById(id);
    if (!submission) {
      return { success: false, error: "Submission not found" };
    }
    return { success: true, submission };
  } catch (error) {
    console.error("Failed to fetch submission:", error);
    return { success: false, error: "Failed to fetch submission" };
  }
}

// Update submission
export async function updateSubmissionAction(
  id: number,
  data: {
    status?: ContactSubmission["status"];
    notes?: string | null;
    due_date?: string | null;
    closed_reason?: string | null;
    is_responded?: number;
  }
) {
  try {
    await updateContactSubmission(id, data);
    revalidatePath("/admin/submissions");
    return { success: true };
  } catch (error) {
    console.error("Failed to update submission:", error);
    return { success: false, error: "Failed to update submission" };
  }
}

// Get statistics
export async function getStats(): Promise<{ success: boolean; stats?: SubmissionStats; error?: string }> {
  try {
    const stats = await getSubmissionStats();
    return { success: true, stats };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

// Export to CSV
export async function exportSubmissionsCSV(filters?: SubmissionFilters) {
  try {
    const submissions = await getContactSubmissions(filters, 1000, 0);

    // Create CSV header
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Message",
      "Preferred Date",
      "Preferred Time",
      "Status",
      "Notes",
      "Due Date",
      "Responded",
      "Closed Reason",
      "Email Sent",
      "Email Error",
      "Source",
      "Created At",
    ];

    // Create CSV rows
    const rows = submissions.map((sub) => [
      sub.id,
      sub.name,
      sub.email,
      sub.phone,
      sub.message.replace(/"/g, '""'), // Escape quotes
      sub.preferred_date || "",
      sub.preferred_time || "",
      sub.status,
      (sub.notes || "").replace(/"/g, '""'),
      sub.due_date || "",
      sub.is_responded ? "Yes" : "No",
      sub.closed_reason || "",
      sub.email_sent ? "Yes" : "No",
      sub.email_error || "",
      sub.source,
      sub.created_at,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return { success: true, csv: csvContent };
  } catch (error) {
    console.error("Failed to export CSV:", error);
    return { success: false, error: "Failed to export CSV" };
  }
}

// Retry sending email
export async function resendEmail(submissionId: number) {
  try {
    const submission = await getContactSubmissionById(submissionId);
    if (!submission) {
      return { success: false, error: "Submission not found" };
    }

    // Prepare payload
    const payload = {
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      date: submission.preferred_date || "",
      time: submission.preferred_time || "",
      message: submission.message,
    };

    // Try sending emails
    let emailSent = 1;
    let emailError: string | null = null;

    try {
      const [adminResult] = await Promise.all([
        sendAdminNotification(payload),
        addToContactList(payload),
        sendVisitorConfirmation(payload),
      ]);

      if (!adminResult.success) {
        emailSent = 0;
        emailError = `Admin notification failed: ${adminResult.error || "Unknown error"}`;
      }
    } catch (err) {
      emailSent = 0;
      emailError = `Email sending failed: ${err instanceof Error ? err.message : "Unknown error"}`;
    }

    // Update submission
    await updateContactSubmission(submissionId, {
      email_sent: emailSent,
      email_error: emailError,
    });

    revalidatePath("/admin/submissions");

    if (emailSent) {
      return { success: true, message: "Email sent successfully" };
    } else {
      return { success: false, error: emailError || "Failed to send email" };
    }
  } catch (error) {
    console.error("Failed to resend email:", error);
    return { success: false, error: "Failed to resend email" };
  }
}
