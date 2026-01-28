"use server";

import {
  sendAdminNotification,
  addToContactList,
  sendVisitorConfirmation,
  ContactFormPayload,
} from "@/lib/brevo";

export interface ContactFormData {
  name: string;
  email: string;
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
    if (!data.name || !data.email || !data.message) {
      return { success: false, message: "Mohon lengkapi semua field yang wajib diisi." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: "Format email tidak valid." };
    }

    const payload: ContactFormPayload = {
      name: data.name,
      email: data.email,
      date: data.date,
      time: data.time,
      message: data.message,
    };

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
      console.error("Failed to send admin notification:", adminResult.error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi kami via WhatsApp.",
      };
    }

    return {
      success: true,
      message: "Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
