import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export class CategoryService {
    async create(data: { name: string; description?: string }) {
        return prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
            },
        });
    }

    async findAll() {
        return prisma.category.findMany({
            where: { deletedAt: null },
        });
    }

    async findById(id: string) {
        return prisma.category.findFirst({
            where: { id, deletedAt: null },
        });
    }

    async update(id: string, data: { name?: string; description?: string }) {
        const existing = await prisma.category.findFirst({
            where: { id, deletedAt: null },
        });

        if (!existing) throw new NotFoundError('Category not found');

        return prisma.category.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
            },
        });
    }

    async remove(id: string) {
        const existing = await prisma.category.findFirst({
            where: { id, deletedAt: null },
        });

        if (!existing) throw new NotFoundError('Category not found');

        return prisma.category.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
