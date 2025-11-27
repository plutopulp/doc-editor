/**
 * @jest-environment jsdom
 */

import { layout } from "@/layout/engine";
import { LayoutOptions } from "@/types/layout";

// Mock measureTextWidth: each character has width 1
jest.mock("@/layout/measure", () => ({
  measureTextWidth: (text: string) => text.length,
}));

describe("layout (pagination)", () => {
  const options: Partial<LayoutOptions> = {
    pageWidth: 20, // maxWidth ~ 0 (but we only care about lines per page here)
    pageHeight: 60,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 10, // => 6 lines per page
  };

  it("splits long text into multiple pages", () => {
    const line = "abcdefghij"; // 10 chars
    const text = Array.from({ length: 20 }, () => line + "\n").join("");
    const pages = layout(text, options);

    expect(pages.length).toBeGreaterThan(1);

    // Ensure pages cover the whole text without gaps or overlaps
    let lastEnd = 0;
    for (const p of pages) {
      expect(p.start).toBe(lastEnd);
      expect(p.end).toBeGreaterThan(p.start);
      lastEnd = p.end;
    }
    expect(lastEnd).toBe(text.length);
  });
});
