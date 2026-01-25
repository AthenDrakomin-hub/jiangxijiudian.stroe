import { Router } from 'express';
import roomsController from '../controllers/RoomsController';
import dishesController from '../controllers/DishesController';
import ordersController from '../controllers/OrdersController';
import systemConfigController from '../controllers/SystemConfigController';
import userController from '../controllers/UserController';
import { verifyRole } from '../middleware/roleGuard';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 房间相关API路由
router.get('/rooms/:roomNumber', authMiddleware, roomsController.getRoomByNumber);
router.get('/rooms', authMiddleware, roomsController.getAllRooms);

// 菜品相关API路由
router.get('/dishes', authMiddleware, dishesController.getAllDishes);
router.get('/dishes/:id', authMiddleware, dishesController.getDishById);
router.post('/dishes', authMiddleware, dishesController.createDish);
router.put('/dishes/:id', authMiddleware, dishesController.updateDish);
router.delete('/dishes/:id', authMiddleware, dishesController.deleteDish);

// 订单相关API路由 - 允许 admin 和 staff
router.post('/orders', verifyRole(['admin', 'staff']), ordersController.createOrder);
router.patch('/orders/:id/status', verifyRole(['admin', 'staff']), ordersController.updateOrderStatus);
router.get('/orders/:id', verifyRole(['admin', 'staff']), ordersController.getOrderById);
router.get('/orders', verifyRole(['admin', 'staff']), ordersController.getOrders);

// 系统配置相关API路由 - 需要认证访问
router.get('/config', authMiddleware, systemConfigController.getConfig);
router.patch('/config', verifyRole(['admin']), systemConfigController.updateConfig);

// 用户管理相关API路由 - 仅允许 admin
router.get('/users', verifyRole(['admin']), userController.getAllUsers);
router.get('/users/:id', verifyRole(['admin']), userController.getUserById);
router.patch('/users/:id/permissions', verifyRole(['admin']), userController.updatePermissions);

export default router;