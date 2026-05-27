import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { NotFoundError } from '../../utils/errors.js';
import { createOrderSchema, updateOrderStatusSchema } from './order.schema.js';
import type { OrderService } from './order.service.js';
import type { PaymentService } from '../payment/payment.service.js';
import type { OrderItemService } from '../orderItem/orderItem.service.js';
import { z } from 'zod';

const addOrderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
});

export class OrderController {
    constructor(
        private orderService: OrderService,
        private paymentService: PaymentService,
        private orderItemService: OrderItemService
    ) { }

    create = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = createOrderSchema.parse(req.body);
        const order = await this.orderService.create(data, req.userId!);
        const { clientSecret, paymentIntentId } = await this.paymentService.createPayment(order.id, order.total);
        await this.orderService.updatePaymentIntentId(order.id, paymentIntentId);
        res.status(201).json({ success: true, data: {...order, clientSecret} });
    });

    getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
        const orders = await this.orderService.findByUser(req.userId!);
        res.json({ success: true, data: orders });
    });

    getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
        const orders = await this.orderService.findAll();
        res.json({ success: true, data: orders });
    });

    updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { status } = updateOrderStatusSchema.parse(req.body);
        const order = await this.orderService.updateStatus(req.params.id, status);
        res.json({ success: true, data: order });
    });

    // --- Sub-rutas de OrderItem ---

    getOrderItems = asyncHandler(async (req: AuthRequest, res: Response) => {
        const items = await this.orderItemService.findAll({ orderId: req.params.orderId });
        res.json({ success: true, data: items });
    });

    addOrderItem = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = addOrderItemSchema.parse(req.body);
        const item = await this.orderItemService.create({
            ...data,
            orderId: req.params.orderId,
        });
        res.status(201).json({ success: true, data: item });
    });

    updateOrderItem = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = req.body;
        const item = await this.orderItemService.update(req.params.itemId, data);
        res.json({ success: true, data: item });
    });

    removeOrderItem = asyncHandler(async (req: AuthRequest, res: Response) => {
        await this.orderItemService.remove(req.params.itemId);
        res.json({ success: true, message: 'Item removed successfully' });
    });
}