import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { NotFoundError } from '../../utils/errors.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';
import type { CategoryService } from './category.service.js';

export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    async create(req: AuthRequest, res: Response) {
        const data = createCategorySchema.parse(req.body);
        const category = await this.categoryService.create(data);
        res.status(201).json({ success: true, data: category });
    }

    async findAll(req: Request, res: Response) {
        const categories = await this.categoryService.findAll();
        res.json({ success: true, data: categories });
    }

    async findById(req: Request, res: Response) {
        const id = req.params.id;
        const category = await this.categoryService.findById(id);
        if (!category) throw new NotFoundError('Category not found');
        res.json({ success: true, data: category });
    }

    async update(req: AuthRequest, res: Response) {
        const id = req.params.id;
        const data = updateCategorySchema.parse(req.body);
        const category = await this.categoryService.update(id, data);
        res.json({ success: true, data: category });
    }

    async remove(req: AuthRequest, res: Response) {
        const id = req.params.id;
        await this.categoryService.remove(id);
        res.status(204).send();
    }
}
