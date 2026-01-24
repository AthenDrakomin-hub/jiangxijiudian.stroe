import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;        // 与前端接口一致
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'partner';
  partnerId?: string;
  phone?: string;
  avatar?: string;
  defaultLang: string;
  modulePermissions: Record<string, boolean>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'partner'],
    required: true,
    default: 'staff',
  },
  partnerId: {
    type: String,
    ref: 'Partner',
    required: function() {
      return this.role === 'partner';
    },
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, '请输入有效的电话号码'],
  },
  avatar: {
    type: String,
    trim: true,
  },
  defaultLang: {
    type: String,
    default: 'zh',
  },
  modulePermissions: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// 在保存前对密码进行哈希处理的中间件
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// 比较密码的方法
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;