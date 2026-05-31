import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import type { updateProductSchema, createProductSchema } from './product.schema';

export class ProductService {
    async create(data: createProductSchema) {
        return await prisma.product.create({ data });
    }

    async findAll(filters: Record<string, unknown>) {
        const where: Record<string, unknown> = { deletedAt: null };
        return await prisma.product.findMany({ where });
    }

    async getById(id: string) {
        return await prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
    }

    async update(id: string, data: updateProductSchema) {
        const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Product not found');

        return prisma.product.update({ where: { id }, data });
    }

    async remove(id: string) {
        const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Product not found');

        return prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}