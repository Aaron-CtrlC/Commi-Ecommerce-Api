import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.js';
import { ForbiddenError, NotFoundError } from '../../utils/errors.js';
import { updateProfileSchema } from './user.schema.js';

export class UserService {
    
    async  create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword, 
        },
    });
}

async findByEmail(email: string) {
    return await prisma.user.findFirst({
        where: { email, deletedAt: null },
    });
}

async findById(id: string) {
    return await prisma.user.findFirst({
        where: { id, deletedAt: null },
    });
}

async comparePassword(user: any, password: string) {
    return await bcrypt.compare(password, user.password);
}


async  update(id: string, data: updateProfileSchema) {
    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundError('User not found');

    const updateData = { ...data };
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
        where: { id },
        data: updateData,
    });
}




async remove  (id: string) {
    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundError('User not found');

    return prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}

}


