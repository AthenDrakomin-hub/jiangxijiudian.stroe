import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function fixUserPasswords() {
  try {
    console.log('🔌 正在连接到数据库...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ 成功连接到数据库');

    // 删除现有的用户数据
    await User.deleteMany({});
    console.log('🗑️ 已删除现有用户数据');

    // 重新创建用户，这次使用Mongoose模型，以便pre-save钩子能正常工作
    const usersData = [
      { 
        name: 'Admin User', 
        email: 'admin@jx.com', 
        password: '123456',
        role: 'admin',
        defaultLang: 'zh',
        modulePermissions: {
          dashboard: true,
          rooms: true,
          orders: true,
          dishes: true,
          supply_chain: true,
          financial_hub: true,
          images: true,
          users: true,
          settings: true,
          categories: true,
          inventory: true,
          payments: true
        },
        phone: '+86 138 0000 0001',
        isActive: true
      },
      { 
        name: 'Staff User', 
        email: 'staff@jx.com', 
        password: '123456',
        role: 'staff',
        defaultLang: 'en',
        modulePermissions: {
          dashboard: true,
          rooms: true,
          orders: true,
          dishes: false,
          supply_chain: false,
          financial_hub: false,
          images: false,
          users: false,
          settings: false,
          categories: false,
          inventory: false,
          payments: false
        },
        phone: '+86 138 0000 0002',
        isActive: true
      },
      { 
        name: 'Partner User', 
        email: 'partner@jx.com', 
        password: '123456',
        role: 'partner',
        partnerId: '666', // 示例合伙人ID
        defaultLang: 'zh',
        modulePermissions: {
          dashboard: true,
          rooms: false,
          orders: true,
          dishes: false,
          supply_chain: true,
          financial_hub: false,
          images: false,
          users: false,
          settings: false,
          categories: false,
          inventory: false,
          payments: false
        },
        phone: '+86 138 0000 0003',
        isActive: true
      }
    ];

    // 使用Mongoose模型创建用户，这样pre-save钩子会自动处理密码哈希
    for (const userData of usersData) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ 已创建用户: ${userData.email}`);
    }

    console.log(`\n🎉 成功创建 ${usersData.length} 个用户，密码已正确哈希处理`);

    // 验证密码哈希是否正常工作
    console.log('\n🔍 验证密码哈希...');
    const testUser = await User.findOne({ email: 'admin@jx.com' });
    if (testUser) {
      const isValid = await (testUser as any).comparePassword('123456');
      console.log(`✅ 密码验证成功: ${isValid}`);
      console.log(`🔑 哈希后的密码长度: ${testUser.password.length} 字符`);
    }

    await mongoose.disconnect();
    console.log('\n✅ 数据库连接已关闭');
  } catch (error) {
    console.error('💥 修复用户密码时发生错误:', error);
    process.exit(1);
  }
}

fixUserPasswords();