// Typography helpers built from layout defaults.
// These are derived values only; all primitives live in `constants.ts`.

import {
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_FONT_FAMILY,
} from "./constants";

// Line-height as a unitless multiple (Tailwind / CSS-friendly)
export const EDITOR_LINE_HEIGHT = DEFAULT_LINE_HEIGHT / DEFAULT_FONT_SIZE;

// Font family string used by canvas and layout engine
export const EDITOR_FONT_FAMILY = DEFAULT_FONT_FAMILY;
