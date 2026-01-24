import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dish, Order, OrderItem } from '../types';

interface GuestOrderPageProps {
  dishes: Dish[];
  refreshData: () => void;
  isLoading: boolean;
  room?: string;
}

const GuestOrderPage: React.FC<GuestOrderPageProps> = ({ 
  dishes, 
  refreshData, 
  isLoading,
  room: propRoom
}) => {
  const { room: paramRoom } = useParams<{ room?: string }>();
  const [cart, setCart] = useState<OrderItem[]>([]);
  
  // 优先使用路由参数，其次使用props传递的room参数
  const effectiveRoom = paramRoom || propRoom;
  const [tableNumber, setTableNumber] = useState<string>(effectiveRoom || '');
  const [customerName, setCustomerName] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  // 如果没有room参数，显示引导页面
  if (!effectiveRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">江云厨</h1>
            <p className="text-gray-600 text-lg">智能点餐系统</p>
          </div>
          
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              请使用餐桌上的二维码扫码点餐
            </p>
            <p className="text-sm text-gray-500">
              扫描餐桌二维码即可开始点餐
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>提示：</strong>如需帮助请联系服务员
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 按类别分组菜品
  const groupedDishes = dishes.reduce((acc: Record<string, Dish[]>, dish) => {
    const category = dish.category || dish.categoryId || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {});

  const addToCart = (dish: Dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dishId === dish._id || item.dishId === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.dishId === dish._id || item.dishId === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            dishId: dish._id || dish.id!,
            name: dish.name,
            price: dish.price,
            quantity: 1
          }
        ];
      }
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prevCart => prevCart.filter(item => !(item.dishId === dishId)));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.dishId === dishId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (!tableNumber.trim()) {
      alert('请输入桌号');
      return;
    }

    const orderData = {
      tableId: tableNumber,
      customerName: customerName || '顾客',
      items: cart,
      totalAmount: getTotalPrice(),
      status: 'pending'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        setTimeout(() => {
          setCart([]);
          setTableNumber('');
          setCustomerName('');
          setOrderPlaced(false);
          setShowConfirmation(false);
        }, 3000);
      } else {
        alert('下单失败，请重试');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('下单失败，请重试');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">在线点餐</h1>

      {orderPlaced ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">成功! </strong>
          <span className="block sm:inline">订单已提交，服务员将很快为您服务。</span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">加载菜单中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 菜单部分 */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {Object.entries(groupedDishes).map(([category, categoryDishes]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryDishes
                      .filter(dish => dish.isAvailable !== false) // 只显示可售菜品
                      .map(dish => (
                        <div 
                          key={dish._id || dish.id} 
                          className="border rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{dish.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{dish.description}</p>
                            <p className="text-lg font-semibold text-red-600 mt-2">¥{dish.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => addToCart(dish)}
                            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 购物车部分 */}
          <div className="bg-white border rounded-lg p-6 h-fit sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">购物车</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">购物车为空，请选择菜品</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                  {cart.map((item) => {
                    const dish = dishes.find(d => d._id === item.dishId || d.id === item.dishId);
                    return (
                      <div key={item.dishId} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-600">¥{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                            className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                            className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>总计:</span>
                    <span className="text-red-600">¥{getTotalPrice().toFixed(2)}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="桌号 *"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="姓名 (可选)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={cart.length === 0 || !tableNumber.trim()}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                      cart.length === 0 || !tableNumber.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    提交订单
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestOrderPage;