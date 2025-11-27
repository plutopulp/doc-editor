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

  describe("insert()", () => {
    it("should insert into empty buffer", () => {
      const buffer = new PieceTable("");
      buffer.insert(0, "test");

      expect(buffer.toString()).toBe("test");
      expect(buffer.length()).toBe(4);
    });

    it("should insert at start", () => {
      const buffer = new PieceTable("world");
      buffer.insert(0, "hello ");

      expect(buffer.toString()).toBe("hello world");
      expect(buffer.length()).toBe(11);
    });

    it("should insert at middle", () => {
      const buffer = new PieceTable("helo");
      buffer.insert(3, "l");

      expect(buffer.toString()).toBe("hello");
      expect(buffer.length()).toBe(5);
    });

    it("should insert at end", () => {
      const buffer = new PieceTable("hello");
      buffer.insert(5, " world");

      expect(buffer.toString()).toBe("hello world");
      expect(buffer.length()).toBe(11);
    });

    it("should handle multiple sequential inserts", () => {
      const buffer = new PieceTable("ac");
      buffer.insert(1, "b");
      buffer.insert(3, "d");

      expect(buffer.toString()).toBe("abcd");
      expect(buffer.length()).toBe(4);
    });
  });

  describe("delete()", () => {
    it("should delete from start", () => {
      const buffer = new PieceTable("hello world");
      buffer.delete(0, 6);

      expect(buffer.toString()).toBe("world");
      expect(buffer.length()).toBe(5);
    });

    it("should delete from middle", () => {
      const buffer = new PieceTable("hello world");
      buffer.delete(5, 6);

      expect(buffer.toString()).toBe("helloworld");
      expect(buffer.length()).toBe(10);
    });

    it("should delete from end", () => {
      const buffer = new PieceTable("hello world");
      buffer.delete(5, 11);

      expect(buffer.toString()).toBe("hello");
      expect(buffer.length()).toBe(5);
    });

    it("should delete entire content", () => {
      const buffer = new PieceTable("hello");
      buffer.delete(0, 5);

      expect(buffer.toString()).toBe("");
      expect(buffer.length()).toBe(0);
    });
  });
});
