import { useState, useCallback } from "react";
import type { LayoutOptions } from "@/types/layout";
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
} from "@/lib/layout/constants";

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  pageWidth: DEFAULT_PAGE_WIDTH,
  pageHeight: DEFAULT_PAGE_HEIGHT,
  marginTop: DEFAULT_PAGE_MARGIN_TOP,
  marginBottom: DEFAULT_PAGE_MARGIN_BOTTOM,
  marginLeft: DEFAULT_PAGE_MARGIN_LEFT,
  marginRight: DEFAULT_PAGE_MARGIN_RIGHT,
  lineHeight: DEFAULT_LINE_HEIGHT,
  font: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
};

/**
 * useLayoutOptionsState
 *
 * Manages the layout configuration state for the editor. This hook provides
 * a centralized way to store and update page dimensions, margins, line height,
 * and font settings that control how the document is paginated and rendered.
 *

 * This hook is typically used at the top level of the editor component tree
 * and its `layoutOptions` are passed down to hooks like `usePagination` and
 * components like `PagePreview` to control layout computation and rendering.
 *

 */
export function useLayoutOptionsState(initial?: Partial<LayoutOptions>) {
  const [layoutOptions, setLayoutOptions] = useState<LayoutOptions>({
    ...DEFAULT_LAYOUT_OPTIONS,
    ...(initial ?? {}),
  });

  const updateLayoutOptions = useCallback((patch: Partial<LayoutOptions>) => {
    setLayoutOptions((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  return {
    layoutOptions,
    updateLayoutOptions,
  };
}
