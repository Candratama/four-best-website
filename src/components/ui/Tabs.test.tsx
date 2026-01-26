/**
 * Feature: template-porting, Property 2: Tab Content Switching
 * Validates: Requirements 4.7
 *
 * Property: For any tab in the tabbed room discovery section, clicking that tab
 * SHALL display only the content associated with that tab and hide all other tab contents.
 */

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import Tabs, { type TabItem } from "./Tabs";

describe("Tabs Component - Property-Based Tests", () => {
  afterEach(() => {
    cleanup();
  });

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
              label: fc.stringMatching(/^Tab[0-9]{1,3}$/),
              content: fc.stringMatching(/^Content[0-9]{1,3}$/),
            }),
            { minLength: 2, maxLength: 5 }
          )
          .filter((tabs) => {
            // Ensure all labels are unique
            const labels = tabs.map((t) => t.label);
            return new Set(labels).size === labels.length;
          })
          .chain((tabs) =>
            fc.record({
              tabs: fc.constant(tabs),
              selectedIndex: fc.integer({ min: 0, max: tabs.length - 1 }),
            })
          ),
        async ({ tabs, selectedIndex }) => {
          cleanup(); // Ensure clean state before each test

          // Convert string content to ReactNode for the component
          const tabItems: TabItem[] = tabs.map((tab, idx) => ({
            label: tab.label,
            content: <div data-testid={`content-${idx}`}>{tab.content}</div>,
          }));

          const user = userEvent.setup();
          render(<Tabs items={tabItems} defaultActive={0} />);

          // Click on the selected tab
          const tabButton = screen.getByText(tabs[selectedIndex].label);
          await user.click(tabButton);

          // Verify only the selected tab content is visible
          for (let i = 0; i < tabs.length; i++) {
            const content = screen.getByTestId(`content-${i}`);

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
  }, 60000); // 60 second timeout for PBT
});
