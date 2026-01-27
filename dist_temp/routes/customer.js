"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerController_1 = __importDefault(require("../controllers/CustomerController"));
const router = (0, express_1.Router)();
// 客户点餐相关API路由（无需认证）
router.get('/rooms/:roomNumber', CustomerController_1.default.getRoomInfo);
router.get('/menu', CustomerController_1.default.getMenu);
router.post('/orders', CustomerController_1.default.createOrder);
router.get('/orders/:orderId', CustomerController_1.default.getOrderStatus);
router.get('/rooms/:roomNumber/orders', CustomerController_1.default.getRoomOrders);
exports.default = router;
