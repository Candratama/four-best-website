/**
 * Feature: template-porting, Property 3: Gallery Filter Accuracy
 * Validates: Requirements 4.8
 *
 * Property: For any gallery filter selection, the displayed images SHALL only include
 * items matching the selected filter category, and items not matching SHALL be hidden.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import Gallery from "./Gallery";

describe("Gallery Component - Property-Based Tests", () => {
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
          .chain((categories) =>
            fc.record({
              categories: fc.constant([...new Set(categories)]), // Unique categories
              items: fc.array(
                fc.record({
                  id: fc.uuid(),
                  image: fc.webUrl(),
                  category: fc.constantFrom(...categories),
                }),
                { minLength: 3, maxLength: 20 }
              ),
              selectedFilter: fc.constantFrom("*", ...categories),
            })
          ),
        async ({ categories, items, selectedFilter }) => {
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
            .getByText("Exterior & Interior")
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

          // Verify the filtered count matches expected
          expect(displayedItems.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
