import { prisma } from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

// TODO: implementar lógica de negocio para product
// export async function findAll(filters) { ... }
// export async function getById(id) { ... }
// export async function create(data) { ... }
// export async function update(id, data) { ... }
// export async function remove(id) { ... }


export class ProductService {
    async create(data) {
        return await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                images: data.images,
                categoryId: data.categoryId,
            },
        });
    }

    async findAll(filters) {
        const where = { deletedAt: null };
        if (filters.name) {
            where['name'] = { contains: filters.name, mode: 'insensitive' };
        }
        if (filters.minPrice) {
            where['price'] = { gte: filters.minPrice };
        }
        if (filters.maxPrice) {
            where['price'] = { lte: filters.maxPrice };
        }
        if (filters.categoryId) {
            where['categoryId'] = filters.categoryId;
        }
        if (filters.inStock === true) {
            where['stock'] = { gt: 0 };
        }
        return await prisma.product.findMany({ where });
    }

    async getById(id) {
        return await prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
    }

    async update(id, data) {
        const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Product not found');

        return prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                images: data.images,
                categoryId: data.categoryId,
            },
        });
    }

    async remove(id) {
        const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw new NotFoundError('Product not found');

        return prisma.product.update({
            where: { id },
        });
    }


}