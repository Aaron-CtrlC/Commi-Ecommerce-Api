import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';


const router = Router();
const orderCtrl = new OrderController(new OrderService());
router.post('/order', auth, orderCtrl.create);
router.get('/order/me', auth, orderCtrl.getMyOrders);
router.get('/order', auth, orderCtrl.getAll);
router.patch('/order/:id/status', auth, orderCtrl.updateStatus);



export default router;


