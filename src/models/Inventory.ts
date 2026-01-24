import mongoose from 'mongoose';

interface IInventory extends Document {
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  supplier?: string;
  costPerUnit: number;
  category?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new mongoose.Schema<IInventory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'lb', 'oz', 'liter', 'ml', 'piece', 'pack', 'box']
  },
  minStockLevel: {
    type: Number,
    default: 0,
    min: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IInventory>('Inventory', inventorySchema);