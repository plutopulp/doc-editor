import { z } from "zod";

export const HealthSchema = z.object({
  message: z.string(),
});

export type Health = z.infer<typeof HealthSchema>;

export const DocumentCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
});

export type DocumentCreate = z.infer<typeof DocumentCreateSchema>;

export const DocumentUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type DocumentUpdate = z.infer<typeof DocumentUpdateSchema>;

export const DocumentResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;

export const DocumentSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DocumentSummary = z.infer<typeof DocumentSummarySchema>;

export const DocumentListSchema = z.array(DocumentSummarySchema);

export type DocumentList = z.infer<typeof DocumentListSchema>;
