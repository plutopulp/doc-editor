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

    it("should match expected value after multiple inserts", () => {
      const buffer = new PieceTable("hello");
      expect(buffer.length()).toBe(5);

      buffer.insert(5, " world");
      expect(buffer.length()).toBe(11);

      buffer.insert(0, "Say ");
      expect(buffer.length()).toBe(15);

      buffer.insert(15, "!");
      expect(buffer.length()).toBe(16);
    });

    it("should decrement correctly after deletes", () => {
      const buffer = new PieceTable("hello world");
      expect(buffer.length()).toBe(11);

      buffer.delete(5, 11);
      expect(buffer.length()).toBe(5);

      buffer.delete(0, 2);
      expect(buffer.length()).toBe(3);

      buffer.delete(0, 3);
      expect(buffer.length()).toBe(0);
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

  describe("more complex scenarios", () => {
    it("should handle insert after delete", () => {
      const buffer = new PieceTable("hello world");
      buffer.delete(5, 11); // 'hello'
      buffer.insert(5, "!"); // 'hello!'

      expect(buffer.toString()).toBe("hello!");
      expect(buffer.length()).toBe(6);
    });

    it("should maintain consistency after many edits", () => {
      const buffer = new PieceTable("abc");
      buffer.insert(1, "X"); // 'aXbc'
      buffer.insert(4, "Y"); // 'aXbcY'
      buffer.delete(1, 2); // 'abcY'
      buffer.insert(0, "Z"); // 'ZabcY'

      expect(buffer.toString()).toBe("ZabcY");
      expect(buffer.length()).toBe(5);
    });

    it("should handle alternating inserts and deletes", () => {
      const buffer = new PieceTable("test");
      buffer.insert(4, "ing"); // 'testing'
      buffer.delete(0, 4); // 'ing'
      buffer.insert(0, "runn"); // 'running'

      expect(buffer.toString()).toBe("running");
      expect(buffer.length()).toBe(7);
    });
  });

  describe("bounds checking", () => {
    describe("getSlice()", () => {
      let buffer: PieceTable;

      beforeEach(() => {
        buffer = new PieceTable("hello");
      });

      it("should throw error for negative start index", () => {
        expect(() => buffer.getSlice(-1, 3)).toThrow(
          "Start index must be non-negative"
        );
      });

      it("should throw error for negative end index", () => {
        expect(() => buffer.getSlice(0, -1)).toThrow(
          "End index must be non-negative"
        );
      });

      it("should throw error when start > end", () => {
        expect(() => buffer.getSlice(3, 2)).toThrow(
          "Start index must be <= end index"
        );
      });

      it("should throw error when start > length", () => {
        expect(() => buffer.getSlice(10, 15)).toThrow(
          "Start index out of bounds"
        );
      });

      it("should throw error when end > length", () => {
        expect(() => buffer.getSlice(0, 10)).toThrow(
          "Slice end index out of bounds"
        );
      });
    });

    describe("getSlice() on empty buffer", () => {
      it("should throw error when end > length on empty buffer", () => {
        const buffer = new PieceTable("");
        expect(() => buffer.getSlice(0, 1)).toThrow(
          "Slice end index out of bounds"
        );
      });
    });

    describe("insert()", () => {
      let buffer: PieceTable;

      beforeEach(() => {
        buffer = new PieceTable("hello");
      });

      it("should throw error for negative position", () => {
        expect(() => buffer.insert(-1, "test")).toThrow(
          "Position must be non-negative"
        );
      });

      it("should throw error when position > length", () => {
        expect(() => buffer.insert(10, "test")).toThrow(
          "Position out of bounds"
        );
      });

      it("should allow inserting at length (append)", () => {
        buffer.insert(5, " world");
        expect(buffer.toString()).toBe("hello world");
      });
    });

    describe("delete()", () => {
      let buffer: PieceTable;

      beforeEach(() => {
        buffer = new PieceTable("hello world");
      });

      it("should throw error for negative start index", () => {
        expect(() => buffer.delete(-1, 5)).toThrow(
          "Start index must be non-negative"
        );
      });

      it("should throw error for negative end index", () => {
        expect(() => buffer.delete(0, -1)).toThrow(
          "End index must be non-negative"
        );
      });

      it("should throw error when start > end", () => {
        expect(() => buffer.delete(5, 3)).toThrow(
          "Start index must be <= end index"
        );
      });

      it("should throw error when deleting past end", () => {
        expect(() => buffer.delete(0, 20)).toThrow(
          "Deletion end index out of bounds"
        );
      });

      it("should throw error when deleting from index > length", () => {
        expect(() => buffer.delete(20, 25)).toThrow(
          "Deletion start index out of bounds"
        );
      });
    });
  });
});
