"use client";

import { useWow } from "@/hooks";
import { Hero, ContactForm } from "@/components/sections";

export default function ContactPage() {
  useWow();

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    date: string;
    time: string;
    message: string;
  }) => {
    // TODO: Implement actual form submission logic
    // For now, simulate a successful submission
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      {/* Hero Section */}
      <Hero
        variant="parallax-contact"
        title="Schedule a Visit"
        subtitle="We'll Be Happy to Show You Around!"
        backgroundImage="/images/background/8.webp"
      />

      {/* Contact Form Section */}
      <ContactForm variant="contact-page" onSubmit={handleFormSubmit} />
    </>
  );
}
