import { useRef } from "react";
import type { TextBuffer } from "@/types/text-buffer";
import { PieceTable } from "@/lib/text-buffer/piece-table";

/**
 *
 * Creates and owns a persistent PieceTable instance using a React ref.
 * This hook provides a minimal API to mutate the underlying text buffer
 * without triggering React rerenders on every text change.
 *
 */

export function usePieceTableBuffer(initialText: string) {
  // Create the buffer once
  const bufferRef = useRef<TextBuffer>(new PieceTable(initialText));

  const applyDiff = (
    start: number,
    removedCount: number,
    insertedText: string
  ) => {
    const buffer = bufferRef.current;

    if (removedCount > 0) {
      buffer.delete(start, start + removedCount);
    }
    if (insertedText.length > 0) {
      buffer.insert(start, insertedText);
    }
  };

  const getText = () => {
    return bufferRef.current.toString();
  };

  return {
    bufferRef,
    applyDiff,
    getText,
  };
}
