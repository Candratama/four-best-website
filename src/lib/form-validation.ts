/**
 * Form validation utilities for ContactForm
 * Extracted to a separate file to enable testing without CSS dependencies
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

/**
 * Validates contact form data
 * @param data - The form data to validate
 * @returns An object containing validation errors (empty if valid)
 */
export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone || data.phone.trim() === "") {
    errors.phone = "Nomor telepon/WhatsApp diperlukan";
  } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(data.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Nomor telepon tidak valid (contoh: 08123456789 atau +628123456789)";
  }

  if (!data.message || data.message.trim() === "") {
    errors.message = "Message is required";
  }

  return errors;
}

/**
 * Checks if there are any validation errors
 * @param errors - The validation errors object
 * @returns true if there are errors, false otherwise
 */
export function hasValidationErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
