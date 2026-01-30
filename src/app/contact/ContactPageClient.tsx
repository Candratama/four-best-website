"use client";

import { useState } from "react";
import { useWow } from "@/hooks";
import { ContactForm, ContactInfo, GoogleMap } from "@/components/sections";
import { submitContactForm, ContactFormResult } from "./actions";

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
  const [submitStatus, setSubmitStatus] = useState<ContactFormResult | null>(null);

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    date: string;
    time: string;
    message: string;
  }) => {
    setSubmitStatus(null);
    const result = await submitContactForm(data);
    setSubmitStatus(result);
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
                <h3 className="contact-info-title mb-4">Kirim Pesan</h3>
                {submitStatus && (
                  <div
                    className={`alert mb-4 ${submitStatus.success ? "alert-info" : "alert-danger"}`}
                    role="alert"
                  >
                    {submitStatus.message}
                  </div>
                )}
                <ContactForm variant="inline" onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GoogleMap 
        mapUrl={contactData.mapUrl}
        address={contactData.address} 
        height="450px"
      />
    </>
  );
}
