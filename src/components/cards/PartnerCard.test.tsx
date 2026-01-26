/**
 * Property-Based Test for PartnerCard Content Completeness
 *
 * **Property 1: Partner Card Content Completeness**
 * *For any* partner card rendered in the partners listing, the card SHALL display
 * both the partner name and size information.
 *
 * **Validates: Requirements 3.4**
 *
 * Feature: template-porting, Property 1: Partner Card Content Completeness
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as fc from "fast-check";
import PartnerCard from "./PartnerCard";

// Arbitrary for generating valid partner card props
const partnerCardArbitrary = fc.record({
  name: fc
    .stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/)
    .filter((s) => s.trim().length > 0),
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{0,49}$/).filter((s) => s.length > 0),
  image: fc.webUrl(),
  size: fc
    .stringMatching(/^[0-9]+\s?(sqm|sqft|m2)$/)
    .filter((s) => s.trim().length > 0),
});

describe("PartnerCard", () => {
  /**
   * Property 1: Partner Card Content Completeness
   * For any partner card, the rendered output must contain both the name and size.
   *
   * Validates: Requirements 3.4
   */
  it("should always display partner name and size for any valid input", () => {
    fc.assert(
      fc.property(partnerCardArbitrary, (props) => {
        const { container } = render(<PartnerCard {...props} />);

        // Check that the name is displayed
        const nameElement = container.querySelector("h3");
        expect(nameElement).toBeTruthy();
        expect(nameElement?.textContent).toBe(props.name);

        // Check that the size is displayed
        expect(container.textContent).toContain(props.size);

        // Cleanup for next iteration
        container.remove();
      }),
      { numRuns: 100 }
    );
  });
});
