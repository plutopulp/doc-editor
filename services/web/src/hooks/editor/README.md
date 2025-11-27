# Editor Hooks — Overview

This directory contains the modular hooks for the document editor.
Each hook has a single responsibility and composes into `useEditorDocument`,
which is the main orchestrator used by the `Editor` component.

Below is an overview of each hook and how they compose.

---

## 1. `usePieceTableBuffer`

**Responsibility:**  
Owns the `PieceTable` instance and exposes operations for mutating it.

**Provides:**

- `bufferRef` — text buffer stored in a ref (so persisted across renders)
- `applyDiff(start, removedCount, insertedText)` — high-level splice mutation
- `getText()` — reconstructs the current full document content

**Why:**  
The PieceTable mutates frequently; it should not live in React state.
This hook isolates the low-level text engine.

---

## 2. `useTextState`

**Responsibility:**  
Manages the plain text string used by the textarea and converts user input
into high-level diffs.

**Provides:**

- `text` — the UI-facing text value
- `handleTextChange(nextText)` — computes minimal diff and calls `applyDiff`

**Why:**  
React components expect a simple string for controlled inputs.
This hook keeps UI text in sync with the underlying buffer.

---

## 3. `usePagination`

**Responsibility:**  
Runs the layout engine (pagination) whenever the document text changes.

**Provides:**

- `pages` — array of page slices
- `recomputeLayout(text)` — triggers reflow

**Why:**  
Layout is computationally expensive; isolating it in its own hook makes
it easier to enhance later (debouncing, incremental reflow, debugging).

---

## 4. `useSelectionState`

**Responsibility:**  
Tracks caret and selection state.

**Provides:**

- `selection` — `{ start, end }`
- `handleSelectionChange(start, end)`
- `setCaret(pos)`

**Why:**  
Selection tracking is logically separate from text changes or pagination.
This hook will later be extended for cursor mapping inside pages.

---

## 5. `useEditorDocument` (orchestrator)

**Responsibility:**  
Central hook that composes the buffer, text state, pagination, and selection hooks.

**Provides:**  
Everything needed by the UI:

- `text`
- `pages`
- `selection`
- `buffer`
- `layoutOptions`
- `handleTextChange`
- `handleSelectionChange`

**Why:**  
This creates a clean API for the `Editor` component and hides internal implementations.

---

## Data Flow Summary

- User types →
- useTextState computes text diff →
- usePieceTableBuffer applies diff to PieceTable →
- useTextState updates UI text →
- usePagination recomputes pages →
- useSelectionState updates caret →
- Editor re-renders with new pages
