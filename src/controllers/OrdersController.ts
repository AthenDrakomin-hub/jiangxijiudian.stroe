import { Request, Response } from 'express';
import Order from '../models/Order';
import Dish from '../models/Dish';
import { broadcastToClients } from '../server';



class OrdersController {
  public createOrder = async (req: Request, res: Response): Promise<void> => {
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

        const dish = await Dish.findById(dishId);
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
      const order = new Order({
        tableId,
        roomNumber,
        items: orderItems,
        totalAmount,
        status: 'pending',
        note,
        paymentMethod
      });

      const savedOrder = await order.save();
      
      // 广播新订单创建
      broadcastToClients({
        type: 'NEW_ORDER',
        payload: {
          orderId: savedOrder._id,
          status: savedOrder.status,
          roomNumber: savedOrder.roomNumber,
          tableId: savedOrder.tableId,
          items: savedOrder.items,
          totalAmount: savedOrder.totalAmount,
          createdAt: savedOrder.createdAt
        }
      });
      
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  };

  public updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      // 验证状态值是否合法
      const validStatuses: Array<'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'> = 
        ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // 广播订单状态更新
      broadcastToClients({
        type: 'ORDER_STATUS_UPDATE',
        payload: {
          orderId: order._id,
          status: order.status,
          roomNumber: order.roomNumber,
          tableId: order.tableId,
          items: order.items,
          totalAmount: order.totalAmount
        }
      });

      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  };

  public getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      
      const order = await Order.findById(id);
      
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  };

  public getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, tableId } = req.query;
      const filters: any = {};

      if (status) {
        filters.status = status;
      }
      
      if (tableId) {
        filters.tableId = tableId;
      }

      const orders = await Order.find(filters).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  };
}

export default new OrdersController();