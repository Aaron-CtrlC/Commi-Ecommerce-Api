import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { NotFoundError } from '../../utils/errors.js';
import { createOrderSchema, updateOrderStatusSchema } from './order.schema.js';
import type { OrderService } from './order.service.js';

export class OrderController {
    constructor(private orderService: OrderService) {}

    create = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = createOrderSchema.parse({ ...req.body, userId: req.userId });
        const order = await this.orderService.create(data);
        res.status(201).json({ success: true, data: order });
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
