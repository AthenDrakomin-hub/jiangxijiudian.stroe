export const API_BASE_URL = '/api';
export const WS_BASE_URL = 'ws://localhost:4000';
export const APP_NAME = 'Jiangyun Chef';
export const VERSION = '1.0.0';

export const PERMISSIONS = {
  READ_ORDERS: 'read_orders',
  WRITE_ORDERS: 'write_orders',
  READ_USERS: 'read_users',
  WRITE_USERS: 'write_users',
  READ_FINANCIAL: 'read_financial',
  WRITE_FINANCIAL: 'write_financial',
};

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  PARTNER: 'partner',
  CUSTOMER: 'customer',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};