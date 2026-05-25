import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

// TODO: implementar lógica de negocio para orderItem
// (generalmente se maneja desde order.service)
// export async function create(data) { ... }




export class OrderItemService {
    async create(data) {
        return await prisma.orderItem.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
            },
        });
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

        return prisma.orderItem.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

}
        