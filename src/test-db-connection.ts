import mongoose from 'mongoose';
import connectDB from './config/vercel-mongoose';

// 测试数据库连接
async function testDBConnection() {
  console.log('🔍 开始测试数据库连接...');
  
  try {
    // 尝试连接数据库
    await connectDB();
    
    console.log('✅ 数据库连接测试成功！');
    console.log('📊 连接状态:', mongoose.connection.readyState);
    console.log('🏠 主机:', mongoose.connection.host);
    console.log('🏷️ 数据库名称:', mongoose.connection.name);
    
    // 尝试执行一个简单查询
    if (mongoose.connection.db) {
      const stats = await mongoose.connection.db.admin().ping();
      console.log('🏓 数据库响应:', stats.ok ? '可用' : '不可用');
    } else {
      console.log('⚠️ 数据库实例不可用');
    }
    
    // 关闭连接
    await mongoose.disconnect();
    console.log('🔒 数据库连接已关闭');
    
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error);
    process.exit(1);
  }
}

// 执行测试
testDBConnection();