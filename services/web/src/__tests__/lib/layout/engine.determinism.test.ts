/**
 * @jest-environment jsdom
 */

import { layout } from "@/lib/layout/engine";
import { LayoutOptions } from "@/types/layout";

jest.mock("@/lib/layout/measure", () => ({
  measureTextWidth: (text: string, _font: string) => text.length,
}));

describe("layout determinism", () => {
  const defaultOptions: Partial<LayoutOptions> = {
    pageWidth: 100,
    pageHeight: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: 10,
  };

  const sample =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  it("produces the same layout for the same input", () => {
    const pages1 = layout(sample, defaultOptions);
    const pages2 = layout(sample, defaultOptions);
    expect(pages1).toEqual(pages2);
  });

  it("produces stable layout snapshot for sample doc", () => {
    const pages = layout(sample, defaultOptions);
    expect(pages).toMatchInlineSnapshot(`
[
  {
    "end": 123,
    "pageIndex": 0,
    "start": 0,
  },
]
`);
  });
});
