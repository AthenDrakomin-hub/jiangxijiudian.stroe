import axios from 'axios';

// 基础配置
// 在生产环境中使用相对路径，开发环境中使用代理
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 
                (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:4000/api');

// 创建基础 axios 实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

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

// WebSocket connection for real-time updates
let ws: WebSocket | null = null;
const wsListeners: ((data: any) => void)[] = [];

const connectWebSocket = (onMessage: (data: any) => void) => {
  if (ws) {
    ws.close();
  }
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.hostname}:${window.location.port || 4000}`;
  
  ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
      wsListeners.forEach(listener => listener(data));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Attempt to reconnect after 3 seconds
    setTimeout(() => connectWebSocket(onMessage), 3000);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return ws;
};

// Subscribe to WebSocket messages
const subscribeToWebSocket = (listener: (data: any) => void) => {
  wsListeners.push(listener);
  return () => {
    const index = wsListeners.indexOf(listener);
    if (index > -1) {
      wsListeners.splice(index, 1);
    }
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

// 统一的API调用中枢
export const api = {
  dishes: { 
    getAll: () => safeApiCall(instance.get('/dishes'), []),
    create: (data: any) => safeApiCall(instance.post('/dishes', data), { ...data, id: Date.now().toString() }),
    update: (id: string, data: any) => safeApiCall(instance.put(`/dishes/${id}`, data), { ...data, id }),
    delete: (id: string) => safeApiCall(instance.delete(`/dishes/${id}`), undefined),
  },
  orders: { 
    getAll: () => safeApiCall(instance.get('/orders'), []),
    create: (data: any) => safeApiCall(instance.post('/orders', data), { ...data, id: Date.now().toString() }),
    updateStatus: (id: string, status: string) => safeApiCall(instance.patch(`/orders/${id}/status`, { status }), { id, status }),
  },
  websocket: {
    connect: connectWebSocket,
    subscribe: subscribeToWebSocket,
  },
  payments: { 
    getAll: () => safeApiCall(instance.get('/admin/payments'), []), 
    create: (data: any) => safeApiCall(instance.post('/admin/payments', data), { ...data, id: Date.now().toString() }),
    update: (data: any) => safeApiCall(instance.put(`/admin/payments/${data.id}`, data), data),
    delete: (id: string) => safeApiCall(instance.delete(`/admin/payments/${id}`), undefined),
    toggle: (id: string) => safeApiCall(instance.patch(`/admin/payments/${id}/toggle`), { id }) 
  },
  config: { 
    get: () => safeApiCall(instance.get('/config'), {
      activeTheme: 'glass',
      themeSettings: {
        container: 'bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8',
        card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
        button: 'bg-slate-900 text-white rounded-xl px-6 py-3 font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg',
        text: 'text-slate-800'
      }
    })
  },
  registration: {
    getAll: () => safeApiCall(instance.get('/admin/registration'), []),
    submit: (data: any) => safeApiCall(instance.post('/admin/registration', data), { ...data, id: Date.now().toString() }),
    approve: (id: string) => safeApiCall(instance.patch(`/admin/registration/approve/${id}`, { status: 'approved' }), { id, status: 'approved' }),
    reject: (id: string) => safeApiCall(instance.patch(`/admin/registration/reject/${id}`, { status: 'rejected' }), { id, status: 'rejected' }),
  },
  ingredients: {
    getAll: () => safeApiCall(instance.get('/admin/ingredients'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/ingredients', data), { ...data, id: Date.now().toString() }),
    update: (id: string, data: any) => safeApiCall(instance.put(`/admin/ingredients/${id}`, data), { ...data, id }),
    delete: (id: string) => safeApiCall(instance.delete(`/admin/ingredients/${id}`), undefined),
  },
  partners: {
    getAll: () => safeApiCall(instance.get('/admin/partners'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/partners', data), { ...data, id: Date.now().toString() }),
  },
  categories: {
    getAll: () => safeApiCall(instance.get('/admin/categories'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/categories', data), { ...data, id: Date.now().toString() }),
    saveAll: (data: any) => safeApiCall(instance.post('/admin/categories/batch', data), data),
  },
  rooms: {
    getAll: () => safeApiCall(instance.get('/rooms'), []),
    getByNumber: (roomNumber: string) => safeApiCall(instance.get(`/rooms/${roomNumber}`), null),
  },
  staff: {
    getAll: () => safeApiCall(instance.get('/admin/staff'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/staff', data), { ...data, id: Date.now().toString() }),
  },
  inventory: {
    getAll: () => safeApiCall(instance.get('/admin/inventory'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/inventory', data), { ...data, id: Date.now().toString() }),
  },
  finance: {
    getAll: () => safeApiCall(instance.get('/admin/finance'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/finance', data), { ...data, id: Date.now().toString() }),
  },
  supplyChain: {
    getAll: () => safeApiCall(instance.get('/admin/supply-chain'), []),
    create: (data: any) => safeApiCall(instance.post('/admin/supply-chain', data), { ...data, id: Date.now().toString() }),
  },
  archive: {
    importData: (file: any) => safeApiCall(instance.post('/admin/archive/import', file), {}),
    exportData: () => safeApiCall(instance.get('/admin/archive/export'), {}),
  },
  users: {
    getAll: () => safeApiCall(instance.get('/users'), []),
    updatePermissions: (userId: string, data: any) => safeApiCall(instance.patch(`/users/${userId}/permissions`, data), { ...data, id: userId }),
  },
  translations: {
    getAll: () => safeApiCall(instance.get('/admin/translations'), []),
    update: (data: any) => safeApiCall(instance.put('/admin/translations', data), data),
  }
};

export default api;