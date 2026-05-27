import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import { createOrderItemSchema, updateOrderItemSchema } from './orderItem.schema.js';

export class OrderItemService {
    async create(data: createOrderItemSchema) {
        return await prisma.orderItem.create({ data });
    }

    async findAll(filters: { orderId?: string; productId?: string }) {
        const where: Record<string, string> = {};
        if (filters.orderId) where['orderId'] = filters.orderId;
        if (filters.productId) where['productId'] = filters.productId;
        return await prisma.orderItem.findMany({ where });
    }

    async getById(id: string) {
        return await prisma.orderItem.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: updateOrderItemSchema) {
        const existing = await prisma.orderItem.findFirst({ where: { id } });
        if (!existing) throw new NotFoundError('OrderItem not found');

        return await prisma.orderItem.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        const existing = await prisma.orderItem.findFirst({ where: { id } });
        if (!existing) throw new NotFoundError('OrderItem not found');

        return prisma.orderItem.delete({
            where: { id },
        });
    }

}

    async findAll(filters) {
        const where = {};
        if (filters.orderId) {
            where['orderId'] = filters.orderId;
        }
        if (filters.productId) {
            where['productId'] = filters.productId;
        }
        return await prisma.orderItem.findMany({ where });
    }

    async getById(id) {
        return await prisma.orderItem.findUnique({
            where: { id },
        });
    }

    async update(id, data) {
        return await prisma.orderItem.update({
            where: { id },
            data: {
                orderId: data.orderId,
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
            },
        });
    }

    async remove(id) {
        const existing = await prisma.orderItem.findFirst({ where: { id } });
        if (!existing) throw new NotFoundError('OrderItem not found');

        return prisma.orderItem.delete({
            where: { id },
        });
    }

}
        