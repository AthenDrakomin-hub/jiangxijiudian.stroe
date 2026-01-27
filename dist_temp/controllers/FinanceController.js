"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order")); // 使用订单模型获取财务数据
class FinanceController {
    constructor() {
        this.getAllFinanceRecords = async (req, res) => {
            try {
                const { startDate, endDate, type } = req.query;
                const filters = {};
                if (startDate && endDate) {
                    filters.createdAt = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    };
                }
                let orders;
                if (type === 'daily') {
                    // 按天汇总
                    orders = await Order_1.default.aggregate([
                        {
                            $match: {
                                status: { $in: ['delivered', 'confirmed'] },
                                ...filters
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                                },
                                totalRevenue: { $sum: "$totalAmount" },
                                orderCount: { $sum: 1 },
                                averageOrderValue: { $avg: "$totalAmount" }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]);
                }
                else {
                    // 所有订单记录
                    orders = await Order_1.default.find({
                        ...filters,
                        status: { $in: ['delivered', 'confirmed'] }
                    }).sort({ createdAt: -1 });
                }
                res.json(orders);
            }
            catch (error) {
                console.error('Error fetching finance records:', error);
                res.status(500).json({ error: 'Failed to fetch finance records' });
            }
        };
        this.getFinanceRecordById = async (req, res) => {
            try {
                const id = req.params.id;
                const order = await Order_1.default.findById(id);
                if (!order) {
                    res.status(404).json({ error: 'Finance record not found' });
                    return;
                }
                res.json({
                    id: order._id,
                    roomNumber: order.roomNumber,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                });
            }
            catch (error) {
                console.error('Error fetching finance record:', error);
                res.status(500).json({ error: 'Failed to fetch finance record' });
            }
        };
        this.createFinanceRecord = async (req, res) => {
            try {
                const { description, amount, type, date } = req.body;
                // 在实际应用中，这里应该创建专门的财务记录
                // 现在我们简单返回一个模拟的财务记录
                const financeRecord = {
                    description,
                    amount,
                    type: type || 'income',
                    date: date || new Date(),
                    createdAt: new Date()
                };
                res.status(201).json(financeRecord);
            }
            catch (error) {
                console.error('Error creating finance record:', error);
                res.status(500).json({ error: 'Failed to create finance record' });
            }
        };
        this.updateFinanceRecord = async (req, res) => {
            try {
                const id = req.params.id;
                const { description, amount, type } = req.body;
                // 在实际应用中，这里应该更新财务记录
                const financeRecord = {
                    id,
                    description,
                    amount,
                    type,
                    updatedAt: new Date()
                };
                res.json(financeRecord);
            }
            catch (error) {
                console.error('Error updating finance record:', error);
                res.status(500).json({ error: 'Failed to update finance record' });
            }
        };
        this.deleteFinanceRecord = async (req, res) => {
            try {
                const id = req.params.id;
                // 出于财务审计需要，通常不允许删除财务记录
                res.json({ message: 'Finance records cannot be deleted for audit compliance' });
            }
            catch (error) {
                console.error('Error deleting finance record:', error);
                res.status(500).json({ error: 'Failed to delete finance record' });
            }
        };
    }
}
exports.default = new FinanceController();
