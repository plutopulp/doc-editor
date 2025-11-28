import { z } from "zod";

/**
 * Zod schemas for FastAPI response validation
 */

// Health endpoint
export const HealthSchema = z.object({
  message: z.string(),
});

export type Health = z.infer<typeof HealthSchema>;

// Document schemas (mirrors FastAPI Pydantic models)

/**
 * Schema for creating a new document
 */
export const DocumentCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
});

export type DocumentCreate = z.infer<typeof DocumentCreateSchema>;

/**
 * Schema for full document response
 */
export const DocumentResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;

/**
 * Schema for document summary (used in listings)
 */
export const DocumentSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DocumentSummary = z.infer<typeof DocumentSummarySchema>;

/**
 * Schema for list of document summaries
 */
export const DocumentListSchema = z.array(DocumentSummarySchema);

export type DocumentList = z.infer<typeof DocumentListSchema>;
