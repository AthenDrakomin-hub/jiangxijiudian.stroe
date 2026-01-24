import mongoose from 'mongoose';

export interface IPayment extends mongoose.Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  method: 'cash' | 'card' | 'mobile' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  method: {
    type: String,
    enum: ['cash', 'card', 'mobile', 'online'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // 允许空值，但非空值必须唯一
  },
  paidAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// 索引优化
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ status: 1 });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;