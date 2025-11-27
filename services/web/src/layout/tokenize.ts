/**
 * Split text into tokens: words, whitespace runs, and "\n" newlines.
 * Newline characters are always their own token.
 */
export function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let current = "";

  for (const ch of text) {
    if (ch === "\n") {
      if (current) tokens.push(current);
      tokens.push("\n");
      current = "";
    } else if (/\s/.test(ch)) {
      // whitespace (space, tab, etc.)
      if (current && !/\s/.test(current[current.length - 1])) {
        tokens.push(current);
        current = ch;
      } else {
        current += ch;
      }
    } else {
      // non-whitespace character
      if (current && /\s/.test(current[current.length - 1])) {
        tokens.push(current);
        current = ch;
      } else {
        current += ch;
      }
    }
  }

  if (current) tokens.push(current);
  return tokens;
}
