import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.js';
import { ForbiddenError, NotFoundError } from '../../utils/errors.js';

// TODO: implementar lógica de negocio para user
// export async function createUser(data) { ... }
// export async function findByEmail(email) { ... }

export class UserService {
    
    async  create(data) {
    // TODO: implementar lógica de creación de usuario
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword, // TODO: hashear la contraseña antes de guardarla
        },
    });
}

async  findByEmail(email: string): Promise<any> {
    return await prisma.user.findFirst({
        where: { email, deletedAt: null },
    });
}

async  findById(id: string): Promise<any> {
    return await prisma.user.findFirst({
        where: { id, deletedAt: null },
    });
}

async comparePassword(user: any, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
}


async  update(id: string, data: any) {
    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundError('User not found');

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

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


