import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function updateUserPassword() {
  try {
    console.log('🔄 开始更新用户密码...');
    
    // 从环境变量获取连接字符串
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI 环境变量未设置');
      return;
    }
    
    console.log('🔗 连接数据库...');
    await mongoose.connect(mongoUri);
    console.log('✅ 数据库连接成功');
    
    // 生成新的密码哈希
    const newPassword = '123456';
    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('🔐 生成的新密码哈希:');
    console.log(newHash);
    
    // 查找并更新用户
    const userEmail = 'admin@jiangxijiudian.com';
    
    console.log(`\n🔍 查找用户: ${userEmail}`);
    const userCollection = mongoose.connection.collection('users');
    const existingUser = await userCollection.findOne({ email: userEmail });
    
    if (existingUser) {
      console.log('✅ 找到用户，正在更新密码...');
      const result = await userCollection.updateOne(
        { email: userEmail },
        { 
          $set: { 
            password: newHash,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log('✅ 用户密码更新成功!');
        console.log(`📊 更新详情: ${result.modifiedCount} 条记录被修改`);
      } else {
        console.log('⚠️ 密码更新未生效，可能密码已经是最新值');
      }
    } else {
      console.log('❌ 未找到用户，正在创建新用户...');
      
      const newUser = {
        email: userEmail,
        password: newHash,
        name: '管理员',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await userCollection.insertOne(newUser);
      console.log('✅ 新用户创建成功!');
      console.log(`📊 插入的用户ID: ${result.insertedId}`);
    }
    
    // 验证更新结果
    console.log('\n🧪 验证密码更新结果...');
    const updatedUser = await userCollection.findOne({ email: userEmail });
    if (updatedUser) {
      const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
      console.log(`密码验证结果: ${isMatch ? '✅ 匹配' : '❌ 不匹配'}`);
      console.log(`用户状态: ${updatedUser.isActive ? '✅ 启用' : '❌ 停用'}`);
    }
    
    console.log('\n🎉 操作完成! 现在可以使用以下凭据登录:');
    console.log(`📧 邮箱: ${userEmail}`);
    console.log(`🔑 密码: ${newPassword}`);
    
  } catch (error: any) {
    console.error('💥 操作过程中发生错误:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 数据库连接已关闭');
  }
}

// 执行更新
updateUserPassword();