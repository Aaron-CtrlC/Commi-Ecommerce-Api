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
    return await prisma.user.findUnique({
        where: { email },
    });
}

async  findById(id: string): Promise<any> {
    // TODO: implementar lógica de búsqueda por ID
    return await prisma.user.findUnique({
        where: { id },
    });
}

async comparePassword(user: any, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
}


async  update(id: string, data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10); // TODO: hashear la contraseña antes de actualizarla
    return await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword, // TODO: hashear la contraseña antes de actualizarla
        },
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


