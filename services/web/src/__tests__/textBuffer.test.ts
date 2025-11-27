describe("Jest Setup", () => {
  it("should run tests correctly", () => {
    expect(true).toBe(true);
  });

  it("should handle basic assertions", () => {
    const sum = 1 + 1;
    expect(sum).toBe(2);
  });

  it("should handle string operations", () => {
    const greeting = "hello" + " " + "world";
    expect(greeting).toBe("hello world");
  });
});
