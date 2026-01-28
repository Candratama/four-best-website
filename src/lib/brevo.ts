"use server";

import * as Brevo from "@getbrevo/brevo";

// Initialize Brevo API clients
function getTransactionalEmailApi() {
  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || ""
  );
  return apiInstance;
}

function getContactsApi() {
  const apiInstance = new Brevo.ContactsApi();
  apiInstance.setApiKey(
    Brevo.ContactsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || ""
  );
  return apiInstance;
}

// Configuration
const ADMIN_EMAIL = "contact@4best.id"; // Email admin yang menerima notifikasi
const SENDER_EMAIL = "noreply@4best.id"; // Email pengirim (harus verified di Brevo)
const SENDER_NAME = "4Best Property";
const CONTACT_LIST_ID = 2; // ID list di Brevo (buat list dulu di dashboard Brevo)

export interface ContactFormPayload {
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
}

/**
 * Send notification email to admin when someone submits contact form
 */
export async function sendAdminNotification(data: ContactFormPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = getTransactionalEmailApi();

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL, name: "4Best Admin" }];
    sendSmtpEmail.replyTo = { email: data.email, name: data.name };
    sendSmtpEmail.subject = `[4Best] Permintaan Kunjungan dari ${data.name}`;
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #162d50; border-bottom: 2px solid #162d50; padding-bottom: 10px;">
              Permintaan Kunjungan Baru
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Nama</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <a href="mailto:${data.email}">${data.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Tanggal Kunjungan</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.date || "Belum ditentukan"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Waktu</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.time || "Belum ditentukan"}</td>
              </tr>
            </table>

            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #162d50;">Pesan:</h3>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>

            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Email ini dikirim otomatis dari website 4Best Property.
            </p>
          </div>
        </body>
      </html>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (error) {
    console.error("Brevo send email error:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Add contact to Brevo contact list for follow-up
 */
export async function addToContactList(data: ContactFormPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = getContactsApi();

    const createContact = new Brevo.CreateContact();
    createContact.email = data.email;
    createContact.listIds = [CONTACT_LIST_ID];
    createContact.attributes = {
      FIRSTNAME: data.name.split(" ")[0],
      LASTNAME: data.name.split(" ").slice(1).join(" ") || "",
      NAMA_LENGKAP: data.name,
      TANGGAL_KUNJUNGAN: data.date || "",
      WAKTU_KUNJUNGAN: data.time || "",
      PESAN: data.message,
      SUMBER: "Website Contact Form",
      TANGGAL_SUBMIT: new Date().toISOString(),
    };
    createContact.updateEnabled = true; // Update if contact already exists

    await apiInstance.createContact(createContact);
    return { success: true };
  } catch (error) {
    console.error("Brevo add contact error:", error);
    // Don't fail if contact already exists
    if (String(error).includes("Contact already exist")) {
      return { success: true };
    }
    return { success: false, error: String(error) };
  }
}

/**
 * Send confirmation email to the visitor
 */
export async function sendVisitorConfirmation(data: ContactFormPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = getTransactionalEmailApi();

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: data.email, name: data.name }];
    sendSmtpEmail.subject = "Terima Kasih - 4Best Property";
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #162d50;">Halo ${data.name.split(" ")[0]},</h2>

            <p>Terima kasih telah menghubungi <strong>4Best Property</strong>!</p>

            <p>Kami telah menerima permintaan kunjungan Anda dengan detail berikut:</p>

            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Tanggal:</strong> ${data.date || "Akan dikonfirmasi"}</p>
              <p><strong>Waktu:</strong> ${data.time || "Akan dikonfirmasi"}</p>
            </div>

            <p>Tim kami akan segera menghubungi Anda untuk konfirmasi jadwal kunjungan.</p>

            <p>Jika ada pertanyaan, silakan hubungi kami melalui:</p>
            <ul>
              <li>WhatsApp: +62 812 3456 7890</li>
              <li>Email: contact@4best.id</li>
            </ul>

            <p style="margin-top: 30px;">Salam hangat,<br><strong>Tim 4Best Property</strong></p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Perum Ungaran Asri JL. Serasi Raya Atas No C1, Ungaran, Kab. Semarang
            </p>
          </div>
        </body>
      </html>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (error) {
    console.error("Brevo send confirmation error:", error);
    return { success: false, error: String(error) };
  }
}
