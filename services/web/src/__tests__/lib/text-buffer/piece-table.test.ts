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

  describe("getSlice()", () => {
    it("should return empty string for empty buffer", () => {
      const buffer = new PieceTable("");
      expect(buffer.getSlice(0, 0)).toBe("");
    });

    it("should return substring from start", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.getSlice(0, 5)).toBe("hello");
    });

    it("should return substring from middle", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.getSlice(6, 11)).toBe("world");
    });

    it("should return full text", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.getSlice(0, 11)).toBe("hello world");
    });

    it("should return substring spanning middle", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.getSlice(3, 8)).toBe("lo wo");
    });
  });

  describe("toString()", () => {
    it("should return empty string for empty buffer", () => {
      const buffer = new PieceTable("");
      expect(buffer.toString()).toBe("");
    });

    it("should return full content", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.toString()).toBe("hello world");
    });
  });
});
