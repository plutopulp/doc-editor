import {
  DEFAULT_PAGE_WIDTH,
  DEFAULT_PAGE_HEIGHT,
  DEFAULT_PAGE_MARGIN_TOP,
  DEFAULT_PAGE_MARGIN_BOTTOM,
  DEFAULT_PAGE_MARGIN_LEFT,
  DEFAULT_PAGE_MARGIN_RIGHT,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  MAX_PAGES,
} from "./constants";
import { measureTextWidth } from "./measure";
import { LayoutOptions, PageSlice } from "@/types/layout";
import { tokenize } from "./tokenize";

export function layout(
  text: string,
  options?: Partial<LayoutOptions>
): PageSlice[] {
  const opts: LayoutOptions = {
    pageWidth: options?.pageWidth ?? DEFAULT_PAGE_WIDTH,
    pageHeight: options?.pageHeight ?? DEFAULT_PAGE_HEIGHT,
    marginTop: options?.marginTop ?? DEFAULT_PAGE_MARGIN_TOP,
    marginBottom: options?.marginBottom ?? DEFAULT_PAGE_MARGIN_BOTTOM,
    marginLeft: options?.marginLeft ?? DEFAULT_PAGE_MARGIN_LEFT,
    marginRight: options?.marginRight ?? DEFAULT_PAGE_MARGIN_RIGHT,
    lineHeight: options?.lineHeight ?? DEFAULT_LINE_HEIGHT,
    font: options?.font ?? DEFAULT_FONT_FAMILY,
    fontSize: options?.fontSize ?? DEFAULT_FONT_SIZE,
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
  const maxLinesPerPage = Math.max(
    1,
    Math.floor(
      (opts.pageHeight - opts.marginTop - opts.marginBottom) / opts.lineHeight
    )
  );

  // Edge case: empty text => 1 empty page
  if (text.length === 0) {
    return [{ pageIndex: 0, start: 0, end: 0 }];
  }

  const tokens = tokenize(text);
  const pages: PageSlice[] = [];

  let pageIndex = 0;
  let pageStart = 0; // char offset where current page begins
  let charIndex = 0; // char offset in full text
  let lineWidth = 0;
  let linesInPage = 0;

  for (const token of tokens) {
    if (token === "\n") {
      // newline: force line break
      lineWidth = 0;
      linesInPage++;
      charIndex += 1; // newline is a single char in original text

      if (linesInPage >= maxLinesPerPage) {
        pages.push({ pageIndex, start: pageStart, end: charIndex });
        if (pages.length >= MAX_PAGES) break; // avoid runaway in pathological cases
        pageIndex++;
        pageStart = charIndex;
        linesInPage = 0;
      }
      continue;
    }

    const font = `${opts.fontSize}px ${opts.font}`;
    const width = measureTextWidth(token, font);
    const tokenLength = token.length;

    // If token alone exceeds maxWidth, treat it as a full line.
    // However, whitespace tokens should NOT trigger line wraps - they "hang"
    // past the line width to match CSS `white-space: pre-wrap` behavior.
    const isWhitespaceToken = /^\s+$/.test(token);
    const wouldOverflow = lineWidth > 0 && lineWidth + width > maxWidth;
    const shouldForceNewLine = wouldOverflow && !isWhitespaceToken;

    if (shouldForceNewLine) {
      lineWidth = 0;
      linesInPage++;
      if (linesInPage >= maxLinesPerPage) {
        pages.push({ pageIndex, start: pageStart, end: charIndex });
        if (pages.length >= MAX_PAGES) break;
        pageIndex++;
        pageStart = charIndex;
        linesInPage = 0;
      }
    }

    // Place token on current line
    // If token is extremely long (> maxWidth) and lineWidth === 0,
    // we still place it; it will visually overflow but remain deterministic.
    lineWidth += width;
    charIndex += tokenLength;
  }

  // Push last page if we haven't exceeded MAX_PAGES
  if (pages.length === 0 || pages[pages.length - 1].end !== charIndex) {
    pages.push({ pageIndex, start: pageStart, end: charIndex });
  }

  return pages;
}
