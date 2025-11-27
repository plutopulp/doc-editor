import { layout } from "@/lib/layout/engine";
import { LayoutOptions } from "@/types/layout";

// Mock measureTextWidth: each character has width 1
jest.mock("@/lib/layout/measure", () => ({
  measureTextWidth: (text: string) => text.length,
}));

describe("layout (basic single-page)", () => {
  const defaultOptions: Partial<LayoutOptions> = {
    pageWidth: 100,
    pageHeight: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: 10,
  };

  it("returns a single empty page for empty text", () => {
    const pages = layout("", defaultOptions);
    expect(pages).toEqual([{ pageIndex: 0, start: 0, end: 0 }]);
  });

  it("returns a single slice for simple text", () => {
    const text = "hello";
    const pages = layout(text, defaultOptions);
    expect(pages).toEqual([{ pageIndex: 0, start: 0, end: text.length }]);
  });

  it("includes newlines in char indices but keeps single page", () => {
    const text = "hello\nworld";
    const pages = layout(text, defaultOptions);
    expect(pages.length).toBe(1);
    expect(pages[0]).toEqual({
      pageIndex: 0,
      start: 0,
      end: text.length,
    });
  });
});
