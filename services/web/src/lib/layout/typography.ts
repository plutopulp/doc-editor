// Single source of truth for editor typography.
// These values must match:
// - canvas context font
// - layout constants (LINE_HEIGHT)
// - textarea + page preview styles

export const EDITOR_FONT_SIZE_PX = 16; // font size in px
export const EDITOR_LINE_HEIGHT_PX = 20; // line height in px

// Line-height as a unitless multiple (Tailwind / CSS-friendly)
export const EDITOR_LINE_HEIGHT = EDITOR_LINE_HEIGHT_PX / EDITOR_FONT_SIZE_PX;

// Font family string used by canvas and layout engine
export const EDITOR_FONT_FAMILY =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// Full CSS font string used by canvas 2D context
export const EDITOR_CANVAS_FONT = `${EDITOR_FONT_SIZE_PX}px ${EDITOR_FONT_FAMILY}`;
