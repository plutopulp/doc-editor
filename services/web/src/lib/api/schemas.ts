import { z } from "zod";

/**
 * Zod schemas for FastAPI response validation
 */

export const HealthSchema = z.object({
  message: z.string(),
});

export type Health = z.infer<typeof HealthSchema>;
