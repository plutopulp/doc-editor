import {
  EDITOR_LINE_HEIGHT_PX,
  EDITOR_CANVAS_FONT,
} from "@/lib/layout/typography";

export const PAGE_WIDTH = 794; // px (A4 portrait content area)
export const PAGE_HEIGHT = 1123; // px (A4 portrait content area)
export const PAGE_MARGIN_TOP = 40;
export const PAGE_MARGIN_BOTTOM = 40;
export const PAGE_MARGIN_LEFT = 40;
export const PAGE_MARGIN_RIGHT = 40;

// Use shared line height (in px)
export const LINE_HEIGHT = EDITOR_LINE_HEIGHT_PX;

// This is still exported for backwards compatibility
export const FONT_FAMILY = EDITOR_CANVAS_FONT;

export const MAX_PAGES = 200; // safety limit to prevent infinite looping
