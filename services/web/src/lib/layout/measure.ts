import { EDITOR_CANVAS_FONT } from "./typography";

/****
 * SSR GUARD:
 * This module may be imported during Next.js server-side rendering.
 * Because `document.createElement("canvas")` is not available on the server,
 * we must provide a deterministic fallback measurement function.
 *
 * We use a constant average character width so the layout engine remains
 * deterministic even in SSR environments. This avoids crashes and ensures
 * pagination can still run (with slightly approximate widths) during SSR.
 */
const APPROX_CHAR_WIDTH = 7; // deterministic fallback width per character

function measureTextWidthSSR(text: string): number {
  // Very naive but fully deterministic fallback for SSR usage.
  return text.length * APPROX_CHAR_WIDTH;
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
const widthCache = new Map<string, number>();

export function ensureContext(font: string): void {
  if (!canvas) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
  }
  if (!ctx) throw new Error("2D context not available");
  if (ctx.font !== font) {
    ctx.font = font;
    widthCache.clear();
  }
}

export function measureTextWidth(
  text: string,
  font: string = EDITOR_CANVAS_FONT
): number {
  // --- SSR fallback ---
  if (typeof window === "undefined") {
    return measureTextWidthSSR(text);
  }
  // Empty string has width 0
  if (text === "") return 0;

  ensureContext(font);
  if (widthCache.has(text)) return widthCache.get(text)!;
  const metrics = ctx!.measureText(text);
  const width = metrics.width;
  widthCache.set(text, width);
  return width;
}
