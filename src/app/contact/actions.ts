"use server";

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

    // TODO: Implement actual email sending or database storage
    // For now, log the submission
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      date: data.date,
      time: data.time,
      message: data.message,
      submittedAt: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      message: "Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera."
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
