import { Router } from 'express';
import authController from '../controllers/AuthController';

const router = Router();

// 用户认证相关API路由
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authController.getCurrentUser);

export default router;