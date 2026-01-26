import mongoose from 'mongoose';

export interface IRoom extends mongoose.Document {
  roomNumber: string;
  tableName: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  occupiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new mongoose.Schema<IRoom>({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tableName: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available',
  },
  occupiedBy: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// 索引优化
// roomNumber 的唯一索引由 unique: true 自动生成，无需手动添加
RoomSchema.index({ status: 1 });

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;