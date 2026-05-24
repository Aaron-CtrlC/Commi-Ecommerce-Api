import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

const router = Router();

const userCtrl = new UserController(new UserService());

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/profile', auth, userCtrl.getProfile);
router.put('/profile', auth, userCtrl.updateProfile);
router.delete('/profile', auth, userCtrl.deleteProfile);

export default router;
