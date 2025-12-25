/**
 * Property-Based Test for TeamCard Content Completeness
 *
 * **Property 4: Team Card Content Completeness**
 * *For any* team member card rendered in the team section, the card SHALL display
 * the member's name, role, and at least one social media link.
 *
 * **Validates: Requirements 5.5**
 *
 * Feature: template-porting, Property 4: Team Card Content Completeness
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as fc from "fast-check";
import TeamCard, { TeamMember } from "./TeamCard";

// Arbitrary for generating valid team member props with at least one social link
const teamMemberArbitrary = fc
  .record({
    id: fc.uuid(),
    name: fc
      .string({ minLength: 1, maxLength: 100 })
      .filter((s) => s.trim().length > 0),
    role: fc
      .string({ minLength: 1, maxLength: 100 })
      .filter((s) => s.trim().length > 0),
    image: fc.webUrl(),
    social: fc.record({
      facebook: fc.option(fc.webUrl(), { nil: undefined }),
      twitter: fc.option(fc.webUrl(), { nil: undefined }),
      instagram: fc.option(fc.webUrl(), { nil: undefined }),
    }),
  })
  .filter((member) => {
    // Ensure at least one social link exists
    return !!(
      member.social.facebook ||
      member.social.twitter ||
      member.social.instagram
    );
  }) as fc.Arbitrary<TeamMember>;

describe("TeamCard", () => {
  /**
   * Property 4: Team Card Content Completeness
   * For any team member card, the rendered output must contain the member's name,
   * role, and at least one social media link.
   *
   * Validates: Requirements 5.5
   */
  it("should always display member name, role, and at least one social link for any valid input", () => {
    fc.assert(
      fc.property(teamMemberArbitrary, (member) => {
        const { container } = render(<TeamCard member={member} />);

        // Check that the name is displayed
        const nameElement = container.querySelector("h4");
        expect(nameElement).toBeTruthy();
        expect(nameElement?.textContent).toBe(member.name);

        // Check that the role is displayed
        const roleElement = container.querySelector("p");
        expect(roleElement).toBeTruthy();
        expect(roleElement?.textContent).toBe(member.role);

        // Check that at least one social link is displayed
        const socialIcons = container.querySelector(".social-icons");
        expect(socialIcons).toBeTruthy();

        const socialLinks = socialIcons?.querySelectorAll("a");
        expect(socialLinks?.length).toBeGreaterThan(0);

        // Cleanup for next iteration
        container.remove();
      }),
      { numRuns: 100 }
    );
  });
});
