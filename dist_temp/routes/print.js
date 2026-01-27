"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PrintController_1 = __importDefault(require("../controllers/PrintController"));
const router = (0, express_1.Router)();
// 打印订单
router.post('/orders/:id', PrintController_1.default.printOrder);
exports.default = router;
