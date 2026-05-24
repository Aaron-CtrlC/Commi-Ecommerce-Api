import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';

const router = Router();
const productCtrl = new ProductController(new ProductService());

router.get('/product', productCtrl.findAll);
router.get('/product/:id', productCtrl.findById);
router.post('/product', auth, productCtrl.create);
router.put('/product/:id', auth, productCtrl.update);
router.delete('/product/:id', auth, productCtrl.remove);

export default router;
