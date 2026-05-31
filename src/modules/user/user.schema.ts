import { z } from 'zod';




const registerSchema = z.object({
    name: z.string().min(3).max(20).trim()
        .toLowerCase(),
    email: z.string().pipe(z.email("Invalid email address")),
    password: z.string().min(6),
});



const loginSchema = z.object({
    email: z.string().pipe(z.email("Invalid email address")),
    password: z.string().min(6),
});

const updateProfileSchema = z.object({
    name: z.string().min(3).max(20).trim()
        .toLowerCase()
        .optional(),
    email: z.string().pipe(z.email("Invalid email address")).optional(),
    password: z.string().min(6).optional(),
});

export { registerSchema, loginSchema, updateProfileSchema };