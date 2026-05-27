import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import type { PaymentService } from './payment.service.js';

export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    handleWebhookEvent = asyncHandler(async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'] as string;
        if (!sig) {
            res.status(400).json({ success: false, error: 'Missing stripe-signature header' });
            return;
        }

        try {
            await this.paymentService.processWebhook(req.body, sig);
        } catch {
            res.status(400).json({ success: false, error: 'Invalid signature' });
            return;
        }

        res.json({ received: true });
    });
}