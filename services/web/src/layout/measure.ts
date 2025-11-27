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

export function measureTextWidth(text: string, font: string): number {
  // Empty string has width 0
  if (text === "") return 0;

  ensureContext(font);
  if (widthCache.has(text)) return widthCache.get(text)!;
  const metrics = ctx!.measureText(text);
  const width = metrics.width;
  widthCache.set(text, width);
  return width;
}
