import { useCallback, useState } from "react";
import { layout } from "@/lib/layout/engine";
import type { LayoutOptions, PageSlice } from "@/types/layout";
import { useDebouncedCallback } from "../use-debounced-callback";

/**
 * usePagination
 *
 * Manages paginated layout state for the editor. This hook runs the layout
 * engine whenever the document text changes and stores the resulting array
 * of PageSlice objects.
 *
 * Responsibilities:
 * - Compute initial pages based on the provided initial text
 * - Re-run the layout engine when text updates (via recomputeLayout)
 * - Expose the resulting `pages` for rendering by the UI
 *
 * This hook is intentionally stateless with respect to the underlying
 * text buffer — it only receives a plain string and produces layout slices.
 *
 * Returned API:
 *   - pages: PageSlice[] — the current paginated structure
 *   - recomputeLayout(text): void — triggers full reflow
 */
export function usePagination(
  initialText: string,
  layoutOptions: LayoutOptions,
  debounceDelay: number = 0
) {
  const initialPages: PageSlice[] =
    initialText.length === 0
      ? [{ pageIndex: 0, start: 0, end: 0 }]
      : layout(initialText, layoutOptions);

  const [pages, setPages] = useState<PageSlice[]>(initialPages);

  const recomputeLayoutImmediate = useCallback(
    (text: string) => {
      const slices = layout(text, layoutOptions);
      setPages(slices);
    },
    [layoutOptions]
  );

  const recomputeLayout = useDebouncedCallback(
    recomputeLayoutImmediate,
    debounceDelay
  );

  return {
    pages,
    recomputeLayout,
  };
}
