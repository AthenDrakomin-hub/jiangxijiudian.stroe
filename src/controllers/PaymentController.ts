import { Request, Response } from 'express';
import Order from '../models/Order'; // 假设我们使用订单模型存储支付信息

class PaymentController {
  public getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      // 从订单中获取支付相关信息
      const payments = await Order.find({}, {
        roomNumber: 1,
        totalAmount: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1
      }).sort({ createdAt: -1 });
      
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  };

  public getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const order = await Order.findById(id);
      
      if (!order) {
        res.status(404).json({ error: 'Payment not found' });
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
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  };

  public createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, amount, method, status } = req.body;

      // 在实际应用中，这里应该创建专门的支付记录
      // 现在我们简单返回一个模拟的支付记录
      const payment = {
        orderId,
        amount,
        method: method || 'unknown',
        status: status || 'completed',
        transactionId: `txn_${Date.now()}`,
        createdAt: new Date()
      };

      res.status(201).json(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  };

  public updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { status, method } = req.body;

      // 在实际应用中，这里应该更新支付记录
      // 现在我们简单返回一个模拟的响应
      const payment = {
        id,
        status: status || 'completed',
        method: method || 'unknown',
        updatedAt: new Date()
      };

      res.json(payment);
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  };

  public deletePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      // 在实际应用中，这里应该删除支付记录
      // 出于安全考虑，通常不真正删除支付记录
      res.json({ message: 'Payment record cannot be deleted for security and compliance reasons' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  };
}

export default new PaymentController();