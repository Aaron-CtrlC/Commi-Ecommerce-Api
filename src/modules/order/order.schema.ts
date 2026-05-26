import { z } from 'zod';

export const orderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});