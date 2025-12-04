# Improvement Ideas

Notes on what I'd change or add given more time. Items marked with `***` are higher priority.

---

## Core Issues

### Pagination Rendering \*\*\*

The layout engine computes line breaks, but the renderer uses CSS `pre-wrap` which lets the browser re-wrap independently. So the computed breaks and rendered breaks can diverge.

Possible fix: return computed line breaks from the engine and render each line explicitly, making the engine the single source of truth.

### Font Mismatch (Minor)

The textarea uses Tailwind's `font-sans`, but both the engine and the page preview use `layoutOptions.font`. So pagination is correct, it's just the input area that looks different from the preview.

Not a determinism issue since engine and renderer match. Just a UX inconsistency.

---

## Architecture Improvements

### Piece Table Decomposition \*\*\*

The internals (pieces array, buffers) are tightly coupled, making it hard to swap implementations or test in isolation.

Would extract `Piece`, `Buffer` and `PieceSequence` interface and inject different implementations. E.g. for sequence we could have an array implementation (current), linked list, or red-black tree (which is what VS Code uses I think). Then we could benchmark different compositions easily.

### Shape-Based Text Flow

The engine assumes a rectangular content area, so it can't handle images, tables etc..

Could abstract a `FlowRegion` interface and inject that into layout engine, which returns available width per line or something. Would support L-shapes, holes for images, etc.

### Layout Engine Decomposition \*\*\*

It's one big function doing tokenise, measure, line break, and page break all together. Hard to test and reason about.

Could extract interfaces for `Tokenizer`, `TextMeasurer`, `LineBreaker`, `PageBreaker` and inject them. Makes testing and swapping implementations much easier.

---

## Performance

### Centralised Font Metrics Service

Canvas measurement varies across browsers and OS. Not deterministic cross-client.

A backend could pre-compute font metrics (char/token widths) and all clients use the same data. Trades font flexibility for layout guarantees.

### Incremental Reflow \*\*\*

Currently does full reflow on every keystroke. Wasteful for large documents.

Could track which page the edit affects, reflow from there forward, and stop when a page ends at the same offset as before. Most edits only affect/ripple through one or two pages.

### Page Virtualisation

Rendering 50+ pages in the DOM is expensive even if most are off-screen.

Could only render visible pages plus a buffer, using intersection observer. Placeholder divs maintain scroll height.

---

## Quality and Testing

### Testing Strategy

Layout engine tests are minimal. Edge case docs exist but aren't automated.

Could use dependency injection for mock injection, then convert and extend the manual test docs (unicode, page breaks, whitespace) into proper fixtures.

### Code Quality (Tokenizer)

The tokenizer is AI-generated and works but isn't clean. Uses implicit state and is a little hard to follow.

Would refactor to an explicit state machine with a `currentType` variable and a single `flush` function. Much easier to read and extend.

---

## Future Features

### Multi-Edit and Change Tracking

Currently single cursor, sequential edits. Can't propose multiple changes for accept/reject like you'd want for AI suggestions in cursor for instance.

Would add `Change` objects with pending/accepted/rejected status. Diff-based (like `git diff`) approach for AI suggestions

### Undo Tree

A linear undo stack loses history when you undo then make a new edit.

A tree structure preserves all branches. The piece table's immutable buffers make snapshots cheap since they share underlying data.

### Split View

The current split view (textarea plus preview) isn't how users expect document editors to work.
Actually, users would edit directly on pages with cursor positioning.

---

## Production Considerations

### Persistence of Layout Options

If layout options aren't saved with the document, the same content with different client settings gives different pagination.

Could optionally persist `layoutOptions` with the document for deterministic reload, define preconfigured layout option sets also.

### Error Handling

Minimal error handling at the moment, mostly happy path.

Would focus on UX side: centralised error parsing from API calls, consistent error states in UI, clear user feedback when something fails, maybe toast notifications or inline messages.
