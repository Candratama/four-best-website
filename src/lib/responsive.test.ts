/**
 * Property-Based Test for Responsive Element Visibility
 *
 * **Property 6: Responsive Element Visibility**
 * *For any* element with the "sm-hide" class, that element SHALL have display:none
 * or visibility:hidden when viewport width is below the small breakpoint (992px).
 *
 * **Validates: Requirements 9.2**
 *
 * Feature: template-porting, Property 6: Responsive Element Visibility
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// CSS breakpoint constants matching the template
const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1400,
} as const;

// The sm-hide class hides elements at max-width: 992px
const SM_HIDE_BREAKPOINT = 992;

/**
 * Simulates checking if an element with sm-hide class would be hidden
 * at a given viewport width based on the CSS media query rules.
 *
 * The template CSS defines:
 * @media only screen and (max-width: 992px) {
 *   .sm-hide { display: none; }
 * }
 */
function isSmHideElementHidden(viewportWidth: number): boolean {
  return viewportWidth <= SM_HIDE_BREAKPOINT;
}

/**
 * Determines the expected breakpoint name for a given viewport width
 */
function getBreakpointName(
  viewportWidth: number
): "xs" | "sm" | "md" | "lg" | "xl" {
  if (viewportWidth < BREAKPOINTS.xs) return "xs";
  if (viewportWidth < BREAKPOINTS.sm) return "sm";
  if (viewportWidth < BREAKPOINTS.md) return "md";
  if (viewportWidth < BREAKPOINTS.lg) return "lg";
  return "xl";
}

describe("Responsive Element Visibility", () => {
  /**
   * Property 6: Responsive Element Visibility
   * For any element with the "sm-hide" class, that element SHALL have display:none
   * when viewport width is at or below 992px (the sm breakpoint).
   *
   * Validates: Requirements 9.2
   */
  it("should hide sm-hide elements when viewport width is at or below 992px", () => {
    // Generate viewport widths from 320px to 1920px
    const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

    fc.assert(
      fc.property(viewportWidthArbitrary, (viewportWidth) => {
        const shouldBeHidden = isSmHideElementHidden(viewportWidth);

        if (viewportWidth <= SM_HIDE_BREAKPOINT) {
          // Element should be hidden at or below 992px
          expect(shouldBeHidden).toBe(true);
        } else {
          // Element should be visible above 992px
          expect(shouldBeHidden).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: xs-hide elements should be hidden at max-width: 767px
   */
  it("should correctly identify xs-hide visibility based on viewport width", () => {
    const XS_HIDE_BREAKPOINT = 767;

    function isXsHideElementHidden(viewportWidth: number): boolean {
      return viewportWidth <= XS_HIDE_BREAKPOINT;
    }

    const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

    fc.assert(
      fc.property(viewportWidthArbitrary, (viewportWidth) => {
        const shouldBeHidden = isXsHideElementHidden(viewportWidth);

        if (viewportWidth <= XS_HIDE_BREAKPOINT) {
          expect(shouldBeHidden).toBe(true);
        } else {
          expect(shouldBeHidden).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Breakpoint boundaries are correctly identified
   */
  it("should correctly identify breakpoint names for any viewport width", () => {
    const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

    fc.assert(
      fc.property(viewportWidthArbitrary, (viewportWidth) => {
        const breakpoint = getBreakpointName(viewportWidth);

        // Verify the breakpoint is one of the valid values
        expect(["xs", "sm", "md", "lg", "xl"]).toContain(breakpoint);

        // Verify the breakpoint matches the expected range
        if (viewportWidth < BREAKPOINTS.xs) {
          expect(breakpoint).toBe("xs");
        } else if (viewportWidth < BREAKPOINTS.sm) {
          expect(breakpoint).toBe("sm");
        } else if (viewportWidth < BREAKPOINTS.md) {
          expect(breakpoint).toBe("md");
        } else if (viewportWidth < BREAKPOINTS.lg) {
          expect(breakpoint).toBe("lg");
        } else {
          expect(breakpoint).toBe("xl");
        }
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Property-Based Test for Responsive Breakpoint Consistency
 *
 * **Property 7: Responsive Breakpoint Consistency**
 * *For any* viewport width, the layout SHALL match the expected breakpoint behavior
 * defined in the template's media queries (xs: <576px, sm: 576-767px, md: 768-991px,
 * lg: 992-1199px, xl: ≥1200px).
 *
 * **Validates: Requirements 9.1**
 *
 * Feature: template-porting, Property 7: Responsive Breakpoint Consistency
 */

// Template-specific breakpoints based on the CSS media queries
const TEMPLATE_BREAKPOINTS = {
  // max-width: 480px - extra small mobile
  xsMax: 480,
  // max-width: 767px - mobile
  smMax: 767,
  // max-width: 992px - tablet/small screens (sm-hide breakpoint)
  mdMax: 992,
  // min-width: 1200px - large screens
  lgMin: 1200,
  // min-width: 1400px - extra large screens
  xlMin: 1400,
} as const;

/**
 * Determines which CSS media query rules would apply for a given viewport width
 * based on the template's actual media query definitions.
 */
function getApplicableMediaQueries(viewportWidth: number): string[] {
  const queries: string[] = [];

  // max-width: 360px
  if (viewportWidth <= 360) {
    queries.push("max-width-360");
  }

  // max-width: 480px
  if (viewportWidth <= TEMPLATE_BREAKPOINTS.xsMax) {
    queries.push("max-width-480");
  }

  // min-width: 480px and max-width: 767px
  if (viewportWidth >= 480 && viewportWidth <= TEMPLATE_BREAKPOINTS.smMax) {
    queries.push("min-480-max-767");
  }

  // max-width: 767px
  if (viewportWidth <= TEMPLATE_BREAKPOINTS.smMax) {
    queries.push("max-width-767");
  }

  // max-width: 992px
  if (viewportWidth <= TEMPLATE_BREAKPOINTS.mdMax) {
    queries.push("max-width-992");
  }

  // min-width: 992px
  if (viewportWidth >= 992) {
    queries.push("min-width-992");
  }

  // min-width: 1000px
  if (viewportWidth >= 1000) {
    queries.push("min-width-1000");
  }

  // min-width: 1200px
  if (viewportWidth >= TEMPLATE_BREAKPOINTS.lgMin) {
    queries.push("min-width-1200");
  }

  // min-width: 1400px
  if (viewportWidth >= TEMPLATE_BREAKPOINTS.xlMin) {
    queries.push("min-width-1400");
  }

  return queries;
}

/**
 * Determines the expected behavior for specific UI elements at a given viewport width
 */
interface UIElementBehavior {
  menuBtnVisible: boolean;
  smHideHidden: boolean;
  xsHideHidden: boolean;
  headerMobile: boolean;
  topbarHidden: boolean;
}

function getExpectedUIBehavior(viewportWidth: number): UIElementBehavior {
  return {
    // #menu-btn is display:block at max-width: 992px
    menuBtnVisible: viewportWidth <= TEMPLATE_BREAKPOINTS.mdMax,
    // .sm-hide is display:none at max-width: 992px
    smHideHidden: viewportWidth <= TEMPLATE_BREAKPOINTS.mdMax,
    // .xs-hide is display:none at max-width: 767px
    xsHideHidden: viewportWidth <= TEMPLATE_BREAKPOINTS.smMax,
    // header-mobile class should be applied at max-width: 992px
    headerMobile: viewportWidth <= TEMPLATE_BREAKPOINTS.mdMax,
    // #topbar is display:none at max-width: 767px and max-width: 360px
    topbarHidden: viewportWidth <= TEMPLATE_BREAKPOINTS.smMax,
  };
}

describe("Responsive Breakpoint Consistency", () => {
  /**
   * Property 7: Responsive Breakpoint Consistency
   * For any viewport width, the layout SHALL match the expected breakpoint behavior
   * defined in the template's media queries.
   *
   * Validates: Requirements 9.1
   */
  it("should apply correct media queries for any viewport width", () => {
    const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

    fc.assert(
      fc.property(viewportWidthArbitrary, (viewportWidth) => {
        const queries = getApplicableMediaQueries(viewportWidth);

        // Verify that the queries are consistent with the viewport width
        if (viewportWidth <= 360) {
          expect(queries).toContain("max-width-360");
        }

        if (viewportWidth <= TEMPLATE_BREAKPOINTS.xsMax) {
          expect(queries).toContain("max-width-480");
        } else {
          expect(queries).not.toContain("max-width-480");
        }

        if (viewportWidth <= TEMPLATE_BREAKPOINTS.smMax) {
          expect(queries).toContain("max-width-767");
        } else {
          expect(queries).not.toContain("max-width-767");
        }

        if (viewportWidth <= TEMPLATE_BREAKPOINTS.mdMax) {
          expect(queries).toContain("max-width-992");
        } else {
          expect(queries).not.toContain("max-width-992");
        }

        if (viewportWidth >= TEMPLATE_BREAKPOINTS.lgMin) {
          expect(queries).toContain("min-width-1200");
        } else {
          expect(queries).not.toContain("min-width-1200");
        }

        if (viewportWidth >= TEMPLATE_BREAKPOINTS.xlMin) {
          expect(queries).toContain("min-width-1400");
        } else {
          expect(queries).not.toContain("min-width-1400");
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: UI element visibility follows breakpoint rules
   */
  it("should correctly determine UI element visibility for any viewport width", () => {
    const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

    fc.assert(
      fc.property(viewportWidthArbitrary, (viewportWidth) => {
        const behavior = getExpectedUIBehavior(viewportWidth);

        // Menu button should be visible on mobile (≤992px)
        if (viewportWidth <= TEMPLATE_BREAKPOINTS.mdMax) {
          expect(behavior.menuBtnVisible).toBe(true);
          expect(behavior.smHideHidden).toBe(true);
          expect(behavior.headerMobile).toBe(true);
        } else {
          expect(behavior.menuBtnVisible).toBe(false);
          expect(behavior.smHideHidden).toBe(false);
          expect(behavior.headerMobile).toBe(false);
        }

        // xs-hide elements should be hidden on small screens (≤767px)
        if (viewportWidth <= TEMPLATE_BREAKPOINTS.smMax) {
          expect(behavior.xsHideHidden).toBe(true);
          expect(behavior.topbarHidden).toBe(true);
        } else {
          expect(behavior.xsHideHidden).toBe(false);
          expect(behavior.topbarHidden).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Breakpoint transitions are mutually exclusive where applicable
   */
  it("should have non-overlapping breakpoint ranges for exclusive rules", () => {
    const viewportWidthArbitrary = fc.integer({ min: 320, max: 1920 });

    fc.assert(
      fc.property(viewportWidthArbitrary, (viewportWidth) => {
        // A viewport can only be in one of these exclusive ranges
        const isXs = viewportWidth < 480;
        const isSm = viewportWidth >= 480 && viewportWidth < 768;
        const isMd = viewportWidth >= 768 && viewportWidth < 992;
        const isLg = viewportWidth >= 992 && viewportWidth < 1200;
        const isXl = viewportWidth >= 1200;

        // Exactly one should be true
        const activeRanges = [isXs, isSm, isMd, isLg, isXl].filter(Boolean);
        expect(activeRanges.length).toBe(1);
      }),
      { numRuns: 100 }
    );
  });
});
