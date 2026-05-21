import { Router } from 'express';
import { auth } from '../../middleware/auth.js';

const router = Router();

// TODO: definir rutas de category
// router.get('/', getAll);
// router.get('/:id', getById);
// router.post('/', auth, create);
// router.put('/:id', auth, update);
// router.delete('/:id', auth, remove);


router.post('/category', auth, categoryController.create);

router.get('/category/:id', categoryController.findById);
router.get('/category', categoryController.findAll);

router.put('/category/:id', auth, categoryController.update);

router.delete('/category/:id',auth, categoryController.delete);


export default router;
