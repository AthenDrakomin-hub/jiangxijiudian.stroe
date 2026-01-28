import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// 定义用户TS接口（与MongoDB集合结构强一致，类型约束）
export interface IUser extends Document {
  email: string;
  password: string; // 存储bcrypt密文，非明文
  name: string;
  isActive: boolean; // 用户状态，默认启用
  role?: string; // 用户角色：admin, staff, partner等
  phone?: string; // 电话号码
  defaultLang?: string; // 默认语言
  modulePermissions?: {
    dashboard: boolean;
    rooms: boolean;
    orders: boolean;
    dishes: boolean;
    supply_chain: boolean;
    financial_hub: boolean;
    images: boolean;
    users: boolean;
    settings: boolean;
    categories: boolean;
    inventory: boolean;
    payments: boolean;
  }; // 模块权限
  partnerId?: string; // 合伙人ID
  createdAt: Date;
  updatedAt: Date;
  // 可选：后续扩展字段（如phone/avatar等）
}

// Mongoose Schema（与TS接口IUser完全匹配，添加验证规则）
const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true, // 统一转小写，避免查询时大小写问题
    trim: true
  },
  password: {
    type: String,
    required: [true, '密码不能为空']
  },
  name: {
    type: String,
    required: [true, '姓名不能为空'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true, // 默认启用用户
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // 不可修改
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'partner'], // 定义允许的角色值
    default: 'staff',
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  defaultLang: {
    type: String,
    default: 'zh',
    required: false
  },
  modulePermissions: {
    dashboard: { type: Boolean, default: false },
    rooms: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    dishes: { type: Boolean, default: false },
    supply_chain: { type: Boolean, default: false },
    financial_hub: { type: Boolean, default: false },
    images: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false },
    payments: { type: Boolean, default: false },
  },
  partnerId: {
    type: String,
    required: false
  }
}, {
  timestamps: false, // 关闭自动时间戳，手动维护createdAt/updatedAt
  collection: 'users' // 显式指定MongoDB集合名，避免Mongoose自动复数化
});

// 在保存前对密码进行哈希处理的中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// 比较密码的方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 生成并导出用户模型
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;