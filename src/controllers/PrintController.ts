import { Request, Response } from 'express';
import { Printer, capabilities } from 'node-thermal-printer';
import Order from '../models/Order';

const printer = new Printer({
  type: capabilities.Epson,
  interface: '/dev/usb/lp0', // 默认USB接口，可根据实际情况修改
});

export const printOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: '订单未找到' 
      });
    }

    // 初始化打印机
    await printer.init();

    // 打印标题
    printer.align('center');
    printer.setText('江西云厨智能点餐系统\n');
    printer.setText('厨房订单\n');
    printer.setText('================================\n');

    // 订单信息
    printer.align('left');
    printer.setText(`订单号: ${order._id.toString().substring(order._id.length - 6)}\n`);
    printer.setText(`房号: ${order.roomNumber}\n`);
    printer.setText(`下单时间: ${new Date(order.createdAt).toLocaleString()}\n`);
    printer.setText('================================\n');

    // 菜品列表
    order.items.forEach(item => {
      printer.setText(`${item.name} x${item.quantity}\n`);
      // 使用 note 字段作为备注
      if (order.note) {
        printer.setText(`  备注: ${order.note}\n`);
      }
    });

    printer.setText('================================\n');
    printer.setText(`总计: ¥${order.totalAmount.toFixed(2)}\n`);
    
    // 打印并切纸
    printer.cut();
    await printer.execute();

    res.json({ 
      success: true, 
      message: '打印成功' 
    });
  } catch (error) {
    console.error('打印失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '打印失败', 
      error: (error as Error).message 
    });
  }
};

export default {
  printOrder
};