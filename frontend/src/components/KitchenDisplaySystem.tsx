import React, { useState, useEffect, useRef } from 'react';
import { Order as OrderType } from '../types';

interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order extends OrderType {
  preparingAt?: string;
  readyAt?: string;
  deliveredAt?: string;
}

const KitchenDisplaySystem: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:${window.location.port || 4000}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('WebSocket connected to KDS');
      setWsConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        
        if (data.type === 'NEW_ORDER') {
          // Add new order to the list
          setOrders(prev => {
            // Check if order already exists to avoid duplicates
            const exists = prev.some(order => order.id === data.payload.orderId);
            if (!exists) {
              return [...prev, {
                id: data.payload.orderId,
                tableId: data.payload.tableId,
                roomNumber: data.payload.roomNumber,
                items: data.payload.items,
                totalAmount: data.payload.totalAmount,
                status: data.payload.status,
                createdAt: data.payload.createdAt,
                note: '', // Note might not be in payload
              }];
            }
            return prev;
          });
          
          // Play notification sound
          playNotificationSound();
        } else if (data.type === 'ORDER_STATUS_UPDATE') {
          // Update existing order status
          setOrders(prev => prev.map(order => {
            if (order.id === data.payload.orderId) {
              return {
                ...order,
                status: data.payload.status,
                // Update timestamps based on status
                ...(data.payload.status === 'preparing' && { preparingAt: new Date().toISOString() }),
                ...(data.payload.status === 'ready' && { readyAt: new Date().toISOString() }),
                ...(data.payload.status === 'delivered' && { deliveredAt: new Date().toISOString() })
              };
            }
            return order;
          }));
          
          // Play notification sound for important status updates
          if (data.payload.status === 'preparing' || data.payload.status === 'ready') {
            playNotificationSound();
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected from KDS');
      setWsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        // Recreate the effect to reconnect
        window.location.reload(); // Simple reconnect for now
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };
    
    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    // Create audio context for notification sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio context not supported, using system alert');
      // Fallback to system alert if Web Audio API is not supported
      // alert('New order received!');
    }
  };

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // The WebSocket will handle updating the UI when the server sends the update back
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">厨房显示系统 (KDS)</h1>
          <div className={`px-4 py-2 rounded-full ${wsConnected ? 'bg-green-600' : 'bg-red-600'}`}>
            {wsConnected ? '实时连接' : '连接断开'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders
            .filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sort by creation time
            .map(order => (
              <div 
                key={order.id}
                className={`rounded-lg p-6 shadow-lg border-4 transition-all duration-300 ${
                  order.status === 'pending' 
                    ? 'border-red-500 animate-pulse bg-red-900/30' 
                    : order.status === 'preparing' 
                      ? 'border-yellow-500 bg-yellow-900/30' 
                      : order.status === 'ready' 
                        ? 'border-green-500 bg-green-900/30' 
                        : 'border-gray-500 bg-gray-800/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">订单 #{order.id?.substring(0, 8) || order.id?.substring(0, 6)}</h2>
                    <p className="text-gray-300">
                      房间: {order.roomNumber || order.tableId} 
                      {order.roomNumber && ` (桌号: ${order.tableId})`}
                    </p>
                    <p className="text-sm text-gray-400">
                      时间: {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-red-600 text-white' :
                    order.status === 'confirmed' ? 'bg-blue-600 text-white' :
                    order.status === 'preparing' ? 'bg-yellow-600 text-black' :
                    order.status === 'ready' ? 'bg-green-600 text-white' :
                    order.status === 'delivered' ? 'bg-gray-600 text-white' :
                    'bg-red-800 text-white'
                  }`}>
                    {order.status === 'pending' ? '待处理' :
                     order.status === 'confirmed' ? '已确认' :
                     order.status === 'preparing' ? '制作中' :
                     order.status === 'ready' ? '已完成' :
                     order.status === 'delivered' ? '已送达' : '已取消'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">菜品:</h3>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>¥{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  {order.note && (
                    <p className="mt-2 text-yellow-300 italic">备注: {order.note}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(order.id!, 'preparing')}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded transition-colors font-medium"
                    >
                      开始制作
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusChange(order.id!, 'ready')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors font-medium"
                    >
                      制作完成
                    </button>
                  )}
                  
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusChange(order.id!, 'delivered')}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors font-medium"
                    >
                      已送出
                    </button>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
                    <button
                      onClick={() => handleStatusChange(order.id!, 'cancelled')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors font-medium"
                    >
                      取消订单
                    </button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
        
        {orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled').length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">当前没有待处理的订单</p>
          </div>
        )}
        
        {/* Audio element for notifications */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default KitchenDisplaySystem;