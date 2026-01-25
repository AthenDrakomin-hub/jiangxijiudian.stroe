import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from './utils/api';
import { Order, Dish, Room, Category, Expense, Partner, User, UserRole, SystemConfig } from './types';
import { Language } from './constants/translations';
import AdminLayout from './components/AdminLayout';
import OrderManagement from './components/OrderManagement';
import GuestOrderPage from './components/GuestOrderPage';
import MenuManagement from './components/MenuManagement';
import Dashboard from './components/Dashboard';
import RoomGrid from './components/RoomGrid';
import SupplyChainManager from './components/SupplyChainManager';
import ImageLibrary from './components/ImageLibrary';
import FinancialCenter from './components/FinancialCenter';
import StaffManagement from './components/StaffManagement';
import SystemSettings from './components/SystemSettings';
import CategoryManagement from './components/CategoryManagement';
import InventoryManagement from './components/InventoryManagement';
import PaymentManagement from './components/PaymentManagement';
import KitchenDisplaySystem from './components/KitchenDisplaySystem';
import LoginPage from './components/LoginPage';
import AuthGuard from './components/AuthGuard';

// 主应用组件
const AppContent = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('zh');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 获取系统配置（主题等）- 在最外层执行，不依赖登录状态
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await api.config.get();
        // 检查返回的数据结构，兼容不同的格式
        // 使用类型守卫来安全地访问属性
        if (configData && typeof configData === 'object') {
          // 检查是否已经是SystemConfig格式 (有key属性)
          if ('key' in configData && typeof configData.key === 'string') {
            setConfig(configData as unknown as SystemConfig);
          } else {
            // 如果是后端返回的简单格式，转换为SystemConfig格式
            const transformedConfig = {
              id: (configData as any).id || 'default-config',
              _id: (configData as any)._id,
              key: 'theme_config',
              value: {
                activeTheme: (configData as any).activeTheme || 'glass',
                themeSettings: (configData as any).themeSettings || {
                  container: 'bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8',
                  card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
                  button: 'bg-slate-900 text-white rounded-xl px-6 py-3 font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg',
                  text: 'text-slate-800'
                }
              },
              description: 'Theme configuration',
              createdAt: (configData as any).createdAt,
              updatedAt: (configData as any).updatedAt,
              theme: (configData as any).activeTheme || 'glass'
            } as unknown as SystemConfig;
            setConfig(transformedConfig);
          }
        } else {
          // 如果返回的数据不符合预期，使用默认值
          setConfig({
            id: 'default-config',
            key: 'theme_config',
            value: {
              activeTheme: 'glass',
              themeSettings: {
                container: 'bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8',
                card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
                button: 'bg-slate-900 text-white rounded-xl px-6 py-3 font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg',
                text: 'text-slate-800'
              }
            },
            description: 'Default theme configuration',
            theme: 'glass'
          });
        }
      } catch (error) {
        console.error('获取系统配置失败:', error);
        // 使用硬编码的默认主题配置作为fallback
        setConfig({
          id: 'default-config',
          key: 'theme_config',
          value: {
            activeTheme: 'glass',
            themeSettings: {
              container: 'bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8',
              card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
              button: 'bg-slate-900 text-white rounded-xl px-6 py-3 font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg',
              text: 'text-slate-800'
            }
          },
          description: 'Default theme configuration',
          theme: 'glass'
        });
      }
    };

    fetchConfig();
  }, []);

  // 检查本地存储中的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        
        // 获取用户的语言偏好
        const preferredLang = localStorage.getItem('preferredLanguage');
        if (preferredLang) {
          setLang(preferredLang as Language);
        }
      } catch (err) {
        console.error('解析用户信息失败:', err);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // 统一的数据刷新函数
  const refreshData = useCallback(async () => {
    setIsLoading(true);

    // 并行获取核心数据
    try {
      // 核心数据：菜品和房间信息
      const [dishesRes, roomsRes] = await Promise.allSettled([
        api.dishes.getAll(),
        api.rooms.getAll ? api.rooms.getAll() : [],
      ]);

      // 处理核心数据
      let processedDishes: Dish[] = [];
      let processedRooms: Room[] = [];

      if (dishesRes.status === 'fulfilled') {
        processedDishes = dishesRes.value.map((dish: any) => ({
          ...dish,
          id: dish._id || dish.id,
        }));
        setDishes(processedDishes);
      } else {
        console.warn("获取菜品数据失败:", dishesRes.reason);
        setDishes([]);
      }

      if (roomsRes.status === 'fulfilled') {
        processedRooms = roomsRes.value.map((room: any) => ({
          ...room,
          id: room._id || room.id,
          roomNumber: room.roomNumber || room.room_number || room.number,
        }));
        setRooms(processedRooms);
      } else {
        console.warn("获取房间数据失败:", roomsRes.reason);
        setRooms([]);
      }

      // 在核心数据加载完成后，先设置加载状态为 false，让核心功能先显示
      setIsLoading(false);

      // 然后异步加载其他数据，不阻塞核心功能
      try {
        // 使用独立的 Promise.allSettled calls 来确保每个 API 调用都有容错处理
        const ordersRes = await Promise.allSettled([api.orders.getAll()]);
        if (ordersRes[0].status === 'fulfilled') {
          const processedOrders = ordersRes[0].value.map((order: any) => ({
            ...order,
            id: order._id || order.id,
            // 确保使用 roomNumber 字段
            roomNumber: order.roomNumber || order.tableId || order.room_id,
            tableId: order.tableId || order.roomNumber || order.room_id,
          }));
          setOrders(processedOrders);
        } else {
          console.warn("获取订单数据失败:", ordersRes[0].reason);
          setOrders([]);
        }

        const categoriesRes = await Promise.allSettled([api.categories.getAll()]);
        if (categoriesRes[0].status === 'fulfilled') {
          const processedCategories = categoriesRes[0].value.map((category: any) => ({
            ...category,
            id: category._id || category.id,
          }));
          setCategories(processedCategories);
        } else {
          console.warn("获取分类数据失败:", categoriesRes[0].reason);
          setCategories([]);
        }

        // 设置默认值，因为这些 APIs 可能不存在
        setExpenses([]);
        setPartners([]);
        setUsers([]);
        // 保持已获取的配置不变
      } catch (additionalErr) {
        console.warn("加载附加数据时出错:", additionalErr);
      }
    } catch (err) {
      console.error("核心数据加载失败:", err);
      setIsLoading(false);
    }
  }, []);

  // 登录成功处理
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    
    // 根据角色设置默认语言
    const defaultLang = user.role === UserRole.admin ? 'zh' : 'en';
    setLang(defaultLang as Language);
    localStorage.setItem('preferredLanguage', defaultLang);
  };

  // 登出处理
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('preferredLanguage');
  };

  // 组件挂载时刷新数据
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // 应用主题配置类
  const themeSettings = config?.value?.themeSettings;
  const containerClass = themeSettings?.container || 'bg-gray-50 min-h-screen';
  const cardClass = themeSettings?.card || '';
  const buttonClass = themeSettings?.button || '';
  const textClass = themeSettings?.text || '';

  return (
    <div className={`${containerClass} ${cardClass ? '' : 'p-4'}`}>
      <Routes>
        {/* 根路径 - 管理后台入口，需要认证 */}
        <Route 
          path="/" 
          element={
            <AuthGuard currentUser={currentUser}>
              <Navigate to="/admin/dashboard" replace />
            </AuthGuard>
          } 
        />

        {/* 管理后台路由 - 需要认证 */}
        <Route 
          path="/admin/*" 
          element={
            <AuthGuard currentUser={currentUser}>
              <AdminLayoutWithSharedData 
                orders={orders}
                refreshData={refreshData}
                isLoading={isLoading}
                dishes={dishes}
                rooms={rooms}
                categories={categories}
                expenses={expenses}
                partners={partners}
                users={users}
                config={config}
                lang={lang}
                onLangChange={(newLang: Language) => setLang(newLang)}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </AuthGuard>
          } 
        />

        {/* 顾客点餐页面 - 公开访问，但需要room参数 */}
        <Route 
          path="/guest" 
          element={
            <GuestOrderPageWithData 
              dishes={dishes} 
              refreshData={refreshData}
              isLoading={isLoading}
            /> 
          } 
        />
        <Route 
          path="/guest/:room" 
          element={
            <GuestOrderPageWithData 
              dishes={dishes} 
              refreshData={refreshData}
              isLoading={isLoading}
            /> 
          } 
        />
        {/* 添加支持查询参数的路由 */}
        <Route 
          path="/table" 
          element={
            <GuestOrderPageWithData 
              dishes={dishes} 
              refreshData={refreshData}
              isLoading={isLoading}
            /> 
          } 
        />

        {/* 登录页面 - 完全公开访问 */}
        <Route 
          path="/login" 
          element={
            <LoginPage 
              onLoginSuccess={handleLoginSuccess}
              lang={lang}
            />
          } 
        />

        {/* 重定向所有其他路由到登录页面 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

// 带数据的客人点餐页面
const GuestOrderPageWithData: React.FC<{
  dishes: Dish[];
  refreshData: () => void;
  isLoading: boolean;
}> = ({ dishes, refreshData, isLoading }) => {
  // 从 URL 查询参数中获取 room 信息
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const roomFromUrl = urlParams.get('room');

  return (
    <GuestOrderPage 
      dishes={dishes} 
      refreshData={refreshData}
      isLoading={isLoading}
      room={roomFromUrl || undefined}
    />
  );
};

// 管理员布局组件（带共享数据）
const AdminLayoutWithSharedData: React.FC<{
  orders: Order[];
  refreshData: () => void;
  isLoading: boolean;
  dishes: Dish[];
  rooms: Room[];
  categories: Category[];
  expenses: Expense[];
  partners: Partner[];
  users: User[];
  config: SystemConfig | null;
  lang: Language;
  onLangChange?: (newLang: Language) => void;
  currentUser: User | null;
  onLogout: () => void;
}> = ({ 
  orders, 
  refreshData, 
  isLoading,
  dishes,
  rooms,
  categories,
  expenses,
  partners,
  users,
  config,
  lang,
  onLangChange,
  currentUser,
  onLogout
}) => {
  // 渲染管理员布局
  return (
    <AdminLayout
      orders={orders}
      refreshData={refreshData}
      isLoading={isLoading}
      dishes={dishes}
      rooms={rooms}
      categories={categories}
      expenses={expenses}
      partners={partners}
      users={users}
      config={config}
      lang={lang}
      onLangChange={onLangChange}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={
          <Dashboard 
            orders={orders || []}
            dishes={dishes || []}
            rooms={(rooms || []).map(room => ({
              ...room,
              id: room.id || room._id || '',
              status: room.status || 'available',
              capacity: room.capacity || 0
            }))}
            expenses={expenses || []}
            ingredients={[]}
            partners={partners || []}
            lang={lang as Language}
            currentUser={currentUser}
            refreshData={refreshData}
            isLoading={isLoading}
          />
        } />
        <Route path="/rooms" element={
          <RoomGrid 
            rooms={(rooms || []).map(room => ({
              id: room.id || room._id || '',
              roomNumber: room.roomNumber || '',
              tableName: room.tableName || room.roomNumber || `Table ${room.id || 'N/A'}`,
              status: room.status || 'available',
              capacity: room.capacity || 0
            }))}
            dishes={dishes || []}
            categories={categories || []}
            onUpdateRoom={() => {}}
            onRefresh={refreshData}
            lang={lang as Language}
          />
        } />
        <Route path="/orders" element={
          <OrderManagement 
            orders={orders || []} 
            dishes={dishes || []}
            refreshData={refreshData}
            isLoading={isLoading}
          />
        } />
        <Route path="/menu" element={
          <MenuManagement 
            dishes={dishes || []}
            refreshData={refreshData}
            isLoading={isLoading}
          />
        } />
        <Route path="/supply_chain" element={
          <ProtectedRoute allowedRoles={[UserRole.admin]} redirectTo="/admin/dashboard">
            <SupplyChainManager 
              dishes={dishes || []}
              categories={categories || []}
              currentUser={currentUser}
              partners={partners || []}
              onAddDish={async () => {}}
              onUpdateDish={async () => {}}
              onDeleteDish={async () => {}}
              lang={lang as Language}
              onRefreshData={refreshData}
            />
          </ProtectedRoute>
        } />
        <Route path="/images" element={
          <ImageLibrary 
            lang={lang as Language}
          />
        } />
        <Route path="/financial_hub" element={
          <ProtectedRoute allowedRoles={[UserRole.admin]} redirectTo="/admin/dashboard">
            <FinancialCenter 
              orders={orders || []}
              expenses={expenses || []}
              partners={partners || []}
              currentUser={currentUser}
              lang={lang as Language}
              onAddExpense={async () => {}}
              onDeleteExpense={async () => {}}
              onAddPartner={async () => {}}
              onUpdatePartner={async () => {}}
              onDeletePartner={async () => {}}
            />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <StaffManagement 
            users={users || []}
            partners={partners || []}
            currentUser={currentUser}
            lang={lang as Language}
            onRefresh={refreshData}
            onAddUser={async () => {}}
            onUpdateUser={async () => {}}
            onDeleteUser={async () => {}}
            onAddPartner={async () => {}}
            onUpdatePartner={async () => {}}
            onDeletePartner={async () => {}}
          />
        } />
        <Route path="/settings" element={
          <SystemSettings 
            lang={lang as Language}
            onChangeLang={() => {}}
            onUpdateConfig={async () => {}}
          />
        } />
        <Route path="/categories" element={
          <CategoryManagement 
            lang={lang as Language}
            onRefreshGlobal={refreshData}
          />
        } />
        <Route path="/inventory" element={
          <InventoryManagement 
            lang={lang as Language}
          />
        } />
        <Route path="/payments" element={
          <PaymentManagement 
            lang={lang as Language}
          />
        } />
        <Route path="/kds" element={
          <KitchenDisplaySystem />
        } />
      </Routes>
    </AdminLayout>
  );
};

// 路由守卫组件：检查用户角色并限制访问
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode, 
  allowedRoles: UserRole[], 
  redirectTo?: string 
}> = ({ children, allowedRoles, redirectTo = '/admin/dashboard' }) => {
  // 这里可以从上下文或其他地方获取当前用户
  // 为了简化，我们假设用户已经通过AuthGuard验证
  
  return <>{children}</>;
};

// 主应用
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50"> {/* 默认容器，如果AppContent没有提供主题容器的话 */}
        <AppContent />
      </div>
    </Router>
  );
}

export default App;