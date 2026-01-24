
import React, { useMemo } from 'react';
import { 
  LayoutDashboard, MapPin, ChefHat, Wallet, 
  Users, Settings, LogOut, Globe, ChevronLeft, ChevronRight,
  Handshake, Box, Image as ImageIcon, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { Language, getTranslation } from '../constants/translations';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: any; 
  onLogout: () => void;
  lang: Language;
  onToggleLang: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, setCurrentTab, currentUser, onLogout, lang, onToggleLang, 
  isCollapsed, onToggleCollapse 
}) => {
  const t = (key: string) => getTranslation(lang, key);

  const menuItems = useMemo(() => {
    const role = currentUser?.role || 'user';
    const permissions = currentUser?.modulePermissions || {};
    
    // 根据角色和权限确定可见的菜单项
    let allItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'dashboard', permission: 'dashboard' },
      { id: 'rooms', icon: MapPin, label: 'rooms', permission: 'rooms' },
      { id: 'orders', icon: ChefHat, label: 'orders', permission: 'orders' },
      { id: 'kds', icon: ChefHat, label: 'kds', permission: 'orders' }, // Kitchen Display System - 关联订单权限
      { id: 'supply_chain', icon: Box, label: 'supply_chain', permission: 'supply_chain' },
      { id: 'images', icon: ImageIcon, label: 'images', permission: 'images' },
      { id: 'financial_hub', icon: Wallet, label: 'financial_hub', permission: 'financial_hub' },
      { id: 'users', icon: Users, label: 'users', permission: 'users' },
      { id: 'settings', icon: Settings, label: 'settings', permission: 'settings' },
      { id: 'categories', icon: Settings, label: 'categories', permission: 'dishes' }, // 分类管理 - 关联菜品权限
      { id: 'inventory', icon: Box, label: 'inventory', permission: 'supply_chain' }, // 库存管理 - 关联供应链权限
      { id: 'payments', icon: Wallet, label: 'payments', permission: 'financial_hub' }, // 支付管理 - 关联财务权限
    ];
    
    // 根据角色进行初步过滤
    let filteredItems = [];
    
    if (role === 'partner') {
      // partner 角色只显示特定菜单项，同时考虑权限
      filteredItems = allItems.filter(item => 
        ['dashboard', 'orders', 'supply_chain'].includes(item.id) && 
        (permissions[item.permission] !== false)
      );
    } else if (role === 'staff') {
      // staff 角色排除某些菜单项，同时考虑权限
      filteredItems = allItems.filter(item => 
        !['financial_hub', 'users', 'settings'].includes(item.id) && 
        (permissions[item.permission] !== false)
      );
    } else {
      // admin 角色显示所有有权限的菜单项
      filteredItems = allItems.filter(item => permissions[item.permission] !== false);
    }

    return filteredItems;
  }, [currentUser?.role, currentUser?.modulePermissions]);

  return (
    <aside className={`bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-[110] flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isCollapsed ? 'w-24' : 'w-72'}`}>
      {/* Logo Section */}
      <div className={`p-8 flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 bg-slate-950 text-blue-500 rounded-xl flex items-center justify-center font-black shadow-xl shrink-0">JX</div>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-sm font-black text-slate-900 tracking-tighter whitespace-nowrap">{t('jxCloud')}</h1>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('enterprise_auth')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => {
                setCurrentTab(item.id);
                window.location.hash = item.id;
              }} 
              title={isCollapsed ? t(item.label) : ''}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all relative active-scale group
                ${isCollapsed ? 'justify-center px-0' : ''}
                ${isActive ? 'bg-slate-950 text-white shadow-xl translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Icon size={18} className={`${isActive ? 'text-blue-500' : 'group-hover:text-blue-500 transition-colors'}`} />
              {!isCollapsed && <span className="animate-in fade-in duration-300">{t(item.label)}</span>}
              {isActive && !isCollapsed && <div className="absolute right-4 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Tools */}
      <div className={`p-4 border-t border-slate-50 space-y-2`}>
        <button 
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-slate-400 font-black text-[9px] uppercase hover:bg-slate-50 hover:text-blue-600 transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          {!isCollapsed && <span>{t(isCollapsed ? 'expand' : 'collapse')}</span>}
        </button>

        <div className={`px-5 py-4 rounded-2xl bg-slate-50 flex items-center gap-3 transition-all ${isCollapsed ? 'justify-center px-0 bg-transparent' : ''}`}>
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-blue-600 shadow-md shrink-0`}>
              <Users size={14} />
           </div>
           {!isCollapsed && (
             <div className="flex-1 truncate animate-in fade-in duration-300">
               <p className="text-[10px] font-black text-slate-900 truncate leading-none">{currentUser?.name}</p>
               <p className="text-[8px] font-bold text-blue-500 uppercase mt-1">ROOT_NODE</p>
             </div>
           )}
        </div>

        <button onClick={onLogout} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-400 font-black text-[9px] uppercase hover:text-red-500 hover:bg-red-50/50 transition-all active-scale ${isCollapsed ? 'justify-center px-0' : ''}`}>
          <LogOut size={14} />
          {!isCollapsed && <span>{t('signOut')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;