import { z } from 'zod';

export const StreamableRoastedDesignsSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  improvements: z.string().optional(),
  whatsWrong: z.string().optional(),
  improvedHtml: z.string().optional(),
  internalImprovedHtml: z.string().optional(),
  improvedReact: z.string().optional(),
  originalImageUrl: z.string().optional(),
  dataElements: z
    .array(
      z
        .object({
          improvement: z.string().optional(),
          element: z.string().optional(),
        })
        .optional(),
    )
    .optional(),
  chunkType: z.enum(['IMPROVEMENTS', 'NEW_DESIGN', 'ROASTED_DESIGN']),
  chunkStatus: z
    .enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])
    .default('PENDING'),
  // error: z.string().nullable(),
});

export type StreamableRoastedDesign = z.infer<
  typeof StreamableRoastedDesignsSchema
>;
