export interface TextBuffer {
  /**
   * Returns the total length of the text buffer
   */
  length(): number;

  /**
   * Returns a substring from start (inclusive) to end (exclusive)
   * @param start - Starting index
   * @param end - Ending index (exclusive)
   */
  getSlice(start: number, end: number): string;

  /**
   * Inserts text at the specified position
   * @param pos - Position to insert at
   * @param text - Text to insert
   */
  insert(pos: number, text: string): void;

  /**
   * Deletes text from start (inclusive) to end (exclusive)
   * @param start - Starting index
   * @param end - Ending index (exclusive)
   */
  delete(start: number, end: number): void;

  /**
   * Returns the entire buffer content as a string
   */
  toString(): string;
}
