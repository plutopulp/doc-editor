/**
 * Layout options used by the layout engine.
 * All dimensions are in pixels. Font is a Canvas font string.
 */
export interface LayoutOptions {
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  lineHeight: number;
  font: string; // e.g. "16px Arial, sans-serif"
}

/**
 * A slice of the full text belonging to a given page.
 * `start` is inclusive, `end` is exclusive, both are char indices into the full text string.
 */
export interface PageSlice {
  pageIndex: number;
  start: number;
  end: number;
}
