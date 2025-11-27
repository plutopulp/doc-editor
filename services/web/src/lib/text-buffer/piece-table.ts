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

  // Stubs for remaining methods
  getSlice(start: number, end: number): string {
    throw new Error("Not implemented");
  }

  insert(pos: number, text: string): void {
    throw new Error("Not implemented");
  }

  delete(start: number, end: number): void {
    throw new Error("Not implemented");
  }
}
