import mongoose from 'mongoose';
import { IDish } from './Dish';

export interface IOrderItem {
  dishId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends mongoose.Document {
  tableId: string;
  roomNumber?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: string;
  preparingAt?: Date;
  readyAt?: Date;
  deliveredAt?: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>({
  tableId: {
    type: String,
    required: true,
    trim: true,
  },
  roomNumber: {
    type: String,
    trim: true,
  },
  items: [{
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  note: {
    type: String,
    trim: true,
  },
  paymentMethod: {
    type: String,
    trim: true,
  },
  preparingAt: {
    type: Date,
  },
  readyAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// 中间件：在保存前计算总价
OrderSchema.pre('save', function(next) {
  let total = 0;
  for (const item of this.items) {
    total += item.price * item.quantity;
  }
  this.totalAmount = total;
  next();
});

// 静态方法：验证状态转换是否合法
OrderSchema.statics.isValidStatusTransition = function(
  currentStatus: string, 
  newStatus: string
): boolean {
  // 定义合法的状态流转
  const validTransitions: { [key: string]: string[] } = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['delivered'],
    delivered: [],
    cancelled: [] // 已取消的订单不能再改变状态
  };

  const allowedTransitions = validTransitions[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

// 中间件：验证状态变更和更新时间戳
OrderSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate() as any;
  
  if (update.$set && update.$set.status) {
    // 获取当前文档
    const query = this.getQuery();
    const doc = await this.model.findOne(query).exec();
    if (doc) {
      const currentStatus = doc.status;
      const newStatus = update.$set.status;
      
      // 验证状态转换是否合法
      const OrderModel = this.model as mongoose.Model<IOrder>;
      if (!(OrderModel as any).isValidStatusTransition(currentStatus, newStatus)) {
        const error = new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        return next(error);
      }
      
      // 根据状态更新相应的时间戳
      const now = new Date();
      if (newStatus === 'preparing' && currentStatus !== 'preparing') {
        update.$set.preparingAt = now;
      } else if (newStatus === 'ready' && currentStatus !== 'ready') {
        update.$set.readyAt = now;
      } else if (newStatus === 'delivered' && currentStatus !== 'delivered') {
        update.$set.deliveredAt = now;
      }
    }
  }
  
  next();
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;