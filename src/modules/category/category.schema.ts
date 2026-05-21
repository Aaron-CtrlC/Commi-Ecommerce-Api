import { z } from 'zod';

// TODO: definir schemas de validación para category
// export const createCategorySchema = z.object({ ... });
// export const updateCategorySchema = z.object({ ... });


export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  products: z.array(z.string()).optional(),
});




export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  products: z.array(z.string()).optional(),
});