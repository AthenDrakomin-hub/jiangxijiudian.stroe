// Dish-related types
export interface Dish {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order-related types
export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  _id?: string;
  tableNumber: string;
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
  servedBy?: string;
  specialRequests?: string;
}

// Room/Table-related types
export interface Room {
  _id?: string;
  roomNumber: string;
  tableName: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  occupiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User-related types
export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff' | 'customer';
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Category types
export interface Category {
  _id?: string;
  name: string;
  description?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Order status update payload
export interface OrderStatusUpdate {
  orderId: string;
  status: Order['status'];
  note?: string;
}

// Payment-related types
export interface Payment {
  _id?: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'mobile' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: Date;
  createdAt?: Date;
}

// Menu-related types
export interface Menu {
  _id?: string;
  name: string;
  sections: MenuSection[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuSection {
  _id?: string;
  name: string;
  dishes: string[]; // Array of dish IDs
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Notification types
export interface Notification {
  _id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  userId?: string; // If notification is for specific user
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// System configuration types
export interface SystemConfig {
  _id?: string;
  key: string;
  value: string | number | boolean | object;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}