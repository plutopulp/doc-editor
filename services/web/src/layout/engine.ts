import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_MARGIN_TOP,
  PAGE_MARGIN_BOTTOM,
  PAGE_MARGIN_LEFT,
  PAGE_MARGIN_RIGHT,
  LINE_HEIGHT,
  FONT_FAMILY,
  //   MAX_PAGES,
} from "@/layout/constants";
import { measureTextWidth } from "@/layout/measure";
import { LayoutOptions, PageSlice } from "@/types/layout";
import { tokenize } from "@/layout/tokenize";

export function layout(
  text: string,
  options?: Partial<LayoutOptions>
): PageSlice[] {
  const opts: LayoutOptions = {
    pageWidth: options?.pageWidth ?? PAGE_WIDTH,
    pageHeight: options?.pageHeight ?? PAGE_HEIGHT,
    marginTop: options?.marginTop ?? PAGE_MARGIN_TOP,
    marginBottom: options?.marginBottom ?? PAGE_MARGIN_BOTTOM,
    marginLeft: options?.marginLeft ?? PAGE_MARGIN_LEFT,
    marginRight: options?.marginRight ?? PAGE_MARGIN_RIGHT,
    lineHeight: options?.lineHeight ?? LINE_HEIGHT,
    font: options?.font ?? FONT_FAMILY,
  };

  // Basic validation
  if (opts.pageWidth <= opts.marginLeft + opts.marginRight) {
    throw new Error("Page width too small for margins");
  }
  if (opts.pageHeight <= opts.marginTop + opts.marginBottom) {
    throw new Error("Page height too small for margins");
  }
  if (opts.lineHeight <= 0) {
    throw new Error("Line height must be positive");
  }

  const maxWidth = opts.pageWidth - opts.marginLeft - opts.marginRight;

  // Edge case: empty text => 1 empty page
  if (text.length === 0) {
    return [{ pageIndex: 0, start: 0, end: 0 }];
  }

  const tokens = tokenize(text);
  const pages: PageSlice[] = [];

  const pageIndex = 0;
  const pageStart = 0;
  let charIndex = 0;
  let lineWidth = 0;

  for (const token of tokens) {
    if (token === "\n") {
      // newline: force line break
      lineWidth = 0;
      charIndex += 1; // newline is a single char in original text
      continue;
    }

    const width = measureTextWidth(token, opts.font);
    const tokenLength = token.length;

    if (lineWidth > 0 && lineWidth + width > maxWidth) {
      // start a new line, but still on same page (for this step)
      lineWidth = 0;
    }

    lineWidth += width;
    charIndex += tokenLength;
  }

  pages.push({ pageIndex, start: pageStart, end: charIndex });
  return pages;
}
