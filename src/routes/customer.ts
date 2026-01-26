import { Router } from 'express';
import customerController from '../controllers/CustomerController';

const router = Router();

// 客户点餐相关API路由（无需认证）
router.get('/rooms/:roomNumber', customerController.getRoomInfo);
router.get('/menu', customerController.getMenu);
router.post('/orders', customerController.createOrder);
router.get('/orders/:orderId', customerController.getOrderStatus);
router.get('/rooms/:roomNumber/orders', customerController.getRoomOrders);

export default router;