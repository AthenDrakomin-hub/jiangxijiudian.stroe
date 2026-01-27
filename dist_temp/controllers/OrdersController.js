"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order"));
const Dish_1 = __importDefault(require("../models/Dish"));
class OrdersController {
    constructor() {
        this.createOrder = async (req, res) => {
            try {
                const { tableId, roomNumber, items, note, paymentMethod } = req.body;
                // 验证必需字段
                if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
                    res.status(400).json({ error: 'Table ID and items are required' });
                    return;
                }
                // 获取菜品详情并计算总价
                let totalAmount = 0;
                const orderItems = [];
                for (const orderItem of items) {
                    const { dishId, quantity } = orderItem;
                    if (!dishId || !quantity || quantity <= 0) {
                        res.status(400).json({ error: 'Each item must have a valid dishId and quantity' });
                        return;
                    }
                    const dish = await Dish_1.default.findById(dishId);
                    if (!dish || !dish.isAvailable) {
                        res.status(400).json({ error: `Dish with id ${dishId} is not available` });
                        return;
                    }
                    const itemTotal = dish.price * quantity;
                    totalAmount += itemTotal;
                    orderItems.push({
                        dishId: dish._id,
                        name: dish.name,
                        price: dish.price,
                        quantity,
                    });
                }
                // 创建订单
                const order = new Order_1.default({
                    tableId,
                    roomNumber,
                    items: orderItems,
                    totalAmount,
                    status: 'pending',
                    note,
                    paymentMethod
                });
                const savedOrder = await order.save();
                res.status(201).json(savedOrder);
            }
            catch (error) {
                console.error('Error creating order:', error);
                res.status(500).json({ error: 'Failed to create order' });
            }
        };
        this.updateOrderStatus = async (req, res) => {
            try {
                const id = req.params.id;
                const { status } = req.body;
                // 验证状态值是否合法
                const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
                if (!validStatuses.includes(status)) {
                    res.status(400).json({ error: 'Invalid status value' });
                    return;
                }
                const order = await Order_1.default.findByIdAndUpdate(id, { status }, { new: true });
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json(order);
            }
            catch (error) {
                console.error('Error updating order status:', error);
                res.status(500).json({ error: 'Failed to update order status' });
            }
        };
        this.getOrderById = async (req, res) => {
            try {
                const id = req.params.id;
                const order = await Order_1.default.findById(id);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json(order);
            }
            catch (error) {
                console.error('Error fetching order:', error);
                res.status(500).json({ error: 'Failed to fetch order' });
            }
        };
        this.getOrders = async (req, res) => {
            try {
                const { status, tableId } = req.query;
                const filters = {};
                if (status) {
                    filters.status = status;
                }
                if (tableId) {
                    filters.tableId = tableId;
                }
                const orders = await Order_1.default.find(filters).sort({ createdAt: -1 });
                res.json(orders);
            }
            catch (error) {
                console.error('Error fetching orders:', error);
                res.status(500).json({ error: 'Failed to fetch orders' });
            }
        };
    }
}
exports.default = new OrdersController();
