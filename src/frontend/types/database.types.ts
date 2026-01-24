// 统一的核心数据库类型定义 - 强制对齐MongoDB后端

export type Language = 'zh' | 'en';

// 用户角色枚举 - 对齐后端要求
export enum UserRole {
  ADMIN = 'admin', STAFF = 'staff', PARTNER = 'partner',
  MANAGER = 'manager', WAITER = 'waiter', KITCHEN = 'kitchen',
  CASHIER = 'cashier', MAINTAINER = 'maintainer', USER = 'user'
}

// 订单状态枚举 - 对齐后端要求，包含前端组件使用的值
export enum OrderStatus {
  PENDING = 'pending', PREPARING = 'preparing', READY = 'ready',
  DELIVERED = 'delivered', COMPLETED = 'completed', CANCELLED = 'cancelled'
}

// 菜品接口 - 强制对齐MongoDB字段，包含前端组件需要的所有字段
export interface Dish {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  category?: string;
  categoryId?: string;
  isAvailable: boolean;
  isRecommended?: boolean;
  tags?: string[];
  image?: string;
  imageUrl?: string;
  stock?: number;
  partnerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 分类接口 - 强制对齐MongoDB字段
export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  code?: string;
  description?: string;
  parentId: string | null;
  level: number;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 订单项接口
export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

// 订单接口 - 强制对齐MongoDB字段
export interface Order {
  id: string;
  tableId: string;
  roomNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: string;
}

// 房间接口
export interface Room {
  id: string;
  roomNumber: string;
  tableName: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'ordering';
  occupiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户接口
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  partnerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  modulePermissions?: any;
}

// 合作伙伴接口
export interface Partner {
  id: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  commissionRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 支付接口
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 系统配置接口
export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 费用接口
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 原料接口
export interface Ingredient {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  minStockLevel: number;
  costPerUnit: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  supplier?: string;
}

// 通知接口
export interface Notification {
  id: string;
  type: 'NEW_ORDER' | 'ORDER_UPDATE' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}