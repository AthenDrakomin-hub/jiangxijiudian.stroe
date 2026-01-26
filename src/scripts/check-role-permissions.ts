import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('🔍 开始检查角色权限配置...');

async function checkRolePermissions() {
  try {
    // 连接到数据库
    console.log('🔌 正在连接到数据库...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ 成功连接到数据库');

    // 获取所有用户
    const users = await User.find({}, { password: 0 }); // 排除密码字段
    console.log(`\n👥 数据库中的用户 (${users.length} 个):`);
    
    const roleStats: Record<string, number> = {};
    const permissionStats: Record<string, number> = {};

    for (const user of users) {
      console.log(`\n👤 用户: ${user.name} (${user.email})`);
      console.log(`   角色: ${user.role}`);
      console.log(`   状态: ${user.isActive ? '激活' : '禁用'}`);
      console.log(`   默认语言: ${user.defaultLang}`);
      
      if (user.role === 'partner' && user.partnerId) {
        console.log(`   合作伙伴ID: ${user.partnerId}`);
      }

      // 统计角色分布
      roleStats[user.role] = (roleStats[user.role] || 0) + 1;

      // 统计模块权限
      if (user.modulePermissions) {
        console.log(`   模块权限: ${JSON.stringify(user.modulePermissions)}`);
        for (const [module, enabled] of Object.entries(user.modulePermissions)) {
          if (enabled) {
            permissionStats[module] = (permissionStats[module] || 0) + 1;
          }
        }
      } else {
        console.log(`   模块权限: 未设置`);
      }
    }

    console.log('\n📊 角色分布统计:');
    for (const [role, count] of Object.entries(roleStats)) {
      console.log(`   ${role}: ${count} 个用户`);
    }

    console.log('\n📊 模块权限统计:');
    if (Object.keys(permissionStats).length > 0) {
      for (const [module, count] of Object.entries(permissionStats)) {
        console.log(`   ${module}: ${count} 个用户启用`);
      }
    } else {
      console.log('   暂无模块权限配置');
    }

    // 检查是否符合项目定义的角色体系
    const expectedRoles = ['admin', 'staff', 'partner'];
    const actualRoles = Object.keys(roleStats);
    const missingRoles = expectedRoles.filter(role => !actualRoles.includes(role));
    const extraRoles = actualRoles.filter(role => !expectedRoles.includes(role));

    console.log('\n🎯 角色体系合规性检查:');
    if (missingRoles.length === 0) {
      console.log('✅ 所有预期角色都存在');
    } else {
      console.log(`❌ 缺失的角色: ${missingRoles.join(', ')}`);
    }

    if (extraRoles.length === 0) {
      console.log('✅ 没有额外的未知角色');
    } else {
      console.log(`⚠️ 额外的角色: ${extraRoles.join(', ')}`);
    }

    // 检查关键权限配置
    console.log('\n🔐 关键权限配置检查:');
    
    const adminUsers = users.filter(u => u.role === 'admin');
    if (adminUsers.length > 0) {
      console.log('✅ 管理员账户已配置');
      adminUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email}): ${user.isActive ? '激活' : '禁用'}`);
      });
    } else {
      console.log('❌ 未发现管理员账户');
    }

    const partnerUsers = users.filter(u => u.role === 'partner');
    if (partnerUsers.length > 0) {
      console.log('✅ 合作伙伴账户已配置');
      partnerUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email}): ${user.partnerId || '未关联合作伙伴'}`);
      });
    } else {
      console.log('ℹ️  暂无合作伙伴账户');
    }

    await mongoose.disconnect();
    console.log('\n✅ 角色权限检查完成！');

  } catch (error) {
    console.error('💥 检查过程中出现错误:', error);
    process.exit(1);
  }
}

checkRolePermissions();