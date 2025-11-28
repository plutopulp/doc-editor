# Architecture

This document describes how the document editor is structured, how pagination works, and how data flows between the client and server.

## System Overview

The editor is split into two services running in Docker containers. The frontend (Next.js) handles the UI and editor layout. The backend (FastAPI) stores documents on disk. All API requests go through Next.js server routes, which proxy to the FastAPI backend over the Docker network. This keeps the backend private and enables server-side rendering.

## Editor State Model

The editor maintains text content in a piece table data structure. A piece table uses two buffers (original and add) plus an array of pieces. Each piece points to a span in one of the buffers. Inserts append to the add buffer and split pieces further.

The piece table implements a TextBuffer interface with methods for length(), getSlice(start, end), insert(pos, text), and delete(start, end). The interface means you could swap in a rope or other datastructure later without changing the rest of the system.

The editor doesn't store the piece table structure when saving. It just calls toString() and sends plain text to the backend. On load, it rebuilds the piece table from scratch.

## Pagination Algorithm

The layout engine is a pure function that takes text and layout options (page dimensions, margins, line height, font) and returns an array of page slices. Each slice is a character range (start, end) that fits on one page.

Layout constants live in a single module (lib/layout/constants.ts). Changing page size or margins there affects the entire system. The default is A4 portrait (794×1123 px content area) with 40px margins and 20px line height.

The algorithm works like this:

1. Tokenise the text into words, whitespace and newlines. Newlines force line breaks.
2. Measure each token width using the Canvas API. Results are cached to avoid redundant measurements.
3. Place tokens on the current line until adding the next token would exceed maxWidth (page width minus margins). Then start a new line.
4. When the line count reaches maxLinesPerPage (calculated from page height, margins and line height), start a new page.
5. Return the list of page slices.

Measurement uses a hidden canvas element with the font set to match the textarea. The canvas context's measureText method gives accurate pixel widths. Measurements are cached per token so repeated words don't need remeasuring.

The layout engine runs on every keystroke, so could be optimised.

## Rendering and UI

The editor is a Next.js app using React and Tailwind CSS. The main Editor component is split into a few pieces:

- EditorHeader: title input, save button, dirty state indicator
- EditorTextarea: the textarea where you type, styled to match layout options
- LayoutToolbar: controls for page width, height, margins, line height, font size
- PagePreview: renders pages using the slices from the layout engine

The piece table and layout results live outside React state (in refs) to avoid unnecessary re-renders and duplication. Only UI state (like cursor position and which page is visible) goes into useState.

The textarea is styled with the same font size and line height as the layout constants.

Pages are rendered in a scrollable container on the right side of the screen. Each page shows its content (extracted from the text buffer using the slice start/end) plus a page number.

## Persistence Flow

Documents are stored as JSON files on disk in the backend. The schema is:

```json
{
  "id": "document_abc123...",
  "title": "My Document",
  "content": "plain text content",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T14:22:00Z"
}
```

The backend has four endpoints:

- POST /documents: create a new document, returns the full document with generated ID and timestamps
- GET /documents: list all documents (returns summaries without full content)
- GET /documents/{id}: fetch a single document by ID
- PATCH /documents/{id}: update title and/or content, refreshes updated_at

Storage is file-based. Each document lives at `storage/documents/{id}.json`. There's also an `storage/index.json` file that maps document IDs to summaries (id, title, timestamps). The list endpoint reads from the index, which is faster than scanning all files.

The backend uses Pydantic for request/response validation. Document schemas live in app/schemas/document.py. The service layer (app/services/documents.py) handles business logic like generating IDs and timestamps. The storage layer (app/storage/file_storage.py) handles disk I/O. Exceptions bubble up through custom types (DocumentNotFound, StorageError) and get converted to HTTP errors at the route level.

The frontend never talks to the FastAPI backend directly. All requests go through Next.js API routes (app/api/documents/...). These routes validate payloads with Zod, call the backend over the Docker network, validate responses, and return JSON. This setup lets Next.js do server-side rendering when needed.

The save flow works like this:

1. User clicks Save in the EditorHeader component.
2. The useDocumentSave hook calls PATCH /api/documents/{id} with title and content.
3. The Next.js route proxies to PATCH /documents/{id} on the FastAPI backend.
4. The backend updates the file on disk and refreshes the index.
5. The response comes back to the frontend with the updated document.
6. The hook updates lastSavedContent and shows a success message.

The load flow is simpler. The document page (/documents/[id]) fetches the document server-side and passes it as a prop to the Editor component. The Editor initialises the piece table with the content and runs the layout engine to compute pages.

## Docker and Deployment

Both services run in Docker. The api service uses Python 3.14 with FastAPI and Uvicorn. The web service uses Node 22 and Next.js. There are two web targets in the Dockerfile: a dev target for hot reload during development and a runner target for production builds.

The docker-compose.yml defines three services: api, web and web-dev. The Makefile wraps common commands (make start, make stop, make rebuild-web, etc). The default is make start, which brings up api and web in production mode.

There is only 1 environment variable, API_BASE_URL set to http://api:5005 so Next.js can find the backend on the Docker network. No secrets or API keys are required.
