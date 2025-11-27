import { TextBuffer } from "@/types/text-buffer";
import { Piece } from "./piece";

export class PieceTable implements TextBuffer {
  private original: string;
  private add: string;
  private pieces: Piece[];
  private totalLength: number;

  constructor(initial: string) {
    this.original = initial;
    this.add = "";
    this.pieces =
      initial.length > 0 ? [new Piece("original", 0, initial.length)] : [];
    this.totalLength = initial.length;
  }

  length(): number {
    return this.totalLength;
  }

  toString(): string {
    return this.getSlice(0, this.length());
  }

  getSlice(start: number, end: number): string {
    const totalLength = this.length();
    if (start < 0) {
      throw new Error("Start index must be non-negative");
    }
    if (end < 0) {
      throw new Error("End index must be non-negative");
    }
    if (start > end) {
      throw new Error("Start index must be <= end index");
    }
    if (start > totalLength) {
      throw new Error("Start index out of bounds");
    }
    if (end > totalLength) {
      throw new Error("Slice end index out of bounds");
    }

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
    if (pos < 0) {
      throw new Error("Position must be non-negative");
    }
    if (pos > this.length()) {
      throw new Error("Position out of bounds");
    }

    // Append text to add buffer
    const addStart = this.add.length;
    this.add += text;
    this.totalLength += text.length;

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

  delete(start: number, end: number): void {
    if (start < 0) {
      throw new Error("Start index must be non-negative");
    }
    if (end < 0) {
      throw new Error("End index must be non-negative");
    }
    if (start > end) {
      throw new Error("Start index must be <= end index");
    }

    const totalLength = this.length();

    if (start > totalLength) {
      throw new Error("Deletion start index out of bounds");
    }

    if (end > totalLength) {
      throw new Error("Deletion end index out of bounds");
    }

    const deleted = end - start;
    this.totalLength -= deleted;

    let pos = 0;
    const newPieces: Piece[] = [];

    for (const piece of this.pieces) {
      const pieceEnd = pos + piece.length;

      if (pieceEnd <= start || pos >= end) {
        // Piece is outside deletion range - keep it
        newPieces.push(piece);
      } else {
        // Piece overlaps with deletion range
        const beforeLen = Math.max(0, start - pos);
        const afterLen = Math.max(0, pieceEnd - end);

        // Keep part before deletion
        if (beforeLen > 0) {
          newPieces.push(new Piece(piece.buffer, piece.start, beforeLen));
        }

        // Keep part after deletion
        if (afterLen > 0) {
          newPieces.push(
            new Piece(
              piece.buffer,
              piece.start + piece.length - afterLen,
              afterLen
            )
          );
        }
      }

      pos = pieceEnd;
    }

    this.pieces = newPieces;
  }
}
