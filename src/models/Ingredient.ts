import mongoose from 'mongoose';

interface IIngredient extends mongoose.Document {
  name: string;
  nameEn?: string;
  category: string;
  stock: number;
  unit: string;
  minStockLevel: number;
  supplier?: string;
  costPerUnit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new mongoose.Schema<IIngredient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'lb', 'oz', 'liter', 'ml', 'piece', 'pack', 'box']
  },
  minStockLevel: {
    type: Number,
    required: true,
    default: 0
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IIngredient>('Ingredient', ingredientSchema);