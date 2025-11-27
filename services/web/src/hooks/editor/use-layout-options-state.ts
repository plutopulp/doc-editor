import { useState, useCallback } from "react";
import type { LayoutOptions } from "@/types/layout";
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_MARGIN_TOP,
  PAGE_MARGIN_BOTTOM,
  PAGE_MARGIN_LEFT,
  PAGE_MARGIN_RIGHT,
  LINE_HEIGHT,
  FONT_FAMILY,
} from "@/lib/layout/constants";

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  pageWidth: PAGE_WIDTH,
  pageHeight: PAGE_HEIGHT,
  marginTop: PAGE_MARGIN_TOP,
  marginBottom: PAGE_MARGIN_BOTTOM,
  marginLeft: PAGE_MARGIN_LEFT,
  marginRight: PAGE_MARGIN_RIGHT,
  lineHeight: LINE_HEIGHT,
  font: FONT_FAMILY,
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
