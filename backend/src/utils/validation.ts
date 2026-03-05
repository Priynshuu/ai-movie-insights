import { z } from 'zod';

export const imdbIdRegex = /^tt\d{7,9}$/;

export const MovieInsightRequestSchema = z.object({
  imdbId: z.string()
    .trim()
    .regex(imdbIdRegex, 'Invalid IMDb ID format. Expected pattern: tt followed by 7-9 digits')
});

export type MovieInsightRequest = z.infer<typeof MovieInsightRequestSchema>;

export function validateImdbId(input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!imdbIdRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid IMDb ID format. Expected pattern: tt followed by 7-9 digits'
    };
  }
  return { valid: true };
}
