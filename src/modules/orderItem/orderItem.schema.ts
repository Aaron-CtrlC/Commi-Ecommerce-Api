import { z } from 'zod';

export const createOrderItemSchema = z.object({
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
});

export const updateOrderItemSchema = z.object({
    orderId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    quantity: z.number().int().positive().optional(),
    unitPrice: z.number().positive().optional(),
});
