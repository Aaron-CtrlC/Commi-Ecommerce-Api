import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';




export class OrderService {


    async create(data) {
        const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        return prisma.$transaction(async (tx)=>{
            const order = await tx.order.create({
                data: {
                    userId: data.userId,
                    total,
                    status: 'PENDING',                },
        });

        await tx.orderItem.createMany({
            data: data.items.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
        });

        return order;
    })
    }

    async findByUser(userId: string) {
        return await prisma.order.findMany({
            where: { userId, deletedAt: null },
            include: { items: true },
        });
    }

    async findAll() {
        return await prisma.order.findMany({
            where: { deletedAt: null },
            include: { items: true },
        });
    }

    async updateStatus(id: string, status: 'PENDING' | 'PAID' | 'CANCELLED') {
        const existing = await prisma.order.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Order not found');

        return prisma.order.update({
            where: { id },
            data: { status },
        });
    }


    async updatePaymentIntentId (id: string, paymentIntentId: string) {
        const existing = await prisma.order.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Order not found');

        return prisma.order.update({
            where: { id },
            data: { stripePaymentIntentId: paymentIntentId },
        });
    }

}