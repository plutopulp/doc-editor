import { useCallback, useState } from "react";

export type SelectionState = {
  start: number;
  end: number;
};

/**
 * useSelectionState
 *
 * Manages caret and text selection state for the editor. This hook keeps
 * track of the current selection range as `{ start, end }`, where:
 *   - `start` is the anchor/caret position
 *   - `end` is the active end of the selection (equal to `start` for a caret)
 *
 * Responsibilities:
 * - Initialize the selection at a given position
 * - Update the selection when the user changes their highlight or caret
 * - Provide a `setCaret` helper for collapsing the selection to a single point
 *
 * This hook is UI-agnostic. It does not interpret DOM selection ranges or map
 * positions to page coordinates — it simply stores the logical selection
 * indices. Higher-level hooks or components decide how those indices map
 * to rendered content.
 *
 * Returned API:
 *   - selection: { start: number; end: number }
 *   - handleSelectionChange(start, end): update selection range
 *   - setCaret(pos): collapse selection to a caret at position `pos`
 */
export function useSelectionState(initialPos: number) {
  // Internal React state storing the current logical selection range
  const [selection, setSelection] = useState<SelectionState>({
    start: initialPos,
    end: initialPos,
  });

  // Update the selection range (used when user highlights or moves caret)
  const handleSelectionChange = useCallback((start: number, end: number) => {
    setSelection({ start, end });
  }, []);

  // Collapse the selection to a single caret at position `pos`
  const setCaret = useCallback((pos: number) => {
    setSelection({ start: pos, end: pos });
  }, []);

  return {
    selection,
    handleSelectionChange,
    setCaret,
  };
}
