/**
 * Computes the minimal text change (a single splice) required to transform
 * `prev` into `next`. This is used to efficiently update the underlying
 * PieceTable without performing a full diff.
 *
 * The algorithm:
 * 1. Scan from the left until the first differing character.
 * 2. Scan from the right until the last differing character.
 * 3. Everything between these two boundaries is considered replaced.
 *
 * Returns an object:
 *   - start: index where the change begins
 *   - removedCount: how many characters should be deleted starting at `start`
 *   - insertedText: the new text inserted at `start`
 *
 * Example:
 *   prev: "hello world"
 *   next: "hello brave world"
 *
 *   start = 6
 *   removedCount = 0
 *   insertedText = "brave "
 *
 * This function guarantees:
 *   - A single contiguous diff
 *   - Minimal necessary deletion + insertion
 *   - Works for inserts, deletes, and replacements
 */
export function computeTextChange(prev: string, next: string) {
  // No diff needed if strings are identical
  if (prev === next) {
    return { start: prev.length, removedCount: 0, insertedText: "" };
  }

  let start = 0;
  const prevLen = prev.length;
  const nextLen = next.length;
  const minLen = Math.min(prevLen, nextLen);

  // Scan from the left until the first differing character
  while (start < minLen && prev[start] === next[start]) {
    start++;
  }

  if (start === prevLen && start === nextLen) {
    return { start, removedCount: 0, insertedText: "" };
  }

  let endPrev = prevLen;
  let endNext = nextLen;

  // Scan from the right until the last matching suffix
  while (
    endPrev > start &&
    endNext > start &&
    prev[endPrev - 1] === next[endNext - 1]
  ) {
    endPrev--;
    endNext--;
  }

  // The splice boundaries: removedCount and insertedText
  const removedCount = endPrev - start;
  const insertedText = next.slice(start, endNext);

  return { start, removedCount, insertedText };
}
