import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function checkUsers() {
  try {
    console.log('🔍 开始检查用户数据...');
    
    // 连接数据库
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI 环境变量未设置');
      return;
    }
    console.log('🔗 连接数据库:', mongoUri.slice(0, 50) + '***');
    
    await mongoose.connect(mongoUri);
    console.log('✅ 数据库连接成功');
    
    // 查找所有用户
    const users = await User.find({});
    console.log(`📊 找到 ${users.length} 个用户:`);
    
    users.forEach((user, index) => {
      console.log(`\n用户 ${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  邮箱: ${user.email}`);
      console.log(`  姓名: ${user.name}`);
      console.log(`  状态: ${user.isActive ? '启用' : '停用'}`);
      console.log(`  密码哈希: ${user.password.substring(0, 20)}...`);
      console.log(`  密码长度: ${user.password.length}`);
    });
    
    // 测试默认密码
    const defaultPassword = '123456';
    console.log(`\n🔑 测试默认密码 "${defaultPassword}" 与用户密码的匹配情况:`);
    
    for (const user of users) {
      try {
        const isMatch = await bcrypt.compare(defaultPassword, user.password);
        console.log(`  ${user.email}: ${isMatch ? '✅ 匹配' : '❌ 不匹配'}`);
      } catch (error: any) {
        console.log(`  ${user.email}: ❌ 比较失败 - ${error.message}`);
      }
    }
    
    // 生成新的bcrypt哈希供参考
    console.log('\n🔄 生成新的bcrypt哈希供参考:');
    const saltRounds = 10;
    const newHash = await bcrypt.hash(defaultPassword, saltRounds);
    console.log(`  明文: ${defaultPassword}`);
    console.log(`  新哈希: ${newHash}`);
    console.log(`  长度: ${newHash.length}`);
    
    // 测试新哈希与现有密码的匹配
    console.log('\n🧪 测试新生成的哈希:');
    for (const user of users) {
      try {
        const isMatch = await bcrypt.compare(defaultPassword, newHash);
        console.log(`  新哈希与${user.email}: ${isMatch ? '✅ 匹配' : '❌ 不匹配'}`);
      } catch (error: any) {
        console.log(`  新哈希测试失败: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('💥 检查过程中发生错误:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 数据库连接已关闭');
  }
}

// 执行检查
checkUsers();