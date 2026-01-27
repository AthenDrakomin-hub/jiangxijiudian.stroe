"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Partner_1 = __importDefault(require("../models/Partner"));
const Expense_1 = __importDefault(require("../models/Expense"));
const router = (0, express_1.Router)();
// 基础数据模型的通用路由
router.get('/partners', async (_req, res) => {
    try {
        const partners = await Partner_1.default.find({});
        res.json(partners);
    }
    catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ error: 'Failed to fetch partners' });
    }
});
router.get('/expenses', async (_req, res) => {
    try {
        const expenses = await Expense_1.default.find({});
        res.json(expenses);
    }
    catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});
exports.default = router;
