import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class UserCheckController {
  public checkUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🔍 开始检查用户数据...');
      
      // 查找所有用户
      const users = await User.find({});
      console.log(`📊 找到 ${users.length} 个用户:`);
      
      const userData: any[] = [];
      
      users.forEach((user, index) => {
        console.log(`\n用户 ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  邮箱: ${user.email}`);
        console.log(`  姓名: ${user.name}`);
        console.log(`  状态: ${user.isActive ? '启用' : '停用'}`);
        console.log(`  密码哈希: ${user.password.substring(0, 20)}...`);
        console.log(`  密码长度: ${user.password.length}`);
        
        userData.push({
          id: user._id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          passwordLength: user.password.length
        });
      });
      
      // 测试默认密码
      const defaultPassword = '123456';
      console.log(`\n🔑 测试默认密码 "${defaultPassword}" 与用户密码的匹配情况:`);
      
      const passwordResults: any[] = [];
      
      for (const user of users) {
        try {
          const isMatch = await bcrypt.compare(defaultPassword, user.password);
          console.log(`  ${user.email}: ${isMatch ? '✅ 匹配' : '❌ 不匹配'}`);
          passwordResults.push({
            email: user.email,
            isMatch: isMatch
          });
        } catch (error: any) {
          console.log(`  ${user.email}: ❌ 比较失败 - ${error.message}`);
          passwordResults.push({
            email: user.email,
            error: error.message
          });
        }
      }
      
      // 生成新的bcrypt哈希供参考
      console.log('\n🔄 生成新的bcrypt哈希供参考:');
      const saltRounds = 10;
      const newHash = await bcrypt.hash(defaultPassword, saltRounds);
      console.log(`  明文: ${defaultPassword}`);
      console.log(`  新哈希: ${newHash}`);
      console.log(`  长度: ${newHash.length}`);
      
      res.status(200).json({
        success: true,
        message: '用户数据检查完成',
        userCount: users.length,
        users: userData,
        passwordTest: {
          defaultPassword: defaultPassword,
          results: passwordResults
        },
        newHashInfo: {
          plaintext: defaultPassword,
          hash: newHash,
          length: newHash.length
        }
      });
      
    } catch (error: any) {
      console.error('💥 检查过程中发生错误:', error);
      res.status(500).json({
        success: false,
        error: '检查用户数据时发生错误',
        message: error.message
      });
    }
  };
}

export default new UserCheckController();