import axios from 'axios';
import { Dish, Order, Category, Ingredient, Room, User, Partner, Payment, SystemConfig, Expense, Notification, OrderStatus } from './database.types';

// 基础配置
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4000/api';

// 创建基础 axios 实例
const baseApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 请求拦截器
baseApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 数据处理辅助函数 - 将MongoDB的_id映射为前端需要的id
const mapMongoId = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: item._id || item.id,
      _id: item._id || item.id
    }));
  }
  
  return {
    ...data,
    id: data._id || data.id,
    _id: data._id || data.id
  };
};

// 兜底函数 - 确保API调用不会导致前端崩溃
const safeApiCall = async <T>(apiCall: Promise<any>, defaultValue: T): Promise<T> => {
  try {
    const response = await apiCall;
    return mapMongoId(response.data || response) as T;
  } catch (error) {
    console.warn('API调用失败，返回默认值:', error);
    return defaultValue;
  }
};

// 核心API模块 - 确保所有必需功能都有兜底
export const api = {
  // 菜品API - 核心功能
  dishes: {
    getAll: (): Promise<Dish[]> => safeApiCall(
      baseApi.get('/dishes'),
      []
    ),
    getById: (id: string): Promise<Dish | null> => safeApiCall(
      baseApi.get(`/dishes/${id}`),
      null
    ),
    create: (data: Partial<Dish>): Promise<Dish> => safeApiCall(
      baseApi.post('/dishes', data),
      { ...data, id: Date.now().toString() } as Dish
    ),
    update: (id: string, data: Partial<Dish>): Promise<Dish> => safeApiCall(
      baseApi.put(`/dishes/${id}`, data),
      { ...data, id } as Dish
    ),
    delete: (id: string): Promise<void> => safeApiCall(
      baseApi.delete(`/dishes/${id}`),
      undefined
    )
  },

  // 订单API - 核心功能
  orders: {
    getAll: (): Promise<Order[]> => safeApiCall(
      baseApi.get('/orders'),
      []
    ),
    getById: (id: string): Promise<Order | null> => safeApiCall(
      baseApi.get(`/orders/${id}`),
      null
    ),
    create: (data: Partial<Order>): Promise<Order> => safeApiCall(
      baseApi.post('/orders', data),
      { ...data, id: Date.now().toString(), status: OrderStatus.pending } as Order
    ),
    updateStatus: (id: string, status: OrderStatus): Promise<Order> => safeApiCall(
      baseApi.patch(`/orders/${id}/status`, { status }),
      { id, status } as Order
    ),
    update: (id: string, data: Partial<Order>): Promise<Order> => safeApiCall(
      baseApi.put(`/orders/${id}`, data),
      { ...data, id } as Order
    ),
    delete: (id: string): Promise<void> => safeApiCall(
      baseApi.delete(`/orders/${id}`),
      undefined
    )
  },

  // 分类API - 核心功能
  categories: {
    getAll: (): Promise<Category[]> => safeApiCall(
      baseApi.get('/admin/categories'),
      []
    ),
    getById: (id: string): Promise<Category | null> => safeApiCall(
      baseApi.get(`/admin/categories/${id}`),
      null
    ),
    create: (data: Partial<Category>): Promise<Category> => safeApiCall(
      baseApi.post('/admin/categories', data),
      { ...data, id: Date.now().toString(), level: 1, displayOrder: 0, isActive: true } as Category
    ),
    update: (id: string, data: Partial<Category>): Promise<Category> => safeApiCall(
      baseApi.put(`/admin/categories/${id}`, data),
      { ...data, id } as Category
    ),
    delete: (id: string): Promise<void> => safeApiCall(
      baseApi.delete(`/admin/categories/${id}`),
      undefined
    ),
    saveAll: (data: Category[]): Promise<Category[]> => safeApiCall(
      baseApi.post('/admin/categories/bulk', data),
      data
    )
  },

  // 房间API
  rooms: {
    getAll: (): Promise<Room[]> => safeApiCall(
      baseApi.get('/rooms'),
      []
    ),
    getByNumber: (roomNumber: string): Promise<Room | null> => safeApiCall(
      baseApi.get(`/rooms/${roomNumber}`),
      null
    )
  },

  // 原料API - 如果未实现返回空数组
  ingredients: {
    getAll: (): Promise<Ingredient[]> => safeApiCall(
      baseApi.get('/admin/ingredients'),
      []
    ),
    getById: (id: string): Promise<Ingredient | null> => safeApiCall(
      baseApi.get(`/admin/ingredients/${id}`),
      null
    ),
    create: (data: Partial<Ingredient>): Promise<Ingredient> => safeApiCall(
      baseApi.post('/admin/ingredients', data),
      { ...data, id: Date.now().toString(), isActive: true } as Ingredient
    ),
    update: (id: string, data: Partial<Ingredient>): Promise<Ingredient> => safeApiCall(
      baseApi.put(`/admin/ingredients/${id}`, data),
      { ...data, id } as Ingredient
    ),
    delete: (id: string): Promise<void> => safeApiCall(
      baseApi.delete(`/admin/ingredients/${id}`),
      undefined
    )
  },

  // 注册API - 如果未实现返回空数组
  registration: {
    getAll: (): Promise<any[]> => safeApiCall(
      baseApi.get('/admin/registration'),
      []
    ),
    submit: (data: any): Promise<any> => safeApiCall(
      baseApi.post('/admin/registration', data),
      { ...data, id: Date.now().toString() }
    ),
    verify: (token: string): Promise<any> => safeApiCall(
      baseApi.get(`/admin/registration/verify/${token}`),
      null
    ),
    approve: (id: string): Promise<any> => safeApiCall(
      baseApi.patch(`/admin/registration/approve/${id}`, { status: 'approved' }),
      { id, status: 'approved' }
    ),
    reject: (id: string): Promise<any> => safeApiCall(
      baseApi.patch(`/admin/registration/reject/${id}`, { status: 'rejected' }),
      { id, status: 'rejected' }
    )
  },

  // 合作伙伴API - 如果未实现返回空数组
  partners: {
    getAll: (): Promise<Partner[]> => safeApiCall(
      baseApi.get('/admin/partners'),
      []
    ),
    getById: (id: string): Promise<Partner | null> => safeApiCall(
      baseApi.get(`/admin/partners/${id}`),
      null
    ),
    create: (data: Partial<Partner>): Promise<Partner> => safeApiCall(
      baseApi.post('/admin/partners', data),
      { ...data, id: Date.now().toString(), status: 'active' } as Partner
    ),
    update: (id: string, data: Partial<Partner>): Promise<Partner> => safeApiCall(
      baseApi.put(`/admin/partners/${id}`, data),
      { ...data, id } as Partner
    ),
    delete: (id: string): Promise<void> => safeApiCall(
      baseApi.delete(`/admin/partners/${id}`),
      undefined
    )
  },

  // 支付API - 如果未实现返回空数组
  payments: {
    getAll: (): Promise<Payment[]> => safeApiCall(
      baseApi.get('/admin/payments'),
      []
    ),
    getById: (id: string): Promise<Payment | null> => safeApiCall(
      baseApi.get(`/admin/payments/${id}`),
      null
    ),
    create: (data: Partial<Payment>): Promise<Payment> => safeApiCall(
      baseApi.post('/admin/payments', data),
      { ...data, id: Date.now().toString(), status: 'pending' } as Payment
    ),
    update: (id: string, data: Partial<Payment>): Promise<Payment> => safeApiCall(
      baseApi.put(`/admin/payments/${id}`, data),
      { ...data, id } as Payment
    ),
    toggle: (id: string): Promise<Payment> => safeApiCall(
      baseApi.patch(`/admin/payments/${id}/toggle`),
      { id } as Payment
    )
  },

  // 配置API - 如果未实现返回空数组
  config: {
    getAll: (): Promise<SystemConfig[]> => safeApiCall(
      baseApi.get('/admin/config'),
      []
    ),
    getById: (id: string): Promise<SystemConfig | null> => safeApiCall(
      baseApi.get(`/admin/config/${id}`),
      null
    ),
    create: (data: Partial<SystemConfig>): Promise<SystemConfig> => safeApiCall(
      baseApi.post('/admin/config', data),
      { ...data, id: Date.now().toString() } as SystemConfig
    ),
    update: (id: string, data: Partial<SystemConfig>): Promise<SystemConfig> => safeApiCall(
      baseApi.put(`/admin/config/${id}`, data),
      { ...data, id } as SystemConfig
    ),
    delete: (id: string): Promise<void> => safeApiCall(
      baseApi.delete(`/admin/config/${id}`),
      undefined
    )
  }
};

export default baseApi;