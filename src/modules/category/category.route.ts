import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { CategoryController } from './category.controller.js';
import { CategoryService } from './category.service.js';

const router = Router();
const categoryCtrl = new CategoryController(new CategoryService());

router.post('/category', auth, categoryCtrl.create);
router.get('/category', categoryCtrl.findAll);
router.get('/category/:id', categoryCtrl.findById);
router.put('/category/:id', auth, categoryCtrl.update);
router.delete('/category/:id', auth, categoryCtrl.remove);

export default router;
