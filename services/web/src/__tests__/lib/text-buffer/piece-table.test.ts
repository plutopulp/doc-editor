import { PieceTable } from "@/lib/text-buffer/piece-table";

describe("PieceTable", () => {
  describe("constructor", () => {
    it("should initialize with empty string", () => {
      const buffer = new PieceTable("");

      expect(buffer.length()).toBe(0);
    });

    it("should initialize with content", () => {
      const buffer = new PieceTable("hello");

      expect(buffer.length()).toBe(5);
    });
  });

  describe("length()", () => {
    it("should return 0 for empty buffer", () => {
      const buffer = new PieceTable("");
      expect(buffer.length()).toBe(0);
    });

    it("should return correct length for non-empty buffer", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.length()).toBe(11);
    });
  });
});
