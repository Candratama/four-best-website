/**
 * Feature: template-porting, Property 2: Tab Content Switching
 * Validates: Requirements 4.7
 *
 * Property: For any tab in the tabbed room discovery section, clicking that tab
 * SHALL display only the content associated with that tab and hide all other tab contents.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import Tabs, { type TabItem } from "./Tabs";

describe("Tabs Component - Property-Based Tests", () => {
  /**
   * Property 2: Tab Content Switching
   * For any tab selection, only the selected tab's content should be visible
   */
  it("should display only the selected tab content and hide all others", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .array(
            fc.record({
              label: fc.string({ minLength: 1, maxLength: 20 }),
              content: fc.string({ minLength: 1, maxLength: 50 }),
            }),
            { minLength: 2, maxLength: 10 }
          )
          .chain((tabs) =>
            fc.record({
              tabs: fc.constant(tabs),
              selectedIndex: fc.integer({ min: 0, max: tabs.length - 1 }),
            })
          ),
        async ({ tabs, selectedIndex }) => {
          // Convert string content to ReactNode for the component
          const tabItems: TabItem[] = tabs.map((tab) => ({
            label: tab.label,
            content: (
              <div data-testid={`content-${tab.label}`}>{tab.content}</div>
            ),
          }));

          const user = userEvent.setup();
          const { rerender } = render(
            <Tabs items={tabItems} defaultActive={0} />
          );

          // Click on the selected tab
          const tabButton = screen.getByText(tabs[selectedIndex].label);
          await user.click(tabButton);

          // Force a rerender to ensure state updates are reflected
          rerender(<Tabs items={tabItems} defaultActive={0} />);

          // Verify only the selected tab content is visible
          for (let i = 0; i < tabs.length; i++) {
            const content = screen.getByTestId(`content-${tabs[i].label}`);

            if (i === selectedIndex) {
              // Selected tab content should be visible (display: block or not display: none)
              expect(content.parentElement?.style.display).not.toBe("none");
            } else {
              // Other tab contents should be hidden (display: none)
              expect(content.parentElement?.style.display).toBe("none");
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
