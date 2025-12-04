# Document Editor

A minimal document editor with live pagination. Type text and watch it flow across fixed-size A4 pages in real time. Save and load documents via a simple backend API.

## Context

This project was built as a take-home case study for a startup interview, with a 24 hour time constraint.

The brief asked for:

- Live pagination during editing with visible page boundaries and page numbers
- Content reflow across pages as you type
- Save/load via a simple backend API
- Deterministic layout that reproduces on reload
- Clean separation between editor state, layout engine, and persistence

I chose to use a piece table for the text buffer, though the data structure was left open to the candidate.

Given the time constraint, some areas weren't fully polished. See [IMPROVEMENT_IDEAS.md](IMPROVEMENT_IDEAS.md) for notes on some of the things I'd change with more time.

For details on AI tool usage during development, see [AI_USAGE.md](AI_USAGE.md).

## Quick Start

Requirements: Docker and Docker Compose

```bash
make start
```

Open http://localhost:3000

That's it. The command starts both the Next.js frontend (build version) and FastAPI backend in Docker containers.

## Development

Start with hot reload:

```bash
make start ENV=dev
```

Other commands:

```bash
make stop          # Stop services
make restart       # Restart services
make logs          # View logs
make ps            # List running containers
```

## API Endpoints

All requests return JSON. Timestamps are UTC ISO 8601.

Interactive API docs available at http://localhost:5005/docs when running.

### Create document

```bash
POST /documents
{
  "title": "My Document",
  "content": "Plain text content"
}

→ 201 Created
{
  "id": "document_abc123...",
  "title": "My Document",
  "content": "Plain text content",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Get document

```bash
GET /documents/{id}

→ 200 OK (same schema as create)
→ 404 Not Found
```

### Update document

```bash
PATCH /documents/{id}
{
  "title": "Updated Title",     # optional
  "content": "Updated content"  # optional
}

→ 200 OK (full document)
→ 404 Not Found
```

### List documents

```bash
GET /documents

→ 200 OK
[
  {
    "id": "document_abc123...",
    "title": "My Document",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T14:22:00Z"
  },
  ...
]
```

## Data Model

Documents are stored as JSON files in `services/api/storage/documents/`. Each file contains:

```json
{
  "id": "document_abc123...",
  "title": "string",
  "content": "string (plain text)",
  "created_at": "ISO 8601 UTC",
  "updated_at": "ISO 8601 UTC"
}
```

An index file (`storage/index.json`) maps document IDs to summaries for fast listing.

Storage is file-based (temp file + `os.replace`).

## Pagination Strategy

The editor uses a custom layout engine that:

1. **Tokenizes** text into words, whitespace and newlines
2. **Measures** each token using Canvas API (`measureText`)
3. **Breaks lines** when width exceeds page width minus margins
4. **Breaks pages** when line count exceeds page height divided by line height
5. **Returns page slices** as character ranges `(start, end)` for deterministic rendering

Layout constants (page size, margins, line height, font) live in `services/web/src/lib/layout/constants.ts`, but these can be updated in the editor.

The algorithm is deterministic: same text and options should produce the same page breaks. It runs on every keystroke (full reflow, no incremental optimisation yet).

Text content is stored in a piece table (two buffers + piece descriptors) for efficient insert/delete operations. The piece table isn't persisted, documents are saved as plain text and reconstructed on load.

## Architecture

See `ARCHITECTURE.md` for details on:

- Editor state model (piece table)
- Pagination algorithm
- Backend storage and API design
- Docker setup and deployment

## Environment

Only one environment variable is needed:

- `API_BASE_URL` - Set to `http://api:5005` in Docker Compose (already configured)

No secrets, API keys or external services required.

## Notes

- Pages are A4 portrait (794×1123 px content area, 40px margins)
- Font is sans-serif, consistent across sessions
- Layout is deterministic within one environment (browser/OS font rendering may vary slightly)
- Storage is synchronous file I/O (runs in FastAPI threadpool)
- No rich text formatting, images or tables (plain text only)
- No undo/redo, collaborative editing or mobile optimisation
