import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
  nameEn?: string;
  description?: string;
  level?: number;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nameEn: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  parentId: {
    type: String,
    default: null,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', categorySchema);