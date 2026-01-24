import React, { useState, useEffect, useMemo } from 'react';
import { Dish } from '../types';

interface MenuManagementProps {
  dishes: Dish[];
  refreshData: () => void;
  isLoading: boolean;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ 
  dishes, 
  refreshData, 
  isLoading 
}) => {
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(dishes);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
    isRecommended: false,
    tags: '',
    stock: 999,
    partnerId: '',
    image: ''
  });

  // 获取所有类别
  const categories = useMemo(() => {
    const allCats = new Set<string>();
    dishes.forEach(dish => {
      if (dish.category) allCats.add(dish.category);
      if (dish.categoryId) allCats.add(dish.categoryId);
    });
    return Array.from(allCats).sort();
  }, [dishes]);

  useEffect(() => {
    let result = dishes;
    
    if (searchTerm) {
      result = result.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dish.description && dish.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dish.category && dish.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(dish => 
        (dish.category && dish.category === selectedCategory) || 
        (dish.categoryId && dish.categoryId === selectedCategory)
      );
    }
    
    setFilteredDishes(result);
  }, [dishes, searchTerm, selectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      val = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Inline stock update handler
  const handleStockUpdate = async (dishId: string, newStock: number) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dishes.find(d => d._id === dishId || d.id === dishId),
          stock: newStock
        }),
      });

      if (response.ok) {
        refreshData();
      } else {
        console.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  // Toggle availability inline
  const toggleAvailabilityInline = async (dish: Dish) => {
    try {
      const response = await fetch(`/api/dishes/${dish._id || dish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dish,
          isAvailable: !dish.isAvailable
        }),
      });

      if (response.ok) {
        refreshData();
      } else {
        console.error('Failed to update dish availability');
      }
    } catch (error) {
      console.error('Error updating dish availability:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 处理标签数组
    const formattedData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };
    
    try {
      const url = editingDish 
        ? `/api/dishes/${editingDish._id || editingDish.id}` 
        : '/api/dishes';
      const method = editingDish ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        refreshData();
        resetForm();
      } else {
        console.error('Failed to save dish');
      }
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      price: 0,
      category: '',
      isAvailable: true,
      isRecommended: false,
      tags: '',
      stock: 999,
      partnerId: '',
      image: ''
    });
    setEditingDish(null);
    setShowAddForm(false);
  };

  const startEditing = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      nameEn: dish.nameEn || '',
      description: dish.description || '',
      price: dish.price,
      category: dish.category || dish.categoryId || '',
      isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true,
      isRecommended: dish.isRecommended !== undefined ? dish.isRecommended : false,
      tags: dish.tags ? dish.tags.join(', ') : '',
      stock: dish.stock !== undefined ? dish.stock : 999,
      partnerId: dish.partnerId || '',
      image: dish.image || dish.imageUrl || ''
    });
    setShowAddForm(true);
  };

  const deleteDish = async (dishId: string) => {
    if (window.confirm('确定要删除这道菜吗？')) {
      try {
        const response = await fetch(`/api/dishes/${dishId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          refreshData();
        } else {
          console.error('Failed to delete dish');
        }
      } catch (error) {
        console.error('Error deleting dish:', error);
      }
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="flex h-full">
      {/* 左侧分类导航 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">菜单分类</h2>
        </div>
        
        <div className="p-2">
          <div className="mb-2">
            <input
              type="text"
              placeholder="搜索分类..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <div className="overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  全部菜品 ({dishes.length})
                </button>
              </li>
              
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      toggleCategory(category);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center ${
                      selectedCategory === category 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category}</span>
                    <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5 ml-2">
                      {dishes.filter(d => d.category === category || d.categoryId === category).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            + 添加菜品
          </button>
        </div>
      </div>
      
      {/* 右侧主内容区 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800">菜品管理</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="搜索菜品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingDish ? '编辑菜品' : '添加菜品'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">英文名称</label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格 *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">库存数量</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="辣,爆款,推荐"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">是否可用</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecommended"
                      checked={formData.isRecommended}
                      onChange={(e) => setFormData({...formData, isRecommended: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">主厨推荐</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合作商ID</label>
                  <input
                    type="text"
                    name="partnerId"
                    value={formData.partnerId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  {editingDish ? '更新' : '添加'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">菜品名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">库存</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推荐</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish) => (
                      <tr key={dish._id || dish.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dish._id?.substring(0, 8) || dish.id?.substring(0, 8) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {dish.image || dish.imageUrl ? (
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={dish.image || dish.imageUrl} 
                                  alt={dish.name} 
                                />
                              ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{dish.name}</div>
                              {dish.nameEn && (
                                <div className="text-xs text-gray-500">{dish.nameEn}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={dish.description}>
                          {dish.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{dish.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            value={dish.stock !== undefined ? dish.stock : 999}
                            onChange={(e) => handleStockUpdate(dish._id || dish.id!, parseInt(e.target.value))}
                            onBlur={() => refreshData()} // Refresh to get updated data
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dish.category || dish.categoryId || '未分类'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dish.isRecommended ? (
                            <button
                              onClick={() => {
                                // Toggle recommendation status
                                fetch(`/api/dishes/${dish._id || dish.id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    ...dish,
                                    isRecommended: !dish.isRecommended
                                  }),
                                }).then(() => refreshData());
                              }}
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            >
                              推荐
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // Toggle recommendation status
                                fetch(`/api/dishes/${dish._id || dish.id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    ...dish,
                                    isRecommended: !dish.isRecommended
                                  }),
                                }).then(() => refreshData());
                              }}
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              不推荐
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleAvailabilityInline(dish)}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              dish.isAvailable !== false 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {dish.isAvailable !== false ? '上架' : '下架'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(dish)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => deleteDish(dish._id || dish.id!)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                        没有找到符合条件的菜品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* 批量操作按钮 */}
            {filteredDishes.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  显示 {filteredDishes.length} 条结果
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Batch availability toggle
                      const unavailableDishIds = filteredDishes.filter(d => !d.isAvailable).map(d => d._id || d.id!);
                      if (unavailableDishIds.length > 0) {
                        Promise.all(unavailableDishIds.map(id => 
                          fetch(`/api/dishes/${id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              ...dishes.find(d => d._id === id || d.id === id),
                              isAvailable: true
                            }),
                          })
                        )).then(() => refreshData());
                      }
                    }}
                    className="text-sm bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded"
                  >
                    批量上架
                  </button>
                  <button
                    onClick={() => {
                      // Batch availability toggle
                      const availableDishIds = filteredDishes.filter(d => d.isAvailable !== false).map(d => d._id || d.id!);
                      if (availableDishIds.length > 0) {
                        Promise.all(availableDishIds.map(id => 
                          fetch(`/api/dishes/${id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              ...dishes.find(d => d._id === id || d.id === id),
                              isAvailable: false
                            }),
                          })
                        )).then(() => refreshData());
                      }
                    }}
                    className="text-sm bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded"
                  >
                    批量下架
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;