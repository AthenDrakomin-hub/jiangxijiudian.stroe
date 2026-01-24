import mongoose from 'mongoose';

export interface IMenuSection extends mongoose.Document {
  name: string;
  dishes: mongoose.Types.ObjectId[];
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMenu extends mongoose.Document {
  name: string;
  sections: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuSectionSchema = new mongoose.Schema<IMenuSection>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  }],
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const MenuSchema = new mongoose.Schema<IMenu>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuSection',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// 索引优化
MenuSchema.index({ isActive: 1 });
MenuSchema.index({ name: 1 });

MenuSectionSchema.index({ name: 1 });

const Menu = mongoose.model<IMenu>('Menu', MenuSchema);
const MenuSection = mongoose.model<IMenuSection>('MenuSection', MenuSectionSchema);

export { Menu, MenuSection };