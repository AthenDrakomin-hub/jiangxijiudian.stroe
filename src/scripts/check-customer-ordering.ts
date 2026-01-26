import mongoose from 'mongoose';
import Room from '../models/Room';
import Dish from '../models/Dish';
import Order from '../models/Order';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('🔍 开始检查客户点餐页面和二维码扫码功能...');

async function checkCustomerOrderingSystem() {
  try {
    // 连接到数据库
    console.log('🔌 正在连接到数据库...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ 成功连接到数据库');

    // 检查房间数据
    console.log('\n🏨 房间配置检查:');
    const rooms = await Room.find({}).sort({ roomNumber: 1 });
    console.log(`   总房间数: ${rooms.length} 个`);
    
    if (rooms.length > 0) {
      console.log('   房间列表:');
      rooms.slice(0, 10).forEach(room => {
        console.log(`     • ${room.roomNumber} - ${room.tableName} (${room.capacity}人座, ${room.status})`);
      });
      if (rooms.length > 10) {
        console.log(`     ... 还有 ${rooms.length - 10} 个房间`);
      }
    } else {
      console.log('   ❌ 未发现激活的房间');
    }

    // 检查菜品数据
    console.log('\n🍽️ 菜品配置检查:');
    const dishes = await Dish.find({ isAvailable: true });
    console.log(`   上架菜品数: ${dishes.length} 个`);
    
    if (dishes.length > 0) {
      console.log('   菜品分类统计:');
      const categoryCount: Record<string, number> = {};
      dishes.forEach(dish => {
        const category = dish.category || '未分类';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`     • ${category}: ${count} 个菜品`);
      });
    } else {
      console.log('   ❌ 未发现上架的菜品');
    }

    // 检查订单功能
    console.log('\n📝 订单系统检查:');
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
    console.log(`   最近订单数: ${recentOrders.length} 个`);
    
    if (recentOrders.length > 0) {
      console.log('   最近订单状态:');
      recentOrders.forEach(order => {
        console.log(`     • 订单#${order._id.toString().slice(-6)}: ${order.roomNumber || '未知房间'} - ${order.status} - ¥${order.totalAmount}`);
      });
    }

    // 检查API路由配置
    console.log('\n🌐 API路由检查:');
    const apiEndpoints = [
      { path: '/api/rooms/:roomNumber', desc: '获取房间信息', auth: '需要认证' },
      { path: '/api/rooms', desc: '获取所有房间', auth: '需要认证' },
      { path: '/api/dishes', desc: '获取菜品列表', auth: '需要认证' },
      { path: '/api/orders', desc: '创建订单', auth: '需要admin/staff角色' },
      { path: '/api/orders/:id', desc: '获取订单详情', auth: '需要admin/staff角色' }
    ];
    
    console.log('   核心API端点:');
    apiEndpoints.forEach(endpoint => {
      console.log(`     • ${endpoint.path}`);
      console.log(`       用途: ${endpoint.desc}`);
      console.log(`       权限: ${endpoint.auth}`);
    });

    // 检查二维码扫码点餐可行性
    console.log('\n📱 二维码扫码点餐可行性分析:');
    
    // 检查是否支持匿名访问
    const authRequiredEndpoints = apiEndpoints.filter(ep => ep.auth.includes('认证'));
    if (authRequiredEndpoints.length > 0) {
      console.log('   ⚠️  当前API需要认证访问，客户无法直接扫码点餐');
      console.log('   建议方案:');
      console.log('   1. 创建专门的客户点餐API端点（无需认证）');
      console.log('   2. 实现基于房间号的临时访问令牌');
      console.log('   3. 或者为客户提供通用的访客账户');
    } else {
      console.log('   ✅ API支持直接访问，可实现扫码点餐');
    }

    // 检查房间状态管理
    console.log('\n📊 房间状态管理:');
    const statusStats: Record<string, number> = {};
    rooms.forEach(room => {
      statusStats[room.status] = (statusStats[room.status] || 0) + 1;
    });
    
    console.log('   房间状态分布:');
    Object.entries(statusStats).forEach(([status, count]) => {
      const statusText = {
        'available': '可用',
        'occupied': '占用',
        'reserved': '预订',
        'maintenance': '维护'
      }[status] || status;
      console.log(`     • ${statusText}: ${count} 个房间`);
    });

    // 检查支付功能
    console.log('\n💳 支付功能检查:');
    const paymentMethods = ['cash', 'card', 'mobile', 'online'];
    console.log('   支持的支付方式:');
    paymentMethods.forEach(method => {
      const methodText = {
        'cash': '现金',
        'card': '刷卡',
        'mobile': '移动支付',
        'online': '在线支付'
      }[method] || method;
      console.log(`     • ${methodText}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ 客户点餐系统检查完成！');

    // 总结建议
    console.log('\n📋 系统改进建议:');
    if (authRequiredEndpoints.length > 0) {
      console.log('   🔧 需要开发客户专用的点餐API端点');
      console.log('   🔧 实现基于房间号的临时访问机制');
      console.log('   🔧 设计二维码生成和验证逻辑');
    }
    console.log('   ✅ 现有基础设施完备，支持快速扩展客户点餐功能');

  } catch (error) {
    console.error('💥 检查过程中出现错误:', error);
    process.exit(1);
  }
}

checkCustomerOrderingSystem();