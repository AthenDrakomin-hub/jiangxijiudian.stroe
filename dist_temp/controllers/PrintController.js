"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printOrder = void 0;
const node_thermal_printer_1 = require("node-thermal-printer");
const Order_1 = __importDefault(require("../models/Order"));
const printer = new node_thermal_printer_1.printer({
    type: node_thermal_printer_1.PrinterTypes.EPSON,
    interface: '/dev/usb/lp0', // 默认USB接口，可根据实际情况修改
});
const printOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            res.status(404).json({
                success: false,
                message: '订单未找到'
            });
            return;
        }
        // 初始化打印机
        // 不需要显式初始化，直接开始打印命令
        // 打印标题
        printer.alignCenter();
        printer.println('江西云厨智能点餐系统');
        printer.println('厨房订单');
        printer.drawLine();
        // 订单信息
        printer.alignLeft();
        // 将 ObjectId 转换为字符串并获取最后6位
        const orderIdStr = order._id.toString();
        printer.println(`订单号: ${orderIdStr.substring(orderIdStr.length - 6)}`);
        printer.println(`房号: ${order.roomNumber}`);
        printer.println(`下单时间: ${new Date(order.createdAt).toLocaleString()}`);
        printer.drawLine();
        // 菜品列表
        order.items.forEach((item) => {
            printer.println(`${item.name} x${item.quantity}`);
            // 使用 note 字段作为备注
            if (order.note) {
                printer.println(`  备注: ${order.note}`);
            }
        });
        printer.drawLine();
        printer.println(`总计: ¥${order.totalAmount.toFixed(2)}`);
        // 打印并切纸
        printer.cut();
        await printer.execute();
        res.json({
            success: true,
            message: '打印成功'
        });
    }
    catch (error) {
        console.error('打印失败:', error);
        res.status(500).json({
            success: false,
            message: '打印失败',
            error: error.message
        });
    }
};
exports.printOrder = printOrder;
exports.default = {
    printOrder: exports.printOrder
};
