import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { NotFoundError } from '../../utils/errors.js';
import { createProductSchema, updateProductSchema } from './product.schema.js';
import type { ProductService } from './product.service.js';

export class ProductController {
    constructor(private productService: ProductService) {}

    async create(req: AuthRequest, res: Response) {
        const data = createProductSchema.parse(req.body);
        const product = await this.productService.create(data);
        res.status(201).json({ success: true, data: product });
    }

    async findAll(req: Request, res: Response) {
        const filters = req.query;
        const products = await this.productService.findAll(filters);
        res.json({ success: true, data: products });
    }

    async findById(req: Request, res: Response) {
        const product = await this.productService.getById(req.params.id);
        if (!product) throw new NotFoundError('Product not found');
        res.json({ success: true, data: product });
    }

    async update(req: AuthRequest, res: Response) {
        const data = updateProductSchema.parse(req.body);
        const product = await this.productService.update(req.params.id, data);
        res.json({ success: true, data: product });
    }

    async remove(req: AuthRequest, res: Response) {
        await this.productService.remove(req.params.id);
        res.status(204).send();
    }
}
