"use server";

import {
  sendAdminNotification,
  addToContactList,
  sendVisitorConfirmation,
  ContactFormPayload,
} from "@/lib/brevo";
import { createContactSubmission, updateContactSubmission } from "@/lib/db";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

export interface ContactFormResult {
  success: boolean;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactFormResult> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return { success: false, message: "Mohon lengkapi semua field yang wajib diisi." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: "Format email tidak valid." };
    }

    // Step 1: Save to database FIRST (highest priority)
    let submissionId: number;
    try {
      submissionId = await createContactSubmission({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        preferred_date: data.date || null,
        preferred_time: data.time || null,
        status: "new",
        notes: null,
        due_date: null,
        is_responded: 0,
        closed_reason: null,
        email_sent: 0,
        email_error: null,
        source: "website",
      });
      console.log("Submission saved to database with ID:", submissionId);
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      return {
        success: false,
        message: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
      };
    }

    // Step 2: Send emails via Brevo (secondary, failure is logged but not critical)
    const payload: ContactFormPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      message: data.message,
    };

    let emailSent = 1;
    let emailError: string | null = null;

    try {
      // Execute all Brevo operations in parallel
      const [adminResult, contactResult, confirmationResult] = await Promise.all([
        sendAdminNotification(payload),
        addToContactList(payload),
        sendVisitorConfirmation(payload),
      ]);

      // Log results for debugging
      console.log("Brevo results:", {
        adminNotification: adminResult,
        contactList: contactResult,
        visitorConfirmation: confirmationResult,
      });

      // Check if admin notification was sent (most critical)
      if (!adminResult.success) {
        emailSent = 0;
        emailError = `Admin notification failed: ${adminResult.error || "Unknown error"}`;
        console.error("Failed to send admin notification:", adminResult.error);
      }
    } catch (emailErr) {
      emailSent = 0;
      emailError = `Email sending failed: ${emailErr instanceof Error ? emailErr.message : "Unknown error"}`;
      console.error("Email error:", emailErr);
    }

    // Step 3: Update submission with email status
    try {
      await updateContactSubmission(submissionId, {
        email_sent: emailSent,
        email_error: emailError,
      });
    } catch (updateErr) {
      console.error("Failed to update email status:", updateErr);
      // Non-critical, continue
    }

    // Always return success since data was saved to database
    return {
      success: true,
      message: "Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
