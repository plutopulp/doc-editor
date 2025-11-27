/**
 * @jest-environment jsdom
 */
import { measureTextWidth } from "@/lib/layout/measure";
import { FONT_FAMILY } from "@/lib/layout/constants";

// Mock Canvas 2D context since JSDOM doesn't fully support it
const mockMeasureText = jest.fn((text: string) => ({
  width: text.length * 10,
}));

beforeAll(() => {
  // Mock HTMLCanvasElement.getContext
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = jest.fn((tagName: string) => {
    if (tagName === "canvas") {
      const canvas = originalCreateElement("canvas");
      // @ts-expect-error - Mocking the context type
      canvas.getContext = jest.fn((contextType: string) => {
        if (contextType === "2d") {
          return {
            font: "",
            measureText: mockMeasureText,
          } as unknown as CanvasRenderingContext2D;
        }
        return null;
      });
      return canvas;
    }
    return originalCreateElement(tagName);
  });
});

// These tests only assert that the function is callable and caching works
// They do not assert exact pixel widths (JSDOM may not have real canvas).

describe("measureTextWidth", () => {
  it("returns 0 for empty string", () => {
    expect(measureTextWidth("", FONT_FAMILY)).toBe(0);
  });

  it("returns a non-negative width for non-empty string", () => {
    const w = measureTextWidth("hello", FONT_FAMILY);
    expect(typeof w).toBe("number");
    expect(w).toBeGreaterThanOrEqual(0);
  });

  it("caches repeated measurements for same text", () => {
    mockMeasureText.mockClear();
    const w1 = measureTextWidth("cache-test", FONT_FAMILY);
    const w2 = measureTextWidth("cache-test", FONT_FAMILY);
    expect(w2).toBe(w1);
    // measureText should only be called once due to caching
    expect(mockMeasureText).toHaveBeenCalledTimes(1);
  });
});
