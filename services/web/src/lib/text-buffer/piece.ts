export class Piece {
  constructor(
    public readonly buffer: "original" | "add",
    public readonly start: number,
    public readonly length: number
  ) {}
}
