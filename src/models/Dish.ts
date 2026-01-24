import mongoose from 'mongoose';

export interface IDish extends mongoose.Document {
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  category?: string;
  categoryId?: string;
  isAvailable: boolean;
  isRecommended?: boolean;
  tags?: string[];
  stock?: number;
  partnerId?: string;
  image?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema = new mongoose.Schema<IDish>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nameEn: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: false, // 改为可选
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    trim: true,
  },
  categoryId: {
    type: String,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isRecommended: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 999,
  },
  partnerId: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Dish = mongoose.model<IDish>('Dish', DishSchema);

export default Dish;