import type { Request, Response } from 'express';
import { OrderItemService } from './orderItem.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createOrderItemSchema, updateOrderItemSchema } from './orderItem.schema.js';

class OrderItemController {
    constructor(private orderItemService: OrderItemService) { }

    create = asyncHandler(async (req: Request, res: Response) => {
        const data = createOrderItemSchema.parse(req.body);
        const orderItem = await this.orderItemService.create(data);
        res.status(201).json({ success: true, data: orderItem });
    });

    findAll = asyncHandler(async (req: Request, res: Response) => {
        const filters = req.query as { orderId?: string; productId?: string };
        const orderItems = await this.orderItemService.findAll(filters);
        res.json({ success: true, data: orderItems });
    });

    findById = asyncHandler(async (req: Request, res: Response) => {
        const orderItem = await this.orderItemService.getById(req.params.id);
        if (!orderItem) return res.status(404).json({ success: false, message: 'OrderItem not found' });
        res.json({ success: true, data: orderItem });
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const data = updateOrderItemSchema.parse(req.body);
        const orderItem = await this.orderItemService.update(req.params.id, data);
        res.json({ success: true, data: orderItem });
    });

    remove = asyncHandler(async (req: Request, res: Response) => {
        await this.orderItemService.remove(req.params.id);
        res.json({ success: true, message: 'OrderItem removed successfully' });
    });
}