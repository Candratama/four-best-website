"use client";

import { useState, useCallback } from "react";
import { AnimatedSection, AnimatedButton } from "@/components/ui";
import {
  validateContactForm,
  hasValidationErrors,
  type ContactFormData,
  type ContactFormErrors,
} from "@/lib/form-validation";

// Re-export types for convenience
export type { ContactFormData, ContactFormErrors };
export { validateContactForm, hasValidationErrors };

interface ContactFormProps {
  subtitle?: string;
  title?: string;
  variant?: "default" | "inline" | "contact-page";
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export default function ContactForm({
  subtitle = "Get in Touch",
  title = "Schedule a Visit",
  variant = "default",
  onSubmit,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    date: "",
    time: "10:00",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const validationErrors = validateContactForm(formData);
      setErrors(validationErrors);

      if (hasValidationErrors(validationErrors)) {
        return;
      }

      setStatus("submitting");

      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [formData, onSubmit]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name as keyof ContactFormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  // Time options from 10:00 to 20:00
  const timeOptions = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  // Contact page variant - matches template exactly
  if (variant === "contact-page") {
    return (
      <section id="section-contact">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-8">
              <form
                name="bookingForm"
                id="booking_form"
                onSubmit={handleSubmit}
              >
                <div className="row g-4">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Your Name"
                      aria-label="Your Name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <div
                        id="name-error"
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Your Email"
                      aria-label="Your Email"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <div
                        id="email-error"
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <div id="date" className="relative input-group date">
                      <i className="absolute top-0 end-0 id-color pt-3 pe-3 icofont-calendar"></i>
                      <input
                        className="form-control"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        aria-label="Select Date"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="relative">
                      <select
                        name="time"
                        id="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="form-control"
                        aria-label="Select Time"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <i className="absolute top-0 end-0 id-color pt-3 pe-3 icofont-simple-down"></i>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <textarea
                      name="message"
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`form-control h-150px ${
                        errors.message ? "is-invalid" : ""
                      }`}
                      placeholder="Submit Request"
                      aria-label="Your Message"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                    />
                    {errors.message && (
                      <div
                        id="message-error"
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-12">
                    <div className="text-center">
                      <div id="submit">
                        <AnimatedButton
                          type="submit"
                          disabled={status === "submitting"}
                          loading={status === "submitting"}
                        >
                          Send Message
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {status === "success" && (
                <div id="success_message_col" className="success">
                  Your message has been sent successfully. Refresh this page if
                  you want to send more messages.
                </div>
              )}
              {status === "error" && (
                <div id="error_message" className="error">
                  Sorry there was an error sending your form.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Inline variant for partner details page
  if (variant === "inline") {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Your Name"
                aria-label="Your Name"
              />
              {errors.name && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.name}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Your Email"
                aria-label="Your Email"
              />
              {errors.email && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                aria-label="Select Date"
              />
            </div>

            <div className="col-md-6">
              <div className="relative">
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-control"
                  aria-label="Select Time"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-12">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`form-control h-150px ${
                  errors.message ? "is-invalid" : ""
                }`}
                placeholder="Submit Request"
                aria-label="Your Message"
              />
              {errors.message && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.message}
                </div>
              )}
            </div>

            <div className="col-md-12">
              <div className="text-start">
                <AnimatedButton
                  type="submit"
                  disabled={status === "submitting"}
                  loading={status === "submitting"}
                >
                  Send Message
                </AnimatedButton>
              </div>
            </div>
          </div>
        </form>
        {status === "success" && (
          <div className="success mt-3">
            Your message has been sent successfully. Refresh this page if you
            want to send more messages.
          </div>
        )}
        {status === "error" && (
          <div className="error mt-3">
            Sorry there was an error sending your form.
          </div>
        )}
      </>
    );
  }

  // Default variant
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <p className="subtitle">{subtitle}</p>
            <h2 className="text-3xl lg:text-4xl font-light">{title}</h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-(--primary-color)"
                    placeholder="Your name"
                    aria-label="Your Name"
                  />
                  {errors.name && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-(--primary-color)"
                    placeholder="your@email.com"
                    aria-label="Your Email"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-(--primary-color)"
                    aria-label="Select Date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Time
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-(--primary-color)"
                    aria-label="Select Time"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-(--primary-color)"
                  placeholder="Tell us what you're looking for..."
                  aria-label="Your Message"
                />
                {errors.message && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.message}
                  </div>
                )}
              </div>

              <div className="text-center">
                <AnimatedButton
                  type="submit"
                  disabled={status === "submitting"}
                  loading={status === "submitting"}
                >
                  Send Message
                </AnimatedButton>
              </div>
            </form>
            {status === "success" && (
              <div className="success mt-4 text-center">
                Your message has been sent successfully.
              </div>
            )}
            {status === "error" && (
              <div className="error mt-4 text-center">
                Sorry there was an error sending your form.
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
