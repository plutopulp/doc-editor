import { useCallback, useState } from "react";
import { computeTextChange } from "@/lib/utils";

/**
 * useTextState
 *
 * Manages the plain-text representation of the editor's content. This hook
 * keeps a React `text` state in sync with changes applied to the underlying
 * PieceTable buffer.
 *
 * Responsibilities:
 * - Track the UI-facing text string used by the textarea
 * - Compute a minimal diff between the previous and next text values using
 *   `computeTextChange`
 * - Apply the diff to the PieceTable via `applyDiff`
 * - Inform parent hooks (e.g. pagination + selection) of the updated text
 *   and resulting caret position through `onAfterTextUpdate`
 *
 * This hook does NOT do any low-level buffer manipulation itself — it only
 * determines *what* changed and delegates the mutation to `applyDiff`.
 *
 * Returned API:
 *   - text: string — the current plain text
 *   - handleTextChange(nextText): void — main entry point for text updates
 */
export function useTextState(
  initialText: string,
  applyDiff: (start: number, removed: number, inserted: string) => void,
  onAfterTextUpdate: (newText: string, caretPos: number) => void
) {
  const [text, setText] = useState(initialText);

  const handleTextChange = useCallback(
    (nextText: string) => {
      // Previous UI text value
      const prevText = text;
      // Compute minimal splice diff between prev and next
      const { start, removedCount, insertedText } = computeTextChange(
        prevText,
        nextText
      );

      // Apply the computed change to the PieceTable
      applyDiff(start, removedCount, insertedText);

      // Update React text state to match underlying buffer
      setText(nextText);

      // Move caret to end of inserted text
      const newCaret = start + insertedText.length;

      // Notify parent hook (pagination + selection)
      onAfterTextUpdate(nextText, newCaret);
    },
    [text, applyDiff, onAfterTextUpdate]
  );

  return {
    text,
    handleTextChange,
  };
}
