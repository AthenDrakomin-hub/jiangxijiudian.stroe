"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomsController_1 = __importDefault(require("../controllers/RoomsController"));
const DishesController_1 = __importDefault(require("../controllers/DishesController"));
const OrdersController_1 = __importDefault(require("../controllers/OrdersController"));
const SystemConfigController_1 = __importDefault(require("../controllers/SystemConfigController"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const roleGuard_1 = require("../middleware/roleGuard");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 房间相关API路由
router.get('/rooms/:roomNumber', auth_1.authMiddleware, RoomsController_1.default.getRoomByNumber);
router.get('/rooms', auth_1.authMiddleware, RoomsController_1.default.getAllRooms);
// 菜品相关API路由
router.get('/dishes', auth_1.authMiddleware, DishesController_1.default.getAllDishes);
router.get('/dishes/:id', auth_1.authMiddleware, DishesController_1.default.getDishById);
router.post('/dishes', auth_1.authMiddleware, DishesController_1.default.createDish);
router.put('/dishes/:id', auth_1.authMiddleware, DishesController_1.default.updateDish);
router.delete('/dishes/:id', auth_1.authMiddleware, DishesController_1.default.deleteDish);
// 订单相关API路由 - 允许 admin 和 staff
router.post('/orders', (0, roleGuard_1.verifyRole)(['admin', 'staff']), OrdersController_1.default.createOrder);
router.patch('/orders/:id/status', (0, roleGuard_1.verifyRole)(['admin', 'staff']), OrdersController_1.default.updateOrderStatus);
router.get('/orders/:id', (0, roleGuard_1.verifyRole)(['admin', 'staff']), OrdersController_1.default.getOrderById);
router.get('/orders', (0, roleGuard_1.verifyRole)(['admin', 'staff']), OrdersController_1.default.getOrders);
// 系统配置相关API路由 - 需要认证访问
router.get('/config', auth_1.authMiddleware, SystemConfigController_1.default.getConfig);
router.patch('/config', (0, roleGuard_1.verifyRole)(['admin']), SystemConfigController_1.default.updateConfig);
// 用户管理相关API路由 - 仅允许 admin
router.get('/users', (0, roleGuard_1.verifyRole)(['admin']), UserController_1.default.getAllUsers);
router.get('/users/:id', (0, roleGuard_1.verifyRole)(['admin']), UserController_1.default.getUserById);
exports.default = router;
