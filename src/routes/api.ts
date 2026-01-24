import { Router } from 'express';
import roomsController from '../controllers/RoomsController';
import dishesController from '../controllers/DishesController';
import ordersController from '../controllers/OrdersController';
import systemConfigController from '../controllers/SystemConfigController';
import userController from '../controllers/UserController';
import { verifyRole } from '../middleware/roleGuard';

const router = Router();

// 房间相关API路由
router.get('/rooms/:roomNumber', roomsController.getRoomByNumber);
router.get('/rooms', roomsController.getAllRooms);

// 菜品相关API路由
router.get('/dishes', dishesController.getAllDishes);
router.get('/dishes/:id', dishesController.getDishById);
router.post('/dishes', dishesController.createDish);
router.put('/dishes/:id', dishesController.updateDish);
router.delete('/dishes/:id', dishesController.deleteDish);

// 订单相关API路由 - 允许 admin 和 staff
router.post('/orders', verifyRole(['admin', 'staff']), ordersController.createOrder);
router.patch('/orders/:id/status', verifyRole(['admin', 'staff']), ordersController.updateOrderStatus);
router.get('/orders/:id', verifyRole(['admin', 'staff']), ordersController.getOrderById);
router.get('/orders', verifyRole(['admin', 'staff']), ordersController.getOrders);

// 系统配置相关API路由 - 允许公开访问获取配置，但更新仍需要admin权限
router.get('/config', systemConfigController.getConfig);
router.patch('/config', verifyRole(['admin']), systemConfigController.updateConfig);

// 用户管理相关API路由 - 仅允许 admin
router.get('/users', verifyRole(['admin']), userController.getAllUsers);
router.get('/users/:id', verifyRole(['admin']), userController.getUserById);
router.patch('/users/:id/permissions', verifyRole(['admin']), userController.updatePermissions);

export default router;