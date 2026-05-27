import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { PaymentService } from '../payment/payment.service.js';
import { OrderItemService } from '../orderItem/orderItem.service.js';

const router = Router();
const orderCtrl = new OrderController(new OrderService(), new PaymentService(), new OrderItemService());

// Order routes
router.post('/order', auth, orderCtrl.create);
router.get('/order/me', auth, orderCtrl.getMyOrders);
router.get('/order', auth, orderCtrl.getAll);
router.patch('/order/:id/status', auth, orderCtrl.updateStatus);

// OrderItem sub-routes (anidadas bajo /order/:orderId/items)
router.get('/order/:orderId/items', auth, orderCtrl.getOrderItems);
router.post('/order/:orderId/items', auth, orderCtrl.addOrderItem);
router.put('/order/:orderId/items/:itemId', auth, orderCtrl.updateOrderItem);
router.delete('/order/:orderId/items/:itemId', auth, orderCtrl.removeOrderItem);

export default router;