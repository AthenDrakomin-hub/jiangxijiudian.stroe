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
RoomSchema.index({ roomNumber: 1 });
RoomSchema.index({ status: 1 });

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;