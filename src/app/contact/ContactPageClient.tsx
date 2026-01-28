"use client";

import { useWow } from "@/hooks";
import { ContactForm, ContactInfo, GoogleMap } from "@/components/sections";

interface ContactData {
  address: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  instagram: string;
  mapUrl: string;
}

interface ContactPageClientProps {
  contactData: ContactData;
}

export default function ContactPageClient({ contactData }: ContactPageClientProps) {
  useWow();

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    date: string;
    time: string;
    message: string;
  }) => {
    // TODO: Implement actual form submission logic
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      <section id="section-contact">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <ContactInfo
                address={contactData.address}
                whatsapp={contactData.whatsapp}
                email={contactData.email}
                openingHours={contactData.openingHours}
                instagram={contactData.instagram}
              />
            </div>
            <div className="col-lg-8">
              <div className="contact-form-wrapper">
                <h3 className="contact-info-title mb-4">Jadwalkan Kunjungan</h3>
                <ContactForm variant="inline" onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GoogleMap mapUrl={contactData.mapUrl} address={contactData.address} height="450px" />
    </>
  );
}
