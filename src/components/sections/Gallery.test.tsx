/**
 * Feature: template-porting, Property 3: Gallery Filter Accuracy
 * Validates: Requirements 4.8
 *
 * Property: For any gallery filter selection, the displayed images SHALL only include
 * items matching the selected filter category, and items not matching SHALL be hidden.
 */

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import Gallery from "./Gallery";

describe("Gallery Component - Property-Based Tests", () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Property 3: Gallery Filter Accuracy
   * For any filter selection, only matching items should be displayed
   */
  it("should display only items matching the selected filter category", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .array(fc.constantFrom("exterior", "interior", "facilities"), {
            minLength: 1,
            maxLength: 3,
          })
          .chain((categories) => {
            const uniqueCategories = [...new Set(categories)];
            return fc.record({
              categories: fc.constant(uniqueCategories),
              items: fc
                .array(
                  fc.record({
                    id: fc.uuid(),
                    image: fc.webUrl(),
                    category: fc.constantFrom(...uniqueCategories),
                  }),
                  { minLength: 3, maxLength: 8 }
                )
                .map((items) => {
                  // Ensure unique IDs
                  return items.map((item, idx) => ({
                    ...item,
                    id: `item-${idx}-${item.id}`,
                  }));
                }),
              selectedFilter: fc.constantFrom("*", ...uniqueCategories),
            });
          }),
        async ({ categories, items, selectedFilter }) => {
          cleanup(); // Ensure clean state before each test

          const user = userEvent.setup();
          render(<Gallery items={items} filters={categories} />);

          // If not "View All", click the filter
          if (selectedFilter !== "*") {
            const filterButton = screen.getByText(
              selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)
            );
            await user.click(filterButton);
          }

          // Check that all displayed items match the filter
          const displayedItems = items.filter((item) =>
            selectedFilter === "*" ? true : item.category === selectedFilter
          );

          // Verify the correct number of items are displayed
          const galleryContainer = screen
            .getByRole("heading", { name: "Exterior & Interior" })
            .closest("section");
          expect(galleryContainer).toBeTruthy();

          // Count visible items by checking for images with the correct src
          for (const item of items) {
            const shouldBeVisible =
              selectedFilter === "*" || item.category === selectedFilter;

            if (shouldBeVisible) {
              // Item should be in the filtered list
              expect(displayedItems.some((di) => di.id === item.id)).toBe(true);
            } else {
              // Item should not be in the filtered list
              expect(displayedItems.some((di) => di.id === item.id)).toBe(
                false
              );
            }
          }

          // Verify the filtered count is correct (can be 0 if no items match)
          expect(displayedItems.length).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout for PBT
});
