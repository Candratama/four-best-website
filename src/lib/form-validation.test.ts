/**
 * Property-Based Test for Form Validation Enforcement
 *
 * **Property 5: Form Validation Enforcement**
 * *For any* form submission attempt with empty required fields (name, email, message),
 * the form SHALL prevent submission and indicate which fields are missing.
 *
 * **Validates: Requirements 6.5**
 *
 * Feature: template-porting, Property 5: Form Validation Enforcement
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  validateContactForm,
  hasValidationErrors,
  type ContactFormData,
} from "./form-validation";

// Helper to generate whitespace-only strings
const whitespaceArbitrary = fc.array(fc.constant(" "), { minLength: 1, maxLength: 5 }).map(arr => arr.join(""));

// Arbitrary for generating form data with various empty field combinations
const formDataArbitrary = fc.record({
  name: fc.oneof(
    fc.constant(""), // Empty
    whitespaceArbitrary, // Whitespace only
    fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0) // Valid
  ),
  email: fc.oneof(
    fc.constant(""), // Empty
    whitespaceArbitrary, // Whitespace only
    fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes("@")), // Invalid format
    fc.emailAddress() // Valid
  ),
  date: fc.oneof(
    fc.constant(""),
    fc.integer({ min: 2020, max: 2030 }).chain((year) =>
      fc.integer({ min: 1, max: 12 }).chain((month) =>
        fc.integer({ min: 1, max: 28 }).map((day) =>
          `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        )
      )
    )
  ),
  time: fc.constantFrom(
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
    "20:00"
  ),
  message: fc.oneof(
    fc.constant(""), // Empty
    whitespaceArbitrary, // Whitespace only
    fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0) // Valid
  ),
}) as fc.Arbitrary<ContactFormData>;

// Helper to check if a field is empty or whitespace-only
const isEmptyOrWhitespace = (value: string): boolean => {
  return !value || value.trim() === "";
};

// Helper to check if email is valid
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

describe("ContactForm Validation", () => {
  /**
   * Property 5: Form Validation Enforcement
   * For any form submission attempt with empty required fields (name, email, message),
   * the form SHALL prevent submission and indicate which fields are missing.
   *
   * Validates: Requirements 6.5
   */
  it("should return errors for empty required fields and no errors for valid fields", () => {
    fc.assert(
      fc.property(formDataArbitrary, (formData) => {
        const errors = validateContactForm(formData);

        // Check name validation
        if (isEmptyOrWhitespace(formData.name)) {
          expect(errors.name).toBeDefined();
          expect(errors.name).toBe("Name is required");
        } else {
          expect(errors.name).toBeUndefined();
        }

        // Check email validation
        if (isEmptyOrWhitespace(formData.email)) {
          expect(errors.email).toBeDefined();
          expect(errors.email).toBe("Email is required");
        } else if (!isValidEmail(formData.email)) {
          expect(errors.email).toBeDefined();
          expect(errors.email).toBe("Please enter a valid email address");
        } else {
          expect(errors.email).toBeUndefined();
        }

        // Check message validation
        if (isEmptyOrWhitespace(formData.message)) {
          expect(errors.message).toBeDefined();
          expect(errors.message).toBe("Message is required");
        } else {
          expect(errors.message).toBeUndefined();
        }

        // Verify hasValidationErrors correctly identifies if there are errors
        const hasErrors = hasValidationErrors(errors);
        const shouldHaveErrors =
          isEmptyOrWhitespace(formData.name) ||
          isEmptyOrWhitespace(formData.email) ||
          !isValidEmail(formData.email) ||
          isEmptyOrWhitespace(formData.message);

        expect(hasErrors).toBe(shouldHaveErrors);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Valid form data should produce no errors
   */
  it("should produce no errors for completely valid form data", () => {
    const validFormDataArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
      email: fc.emailAddress(),
      date: fc.constant("2025-01-15"), // Use a constant valid date
      time: fc.constantFrom(
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
        "20:00"
      ),
      message: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
    }) as fc.Arbitrary<ContactFormData>;

    fc.assert(
      fc.property(validFormDataArbitrary, (formData) => {
        const errors = validateContactForm(formData);
        expect(hasValidationErrors(errors)).toBe(false);
        expect(errors.name).toBeUndefined();
        expect(errors.email).toBeUndefined();
        expect(errors.message).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });
});
