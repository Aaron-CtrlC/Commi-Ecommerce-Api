import express, { Router, raw } from 'express';
import rateLimit from 'express-rate-limit';

import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler.js';
import categoryRoutes from './modules/category/category.route.js';
import userRoutes from './modules/user/user.route.js';
import productRoutes from './modules/product/product.route.js';
import orderRoutes from './modules/order/order.route.js';
import { PaymentController } from './modules/payment/payment.controller.js';
import { PaymentService } from './modules/payment/payment.service.js';

const app = express();

// 1. Webhook — necesita body crudo, ANTES del json parser
const webhookRouter = Router();
const paymentCtrl = new PaymentController(new PaymentService());
webhookRouter.post('/webhook', raw({ type: 'application/json' }), paymentCtrl.handleWebhookEvent);
app.use(webhookRouter);

// 2. JSON parser para todas las rutas normales
app.use(express.json());

// 3. Rate limiter para endpoints públicos (evita fuerza bruta en /login y /register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,                   // máx 10 requests por ventana
    message: { success: false, message: 'Demasiadas solicitudes. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,     // devuelve RateLimit-* headers (estándar)
    legacyHeaders: false,      // no usa X-RateLimit-* headers (deprecados)
});

app.use('/login', authLimiter);
app.use('/register', authLimiter);

// 4. Routes
app.use(categoryRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);

app.use(errorHandler);

export default app;
