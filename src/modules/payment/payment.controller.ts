import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import type { PaymentService } from './payment.service.js';

export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    handleWebhookEvent = asyncHandler(async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'] as string;

        await this.paymentService.processWebhook(req.body, sig);

        res.json({ received: true });
    });
}