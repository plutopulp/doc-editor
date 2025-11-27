/**
 * @jest-environment jsdom
 */

import { layout } from "@/layout/engine";
import { LayoutOptions } from "@/types/layout";

jest.mock("@/layout/measure", () => ({
  measureTextWidth: (text: string, _font: string) => text.length,
}));

describe("layout edge cases and validation", () => {
  const base: Partial<LayoutOptions> = {
    pageWidth: 100,
    pageHeight: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: 10,
  };

  it("throws when page width is too small for margins", () => {
    expect(() =>
      layout("hello", {
        ...base,
        pageWidth: 10,
      })
    ).toThrow("Page width too small for margins");
  });

  it("throws when page height is too small for margins", () => {
    expect(() =>
      layout("hello", {
        ...base,
        pageHeight: 10,
      })
    ).toThrow("Page height too small for margins");
  });

  it("throws when line height is non-positive", () => {
    expect(() =>
      layout("hello", {
        ...base,
        lineHeight: 0,
      })
    ).toThrow("Line height must be positive");
  });

  it("handles string with only spaces", () => {
    const text = "   ";
    const pages = layout(text, base);
    expect(pages.length).toBe(1);
    expect(pages[0].start).toBe(0);
    expect(pages[0].end).toBe(text.length);
  });

  it("handles repeated newlines", () => {
    const text = "a\n\n\n";
    const pages = layout(text, base);
    expect(pages.length).toBeGreaterThanOrEqual(1);
    expect(pages[0].end).toBe(text.length);
  });

  it("handles a single extremely long word without crashing", () => {
    const text = "x".repeat(1000);
    const pages = layout(text, base);
    expect(pages.length).toBeGreaterThanOrEqual(1);
    expect(pages[0].end).toBe(text.length);
  });
});

