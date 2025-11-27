import { Piece } from "@/lib/text-buffer/piece";

describe("Piece", () => {
  it("should create a piece with original buffer", () => {
    const piece = new Piece("original", 0, 5);

    expect(piece.buffer).toBe("original");
    expect(piece.start).toBe(0);
    expect(piece.length).toBe(5);
  });

  it("should create a piece with add buffer", () => {
    const piece = new Piece("add", 10, 3);

    expect(piece.buffer).toBe("add");
    expect(piece.start).toBe(10);
    expect(piece.length).toBe(3);
  });
});
