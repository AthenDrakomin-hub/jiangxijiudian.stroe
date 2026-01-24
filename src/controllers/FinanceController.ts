import { Request, Response } from 'express';
import Order from '../models/Order'; // 使用订单模型获取财务数据

class FinanceController {
  public getAllFinanceRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, type } = req.query;
      const filters: any = {};

      if (startDate && endDate) {
        filters.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        };
      }

      let orders;
      if (type === 'daily') {
        // 按天汇总
        orders = await Order.aggregate([
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
      } else {
        // 所有订单记录
        orders = await Order.find({
          ...filters,
          status: { $in: ['delivered', 'confirmed'] }
        }).sort({ createdAt: -1 });
      }

      res.json(orders);
    } catch (error) {
      console.error('Error fetching finance records:', error);
      res.status(500).json({ error: 'Failed to fetch finance records' });
    }
  };

  public getFinanceRecordById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const order = await Order.findById(id);
      
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
    } catch (error) {
      console.error('Error fetching finance record:', error);
      res.status(500).json({ error: 'Failed to fetch finance record' });
    }
  };

  public createFinanceRecord = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
      console.error('Error creating finance record:', error);
      res.status(500).json({ error: 'Failed to create finance record' });
    }
  };

  public updateFinanceRecord = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
      console.error('Error updating finance record:', error);
      res.status(500).json({ error: 'Failed to update finance record' });
    }
  };

  public deleteFinanceRecord = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      // 出于财务审计需要，通常不允许删除财务记录
      res.json({ message: 'Finance records cannot be deleted for audit compliance' });
    } catch (error) {
      console.error('Error deleting finance record:', error);
      res.status(500).json({ error: 'Failed to delete finance record' });
    }
  };
}

export default new FinanceController();