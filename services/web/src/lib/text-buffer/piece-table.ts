import { TextBuffer } from "@/types/text-buffer";
import { Piece } from "./piece";

export class PieceTable implements TextBuffer {
  private original: string;
  private add: string;
  private pieces: Piece[];

  constructor(initial: string) {
    this.original = initial;
    this.add = "";
    this.pieces =
      initial.length > 0 ? [new Piece("original", 0, initial.length)] : [];
  }

  length(): number {
    return this.pieces.reduce((acc, p) => acc + p.length, 0);
  }

  toString(): string {
    return this.getSlice(0, this.length());
  }

  getSlice(start: number, end: number): string {
    let result = "";
    let pos = 0;

    for (const p of this.pieces) {
      // Skip pieces before the range
      if (pos + p.length <= start) {
        pos += p.length;
        continue;
      }

      // Stop if we've passed the range
      if (pos >= end) break;

      // Calculate slice within this piece
      const sliceStart = Math.max(0, start - pos);
      const sliceEnd = Math.min(p.length, end - pos);

      // Get the appropriate buffer and extract substring
      const buffer = p.buffer === "original" ? this.original : this.add;
      result += buffer.substring(p.start + sliceStart, p.start + sliceEnd);

      pos += p.length;
    }

    return result;
  }

  // Stubs for remaining methods
  insert(pos: number, text: string): void {
    throw new Error("Not implemented");
  }

  delete(start: number, end: number): void {
    throw new Error("Not implemented");
  }
}
