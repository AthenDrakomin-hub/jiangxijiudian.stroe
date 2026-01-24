import React from 'react';
import { Dish, OrderItem } from '../types';

interface GuestOrderProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
  cart: OrderItem[];
  tableNumber: string;
  onTableNumberChange: (table: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onPlaceOrder: () => void;
  cartTotal: number;
}

const GuestOrder: React.FC<GuestOrderProps> = ({
  dishes,
  onAddToCart,
  cart,
  tableNumber,
  onTableNumberChange,
  customerName,
  onCustomerNameChange,
  onPlaceOrder,
  cartTotal
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 菜单展示区 */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">今日菜单</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dishes
              .filter(dish => dish.isAvailable !== false) // 只显示可用菜品
              .map(dish => (
                <div key={dish._id || dish.id} className="border rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{dish.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{dish.description}</p>
                    <p className="text-lg font-semibold text-red-600 mt-2">¥{dish.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onAddToCart(dish)}
                    className="ml-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* 购物车侧边栏 */}
        <div className="bg-white border rounded-lg p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">购物车</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">购物车为空，请选择菜品</p>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">¥{item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <span className="font-semibold">¥{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>总计:</span>
                  <span className="text-red-600">¥{cartTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="桌号 *"
                    value={tableNumber}
                    onChange={(e) => onTableNumberChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="姓名 (可选)"
                    value={customerName}
                    onChange={(e) => onCustomerNameChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <button
                  onClick={onPlaceOrder}
                  disabled={!tableNumber.trim() || cart.length === 0}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                    !tableNumber.trim() || cart.length === 0
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
    </div>
  );
};

export default GuestOrder;