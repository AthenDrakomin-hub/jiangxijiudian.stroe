import React, { useState, useEffect } from 'react';
import { Order, OrderItem, Dish, SystemConfig } from '../types';
import { getThemeClass } from '../utils/theme';

interface OrderManagementProps {
  orders: Order[];
  dishes: Dish[];
  config?: SystemConfig;
  refreshData: () => void;
  isLoading: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ 
  orders, 
  dishes, 
  config,
  refreshData, 
  isLoading 
}) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  }, [orders, selectedStatus]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        refreshData();
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${getThemeClass(config, 'Container')} p-6`}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className={`${getThemeClass(config, 'Text')} text-2xl font-bold text-gray-800`}>订单管理</h2>
        <div className="flex space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`${getThemeClass(config, 'Button')} border border-gray-300 rounded-md px-3 py-2`}
          >
            <option value="all">全部订单</option>
            <option value="pending">待处理</option>
            <option value="confirmed">已确认</option>
            <option value="preparing">准备中</option>
            <option value="ready">待上菜</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className={`${getThemeClass(config, 'Text')} mt-2 text-gray-600`}>加载中...</p>
        </div>
      ) : (
        <div className={`${getThemeClass(config, 'Card')} rounded-lg shadow overflow-hidden`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">桌号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">菜品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总价</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id || order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id || order._id?.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.tableId || order.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName || '匿名'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <ul className="list-disc pl-5">
                        {(order.items || []).map((item: OrderItem, index: number) => (
                          <li key={index}>{item.name || item.dishName} × {item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => updateOrderStatus(order.id || order._id!, 'confirmed')}
                                className={`${getThemeClass(config, 'Button')} text-blue-600 hover:text-blue-900`}
                              >
                                确认
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => updateOrderStatus(order.id || order._id!, 'preparing')}
                                className={`${getThemeClass(config, 'Button')} text-purple-600 hover:text-purple-900`}
                              >
                                开始制作
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => updateOrderStatus(order.id || order._id!, 'ready')}
                                className={`${getThemeClass(config, 'Button')} text-indigo-600 hover:text-indigo-900`}
                              >
                                准备就绪
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button
                                onClick={() => updateOrderStatus(order.id || order._id!, 'delivered')}
                                className={`${getThemeClass(config, 'Button')} text-green-600 hover:text-green-900`}
                              >
                                已送达
                              </button>
                            )}
                            <button
                              onClick={() => updateOrderStatus(order.id || order._id!, 'cancelled')}
                              className={`${getThemeClass(config, 'Button')} text-red-600 hover:text-red-900`}
                            >
                              取消
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    暂无订单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;