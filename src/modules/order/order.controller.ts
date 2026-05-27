import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { NotFoundError } from '../../utils/errors.js';
import { createOrderSchema, updateOrderStatusSchema } from './order.schema.js';
import type { OrderService } from './order.service.js';
import type { PaymentService } from '../payment/payment.service.js';

export class OrderController {
    constructor(private orderService: OrderService,
        private paymentService: PaymentService
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
}
