import { Request, Response } from 'express';
import Room from '../models/Room';
import Dish from '../models/Dish';
import Order from '../models/Order';
import mongoose from 'mongoose';

class CustomerController {
  // 获取房间信息（无需认证）
  public getRoomInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomNumber } = req.params;
      
      if (!roomNumber) {
        res.status(400).json({ error: '房间号不能为空' });
        return;
      }

      const room = await Room.findOne({ roomNumber });
      
      if (!room) {
        res.status(404).json({ error: '房间不存在' });
        return;
      }
      
      res.json({
        roomNumber: room.roomNumber,
        tableName: room.tableName,
        capacity: room.capacity,
        status: room.status
      });
    } catch (error) {
      console.error('获取房间信息失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  };

  // 获取所有上架菜品（无需认证）
  public getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
      const dishes = await Dish.find({ isAvailable: true }).select('-__v');
      
      // 按分类组织菜品
      const categories: Record<string, any[]> = {};
      dishes.forEach(dish => {
        const category = dish.category || '其他';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push({
          id: dish._id,
          name: dish.name,
          nameEn: dish.nameEn,
          description: dish.description,
          price: dish.price,
          category: dish.category,
          image: dish.image
        });
      });
      
      res.json({
        categories: Object.keys(categories),
        menu: categories
      });
    } catch (error) {
      console.error('获取菜单失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  };

  // 创建订单（无需认证，基于房间号）
  public createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomNumber, items, note, paymentMethod } = req.body;
      
      // 验证必需字段
      if (!roomNumber || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: '房间号和菜品信息不能为空' });
        return;
      }

      // 验证房间是否存在
      const room = await Room.findOne({ roomNumber });
      if (!room) {
        res.status(404).json({ error: '房间不存在' });
        return;
      }

      // 验证菜品
      let totalAmount = 0;
      const orderItems: any[] = [];
      
      for (const item of items) {
        const dish = await Dish.findById(item.dishId);
        if (!dish || !dish.isAvailable) {
          res.status(400).json({ error: `菜品 ${item.dishId} 不存在或已下架` });
          return;
        }
        
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = dish.price * quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          dishId: dish._id,
          name: dish.name,
          price: dish.price,
          quantity: quantity
        });
      }

      // 创建订单
      const order = new Order({
        tableId: `TABLE_${roomNumber}`,
        roomNumber,
        items: orderItems,
        totalAmount,
        status: 'pending',
        note: note || '',
        paymentMethod: paymentMethod || 'mobile'
      });

      const savedOrder = await order.save();
      
      // 更新房间状态为占用
      await Room.findByIdAndUpdate(room._id, { 
        status: 'occupied',
        occupiedBy: savedOrder._id.toString()
      });
      
      res.status(201).json({
        message: '订单创建成功',
        orderId: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status
      });
    } catch (error) {
      console.error('创建订单失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  };

  // 查询订单状态（无需认证，基于房间号）
  public getOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.params;
      
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(400).json({ error: '订单ID格式不正确' });
        return;
      }

      const order = await Order.findById(orderId);
      
      if (!order) {
        res.status(404).json({ error: '订单不存在' });
        return;
      }
      
      res.json({
        orderId: order._id,
        roomNumber: order.roomNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        preparingAt: order.preparingAt,
        readyAt: order.readyAt,
        deliveredAt: order.deliveredAt
      });
    } catch (error) {
      console.error('查询订单状态失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  };

  // 获取房间的当前订单
  public getRoomOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomNumber } = req.params;
      
      if (!roomNumber) {
        res.status(400).json({ error: '房间号不能为空' });
        return;
      }

      // 查找房间
      const room = await Room.findOne({ roomNumber });
      if (!room) {
        res.status(404).json({ error: '房间不存在' });
        return;
      }

      // 查找该房间的订单（最近的几个）
      const orders = await Order.find({ roomNumber })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('-__v');
      
      res.json({
        roomNumber,
        tableName: room.tableName,
        currentStatus: room.status,
        orders: orders.map(order => ({
          orderId: order._id,
          status: order.status,
          totalAmount: order.totalAmount,
          itemsCount: order.items.length,
          createdAt: order.createdAt
        }))
      });
    } catch (error) {
      console.error('获取房间订单失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  };
}

export default new CustomerController();