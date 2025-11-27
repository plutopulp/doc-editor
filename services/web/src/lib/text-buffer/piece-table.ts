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

  insert(pos: number, text: string): void {
    // Append text to add buffer
    const addStart = this.add.length;
    this.add += text;

    // Find piece containing insertion position
    let index = 0;
    let cumulative = 0;

    for (; index < this.pieces.length; index++) {
      if (cumulative + this.pieces[index].length >= pos) {
        break;
      }
      cumulative += this.pieces[index].length;
    }

    const offset = pos - cumulative;
    const newPieces: Piece[] = [];

    // Copy pieces before insertion point
    newPieces.push(...this.pieces.slice(0, index));

    if (index < this.pieces.length) {
      const piece = this.pieces[index];

      // Add part before insertion (if any)
      if (offset > 0) {
        newPieces.push(new Piece(piece.buffer, piece.start, offset));
      }

      // Add inserted piece
      newPieces.push(new Piece("add", addStart, text.length));

      // Add part after insertion (if any)
      const remaining = piece.length - offset;
      if (remaining > 0) {
        newPieces.push(
          new Piece(piece.buffer, piece.start + offset, remaining)
        );
      }

      // Copy pieces after
      newPieces.push(...this.pieces.slice(index + 1));
    } else {
      // Insert at end
      newPieces.push(new Piece("add", addStart, text.length));
    }

    this.pieces = newPieces;
  }

  // Stub for remaining method
  delete(start: number, end: number): void {
    throw new Error("Not implemented");
  }
}
