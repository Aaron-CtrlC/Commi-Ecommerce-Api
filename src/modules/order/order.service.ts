import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

// TODO: implementar lógica de negocio para order
// export async function create(data) { ... }
// export async function findByUser(userId) { ... }
// export async function findAll() { ... }
// export async function updateStatus(id, status) { ... }


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

    async findByUser(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: { items: true },
        });
    }

    async findAll() {
        return await prisma.order.findMany({
            include: { items: true },
        });
    }

    async updateStatus(id, status) {
        const existing = await prisma.order.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Order not found');

        return prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}