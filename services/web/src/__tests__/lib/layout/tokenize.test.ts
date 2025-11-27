import { tokenize } from "@/lib/layout/tokenize";

describe("tokenize", () => {
  it("returns empty array for empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("tokenizes a simple word", () => {
    expect(tokenize("hello")).toEqual(["hello"]);
  });

  it("tokenizes word with single space", () => {
    expect(tokenize("hello world")).toEqual(["hello", " ", "world"]);
  });

  it("preserves multiple spaces as a single whitespace token", () => {
    expect(tokenize("a  b")).toEqual(["a", "  ", "b"]);
  });

  it("emits newline as separate token", () => {
    expect(tokenize("hello\nworld")).toEqual(["hello", "\n", "world"]);
  });

  it("handles tabs and spaces mixed", () => {
    expect(tokenize("a\t b")).toEqual(["a", "\t ", "b"]);
  });

  it("handles consecutive newlines", () => {
    expect(tokenize("a\n\n b")).toEqual(["a", "\n", "\n", " ", "b"]);
  });
});
