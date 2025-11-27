import { useEffect } from "react";
import { usePieceTableBuffer } from "./use-piece-table-buffer";
import { useTextState } from "./use-text-state";
import { usePagination } from "./use-pagination";
import { useSelectionState } from "./use-selection-state";

import { LayoutOptions } from "@/types/layout";

/**
 * useEditorDocument
 *
 * The top‑level orchestrator hook that composes all modular editor hooks
 * into a single, cohesive editing model for the UI.
 *
 * Responsibilities:
 * - Build and memoize layout options (page size, margins, font, etc.)
 * - Initialize and expose the PieceTable buffer API
 * - Initialize pagination logic and trigger reflow on text updates
 * - Manage caret and selection state
 * - Manage the plain‑text state used by the textarea
 *
 * The hook coordinates the data flow:
 *   1. User types → useTextState detects change → applies diff to PieceTable
 *   2. After mutation, we recompute layout (pagination)
 *   3. Selection state is updated (caret position)
 *   4. UI re-renders because `text`, `pages`, or `selection` changed
 *
 * Returned API:
 *   - text: string — plain text bound to the textarea
 *   - pages: PageSlice[] — paginated slices for rendering pages
 *   - selection: { start, end } — caret or selection range
 *   - buffer: ref to PieceTable — underlying text model
 *   - layoutOptions: memoized layout configuration
 *   - handleTextChange(nextText): update text + trigger layout + caret update
 *   - handleSelectionChange(start, end): update user selection
 */
export function useEditorDocument(
  initialText = "",
  layoutOptions: LayoutOptions
) {
  // Core text buffer: low-level text model with splice-based updates
  const { bufferRef, applyDiff } = usePieceTableBuffer(initialText);

  // Pagination: compute page slices from the current full text
  const { pages, recomputeLayout } = usePagination(initialText, layoutOptions);

  // Selection (caret + highlight) state
  const { selection, handleSelectionChange, setCaret } = useSelectionState(
    initialText.length
  );

  // Text state: reacts to textarea changes, computes diffs, updates buffer
  const { text, handleTextChange } = useTextState(
    initialText,
    applyDiff,
    (newText, caret) => {
      // After buffer mutation, re-run layout to refresh pagination
      recomputeLayout(newText);
      // Update caret position after the splice operation
      setCaret(caret);
    }
  );

  // Re-run pagination whenever layout options (including lineHeight) change
  // so that page breaks stay in sync with the visual layout.
  useEffect(() => {
    recomputeLayout(text);
  }, [layoutOptions, recomputeLayout, text]);

  return {
    text,
    pages,
    selection,
    buffer: bufferRef,
    layoutOptions,
    handleTextChange,
    handleSelectionChange,
  };
}
