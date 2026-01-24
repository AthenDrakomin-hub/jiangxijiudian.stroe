import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Order, Dish, Room, Category, Expense, Partner, User, SystemConfig, Language } from '../types';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  orders?: Order[];
  refreshData?: () => void;
  isLoading?: boolean;
  dishes?: Dish[];
  rooms?: Room[];
  categories?: Category[];
  expenses?: Expense[];
  partners?: Partner[];
  users?: User[];
  config?: SystemConfig | null;
  lang?: Language;
  currentUser?: User | null;
  onLangChange?: (newLang: Language) => void;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
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
  lang = 'zh',
  currentUser,
  onLangChange
}) => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [langState, setLangState] = useState<string>(lang);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle hash changes to sync currentTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentTab(hash);
      }
    };

    // Initialize current tab from hash on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('user');
      // With mock user, we just navigate to guest page instead of login
      navigate('/guest');
    }
  };

  const toggleLanguage = () => {
    const newLang = langState === 'zh' ? 'en' : 'zh';
    setLangState(newLang);
    if (onLangChange) {
      onLangChange(newLang);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        lang={lang as any}
        onToggleLang={toggleLanguage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main 
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-24' : 'ml-72'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;