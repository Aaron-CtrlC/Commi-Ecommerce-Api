import { Router, raw } from 'express';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';

const router = Router();
const paymentCtrl = new PaymentController(new PaymentService());

router.post('/webhook', raw({ type: 'application/json' }), paymentCtrl.handleWebhookEvent);

export default router;
