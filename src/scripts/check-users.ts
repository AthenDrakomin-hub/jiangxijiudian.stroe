import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function checkUsers() {
  try {
    console.log('🔌 正在连接到数据库...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ 成功连接到数据库');

    // 查询所有用户，排除密码字段
    const users = await User.find({}, { password: 0 }).lean();
    
    console.log(`\n👥 数据库中的用户总数: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n📋 用户详细信息:');
      users.forEach((user, index) => {
        console.log(`\n--- 用户 ${index + 1} ---`);
        console.log(`ID: ${user._id}`);
        console.log(`姓名: ${user.name}`);
        console.log(`邮箱: ${user.email}`);
        console.log(`角色: ${user.role || 'N/A'}`);
        console.log(`状态: ${user.isActive ? '激活' : '禁用'}`);
        console.log(`电话: ${user.phone || 'N/A'}`);
        console.log(`默认语言: ${user.defaultLang || 'N/A'}`);
        console.log(`合伙人ID: ${user.partnerId || 'N/A'}`);
        console.log(`创建时间: ${user.createdAt}`);
        console.log(`更新时间: ${user.updatedAt}`);
        
        if (user.modulePermissions) {
          console.log('模块权限:');
          Object.entries(user.modulePermissions).forEach(([permission, enabled]) => {
            console.log(`  ${permission}: ${enabled ? '✓' : '✗'}`);
          });
        }
      });
    } else {
      console.log('\n📝 数据库中暂无用户数据');
      console.log('\n💡 提示: 可以运行以下命令来添加示例数据:');
      console.log('   npm run seed');
    }

    await mongoose.disconnect();
    console.log('\n✅ 数据库连接已关闭');
  } catch (error) {
    console.error('💥 查询用户数据时发生错误:', error);
    process.exit(1);
  }
}

checkUsers();