import { Router } from 'express';
import authController from '../controllers/AuthController';
import UserCheckController from '../controllers/UserCheckController';

const router = Router();

// 用户认证相关API路由
router.post('/login', authController.login);

// 用户数据检查接口（仅用于调试）
router.get('/check-users', UserCheckController.checkUsers);

export default router;