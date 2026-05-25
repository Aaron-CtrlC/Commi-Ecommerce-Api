import type { Request, Response } from 'express';
import type { UserService } from './user.service.js';

import { asyncHandler } from '../../middleware/asyncHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { loginSchema, registerSchema, updateProfileSchema } from './user.schema.js';
export class UserController {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    register = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = registerSchema.parse(req.body);
        const user = await this.userService.create( data );
        res.status(201).json({ success: true, data: user, message: 'User registered successfully' });
    })

    login = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = loginSchema.parse(req.body);
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await this.userService.comparePassword(user, data.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        res.status(200).json({ success: true, data: user, message: 'User logged in successfully' });
    })

    getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.userId;
        const user = await this.userService.findById(id);
        res.status(200).json({ success: true, data: user });
    })

    updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.userId;
        const data = updateProfileSchema.parse(req.body);
        await this.userService.update(id, data);
        const updatedUser = await this.userService.findById(id);
        res.status(200).json({ success: true, data: updatedUser, message: 'User profile updated successfully' });
    })

    deleteProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.userId;
        await this.userService.remove(id);
        res.status(200).json({ success: true, message: 'User profile deleted successfully' });
    })
}
