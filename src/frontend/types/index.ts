// 导入统一的核心数据库类型
export * from './database.types';

// 保留原有类型定义以保证向后兼容
export type Language = 'zh' | 'en';

export enum OrderStatus { 
  pending = 'pending', 
  confirmed = 'confirmed', 
  preparing = 'preparing', 
  ready = 'ready', 
  delivered = 'delivered', 
  completed = 'completed',   
  cancelled = 'cancelled',
  in_kitchen = 'in_kitchen'
}

export enum UserRole { 
  admin = 'admin', 
  manager = 'manager', 
  waiter = 'waiter', 
  kitchen = 'kitchen', 
  cashier = 'cashier',
  partner = 'partner',
  staff = 'staff',
  maintainer = 'maintainer',
  user = 'user'
}

export enum AppModule {
  DASHBOARD = 'dashboard',
  ROOMS = 'rooms',
  ORDERS = 'orders',
  DISHES = 'dishes',
  SUPPLY_CHAIN = 'supply_chain',    // 新增
  FINANCIAL_HUB = 'financial_hub',   // 新增
  IMAGES = 'images',                 // 新增
  USERS = 'users',
  SETTINGS = 'settings'
}

export interface CRUDPermissions {
  enabled: boolean;
  c: boolean; // 创建
  r: boolean; // 读取
  u: boolean; // 更新
  d: boolean; // 删除
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  nameEn?: string;              // 英文名称（可选）
  currency?: string;            // 货币类型（可选）
  currencySymbol?: string;      // 货币符号（可选）
  exchangeRate?: number;        // 汇率（可选）
  paymentType?: string;         // 支付类型（可选）
  sortOrder?: number;           // 排序（可选）
  description?: string;         // 描述（可选）
  descriptionEn?: string;       // 英文描述（可选）
  iconType?: string;            // 图标类型（可选）
  walletAddress?: string;       // 钱包地址（可选）
  qrUrl?: string;               // 二维码URL（可选）
  isActive?: boolean;           // 是否激活（可选）
}

export interface HotelRoom {
  id: string;
  roomNumber: string;
  tableName?: string;       // 桌台名称（可选）
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'; // 状态（与后端一致）
  capacity: number;
  partnerId?: string;      // 合伙人ID（可选）
  floor?: number;          // 楼层（可选）
  occupiedBy?: string;     // 占用者（可选）
}

export interface Dish { 
  id: string;
  _id?: string;
  name: string;
  nameEn?: string;
  price: number;
  description?: string;
  imageUrl?: string;
  image?: string;
  categoryId?: string;
  category?: string;
  partnerId?: string;      // 合伙人ID（可选）
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Room { 
  id: string;
  _id?: string;
  roomNumber: string;
  tableName?: string;       // 桌台名称（可选）
  capacity: number;         // 容量（必需）
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'; // 状态（必需，与后端一致）
  type?: string;
  floor?: number;
  partnerId?: string;      // 合伙人ID（可选）
  createdAt?: Date;
  updatedAt?: Date;
  occupiedBy?: string;     // 占用者（可选）
}

export interface Order { 
  id: string;
  _id?: string;
  tableId: string;        // 使用 tableId 而不是 roomId
  roomId?: string;        // 房间ID（可选）
  roomNumber?: string;    // 兼容旧字段
  customerName?: string;  // 客户姓名（可选）
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  partnerId?: string;     // 合伙人ID（可选）
}

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  partnerId?: string;      // 合伙人ID（可选）
  dishName?: string;       // 菜品名称（可选）
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;      // 密码字段（可选，在某些情况下可能不返回）
  role: 'admin' | 'staff' | 'partner'; // 更新为新的角色类型
  partnerId?: string;     // 合伙人ID（仅在角色为partner时必需）
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  modulePermissions?: Partial<Record<AppModule, CRUDPermissions>>; // 模块权限（可选）
}

export interface Category { 
  id: string;
  _id?: string;
  name: string;
  nameEn?: string;
  description?: string;
  level?: number;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Partner {
  id: string;
  _id?: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  status: 'active' | 'inactive' | 'pending';
  commissionRate?: number;
  notes?: string;
  defaultCommissionRate?: number;  // 默认抽成比例（可选）
  createdAt?: Date;
  updatedAt?: Date;
  ownerName?: string;              // 所有者姓名（可选）
  contact?: string;                // 联系方式（可选）
  authorizedCategories?: string[]; // 授权分类（可选）
  totalSales?: number;             // 总销售额（可选）
  balance?: number;                // 余额（可选）
  joinedAt?: Date;                 // 加入时间（可选）
}

export interface Expense {
  id: string;
  _id?: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Ingredient {
  id: string;
  _id?: string;
  name: string;
  nameEn?: string;
  category: string;
  stock: number;
  unit: string;
  minStockLevel: number;
  lastRestocked?: Date;      // 最后补货时间（可选）
  supplier?: string;
  costPerUnit: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  minStock?: number;         // 最低库存（可选）
}

export interface SystemConfig {
  id: string;
  _id?: string;
  key: string;
  value: any;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  theme?: string;              // 主题（可选）
  fontFamily?: string;         // 字体家族（可选）
  autoPrintOrder?: boolean;    // 自动打印订单（可选）
}

export type NotificationType = 'NEW_ORDER' | 'ORDER_UPDATE' | 'info' | 'success' | 'warning' | 'error' | 'DELIVERY_UPDATE';

// S3 文件接口定义
export interface S3File {
  id: string;
  key: string;                     // 文件键
  name: string;                    // 文件名
  size: number;                    // 文件大小
  url: string;                     // 文件URL
  type: string;                    // 文件类型
  lastModified?: Date;             // 最后修改时间
  uploadedAt: Date;                // 上传时间
  thumbnailUrl?: string;           // 缩略图URL
  metadata?: Record<string, any>;  // 元数据
}

// API 接口类型定义
export interface ApiInterface {
  dishes: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  orders: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    updateStatus: (id: string, status: string) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  categories: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
    saveAll: (data: any[]) => Promise<any>;
  };
  rooms: {
    getAll: () => Promise<any>;
    getByNumber: (roomNumber: string) => Promise<any>;
  };
  staff: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  inventory: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  payments: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    toggle: (id: string) => Promise<any>;
  };
  finance: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
  };
  supplyChain: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  partners: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  config: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  ingredients: {
    getAll: () => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  archive: {
    importData: (file: any) => Promise<any>;
    exportData: () => Promise<any>;
  };
  registration: {
    getAll: () => Promise<any>;
    submit: (data: any) => Promise<any>;
    verify: (token: string) => Promise<any>;
    approve: (id: string) => Promise<any>;
    reject: (id: string) => Promise<any>;
  };
  translations: {
    getAll: () => Promise<any>;
    update: (data: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
}