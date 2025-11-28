# AI Usage

This document describes how AI tools were used in building this document editor.

## Tools Used

**Cursor AI** with Claude Sonnet 4.5 was my primary development assistant for most of the project. Although usage was limited after hitting the "usage limit quota", but AI assistance increased again in the final phase due to time constraints.

## Development Approach

### Planning Process

The general workflow was:

1. Create detailed plans upfront, always requesting code snippets or full implementations within the plan itself
2. Break larger features into discrete steps
3. Implement one step at a time, pausing after each for review and iteration (crucial imo)
4. Only proceed to the next step after explicit approval
5. Never let the agent continue automatically without review

### Test-Driven Development

Initially used a TDD approach for core logic:

- Text buffer (piece table) implementation
- Layout engine and pagination algorithms
- Measurement and tokenization functions

Tests were written first, then implementations followed. Testing was dropped for UI components.

## What AI Helped With

### Layout Engine (Heavy AI Usage)

The pagination algorithm, text measurement, and tokenization logic relied heavily on AI assistance. This included:

- Canvas-based text measurement
- Token-based line breaking
- Page slice generation
- Edge case handling

### Piece Table (Moderate AI Usage)

Much less AI reliance here. The data structure and operations were mostly understood upfront, but AI helped with:

- Implementation details
- Test cases
- Edge case handling

### Backend API (Minimal AI Usage)

Had a clear vision for the backend architecture:

- FastAPI with Pydantic schemas
- Indexed file-based storage
- Service layer pattern
- Dependency Injection
- Custom exception handling

Gave very specific instructions on how to structure it. AI mostly generated boilerplate based on detailed specifications.

### Docker & Architecture (Minimal AI Usage)

Handled most of the setup directly:

- Docker Compose configuration
- Multi-stage Dockerfile setup
- Network configuration between services
- Makefile for common commands

### Frontend Integration at the end (Heavy AI Usage - Time Pressure)

After the API was complete, time was running out. This phase relied heavily on AI with less review time:

- Next.js API proxy routes
- Component structure (Navbar, DocumentCard, Editor modules)
- React hooks for document creation and updates
- Save/load flow and dirty state tracking
- Document list and editor page updates.
- Error boundaries

The step-by-step review process from earlier phases was compressed here due to the deadline.

### Documentation & Communication (AI-Assisted)

AI was also used for documentation tasks:

- Code documentation
- ARCHITECTURE.md - AI surveyed the codebase and generated the architecture document based on the actual implementation
- PR descriptions and commit messages - AI helped write clear, concise summaries of changes
- This AI_USAGE.md file itself :p - drafted with AI assistance and reviewed/edited for accuracy

## Code Ownership

All generated code was reviewed, though the depth of review varied depending on time constraints. The architecture decisions, trade-offs, and overall design were driven by explicit requirements rather than AI suggestions. The AI acted as an implementation assistant within a predetermined structure.
