import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { NotFoundError } from '../../utils/errors.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';
import type { CategoryService } from './category.service.js';

export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    create = asyncHandler(async (req: AuthRequest, res: Response) => {
        const data = createCategorySchema.parse(req.body);
        const category = await this.categoryService.create(data);
        res.status(201).json(category);
    });

    findAll = asyncHandler(async (req: Request, res: Response) => {
        const categories = await this.categoryService.findAll();
        res.json(categories);
    });

    findById = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const category = await this.categoryService.findById(id);
        if (!category) throw new NotFoundError('Category not found');
        res.json(category);
    });

    update = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id;
        const data = updateCategorySchema.parse(req.body);
        const category = await this.categoryService.update(id, data);
        res.json(category);
    });

    remove = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id;
        await this.categoryService.remove(id);
        res.status(204).send();
    });
}
