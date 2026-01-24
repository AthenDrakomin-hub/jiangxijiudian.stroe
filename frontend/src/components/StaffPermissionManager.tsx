import React, { useState, useEffect } from 'react';
import { User as UserIcon, Languages, Settings, Eye, Edit3, Check, X } from 'lucide-react';
import { Language, getTranslation } from '../constants/translations';
import { User } from '../types';
import { api } from '../utils/api';

interface StaffPermissionManagerProps {
  lang: Language;
  currentUser: User;
  onRefresh?: () => void;
}

const StaffPermissionManager: React.FC<StaffPermissionManagerProps> = ({ lang, currentUser, onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPermissions, setEditPermissions] = useState<Record<string, boolean>>({});
  const [editRole, setEditRole] = useState<string>('');
  const [editLang, setEditLang] = useState<string>('');

  const t = (key: string) => getTranslation(lang, key);

  // 系统模块列表
  const modules = [
    { id: 'dashboard', name: t('dashboard') },
    { id: 'rooms', name: t('rooms') },
    { id: 'orders', name: t('orders') },
    { id: 'dishes', name: t('dishes') },
    { id: 'supply_chain', name: t('supply_chain') },
    { id: 'financial_hub', name: t('financial_hub') },
    { id: 'images', name: t('images') },
    { id: 'users', name: t('users') },
    { id: 'settings', name: t('settings') },
    { id: 'categories', name: t('categories') },
    { id: 'inventory', name: t('inventory') },
    { id: 'payments', name: t('payments') },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userData = await api.users.getAll();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditPermissions(user.modulePermissions || {});
    setEditRole(user.role);
    setEditLang(user.defaultLang || 'zh');
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditPermissions({});
    setEditRole('');
    setEditLang('');
  };

  const handlePermissionChange = (moduleId: string, value: boolean) => {
    setEditPermissions(prev => ({
      ...prev,
      [moduleId]: value
    }));
  };

  const handleSavePermissions = async () => {
    if (!editingUserId) return;

    try {
      await api.users.updatePermissions(editingUserId, {
        role: editRole,
        defaultLang: editLang,
        modulePermissions: editPermissions
      });
      
      // 刷新用户列表
      fetchUsers();
      if (onRefresh) onRefresh();
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user permissions:', error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'staff': return '员工';
      case 'partner': return '合伙人';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('users')}</h2>
              <p className="text-sm text-slate-500">{t('manage_user_permissions')}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">默认语言</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">权限</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <UserIcon className="text-slate-600" size={16} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        user.role === 'staff' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center">
                      <Languages size={16} className="mr-1" />
                      {user.defaultLang === 'zh' ? '中文' : 'English'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                    {editingUserId === user.id ? (
                      <div className="space-y-2">
                        {modules.slice(0, 3).map(module => (
                          <div key={module.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editPermissions[module.id] || false}
                              onChange={(e) => handlePermissionChange(module.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                            <label className="ml-2 text-sm text-slate-700">{module.name}</label>
                          </div>
                        ))}
                        {Object.values(editPermissions).filter(v => v).length > 0 && (
                          <span className="text-xs text-slate-500">
                            已启用 {Object.values(editPermissions).filter(v => v).length} 个模块
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(user.modulePermissions || {})
                          .filter(([_, enabled]) => enabled)
                          .slice(0, 3)
                          .map(([moduleId, _]) => {
                            const module = modules.find(m => m.id === moduleId);
                            return module ? (
                              <span 
                                key={moduleId} 
                                className="inline-flex items-center px-2 py-1 mr-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                              >
                                {module.name}
                              </span>
                            ) : null;
                          })}
                        {Object.values(user.modulePermissions || {}).filter(v => v).length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{Object.values(user.modulePermissions || {}).filter(v => v).length - 3} 更多
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingUserId === user.id ? (
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={handleSavePermissions}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Edit3 size={16} className="mr-1" /> {t('edit')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 权限编辑弹窗 */}
      {editingUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">编辑用户权限</h3>
                <button 
                  onClick={handleCancelEdit}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">角色</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">管理员</option>
                    <option value="staff">员工</option>
                    <option value="partner">合伙人</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">默认语言</label>
                  <select
                    value={editLang}
                    onChange={(e) => setEditLang(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-slate-900 mb-3">模块权限</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {modules.map(module => (
                    <div key={module.id} className="flex items-center p-2 border border-slate-200 rounded-lg">
                      <input
                        type="checkbox"
                        id={module.id}
                        checked={editPermissions[module.id] || false}
                        onChange={(e) => handlePermissionChange(module.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <label htmlFor={module.id} className="ml-2 text-sm text-slate-700">
                        {module.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSavePermissions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存更改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPermissionManager;