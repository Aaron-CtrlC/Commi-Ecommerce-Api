import { z } from 'zod';

// TODO: definir schemas de validación para product
// export const createProductSchema = z.object({ ... });
// export const updateProductSchema = z.object({ ... });
// export const queryProductSchema = z.object({ ... });

export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be a positive number'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    categoryId: z.string().optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().optional(),
});

export const queryProductSchema = z.object({
    name: z.string().optional(),
    minPrice: z.number().positive('Min price must be a positive number').optional(),
    maxPrice: z.number().positive('Max price must be a positive number').optional(),
    categoryId: z.string().optional(),
    inStock: z.boolean().optional(),
});
    