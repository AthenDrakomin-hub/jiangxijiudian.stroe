import bcrypt from 'bcryptjs';

async function generatePasswordHash() {
  try {
    const password = '123456';
    const saltRounds = 10;
    
    console.log('🔐 生成密码哈希...');
    console.log('明文密码:', password);
    console.log('盐轮数:', saltRounds);
    
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ 生成的bcrypt哈希:');
    console.log(hash);
    console.log('哈希长度:', hash.length);
    
    // 验证生成的哈希
    console.log('\n🧪 验证哈希:');
    const isValid = await bcrypt.compare(password, hash);
    console.log('密码匹配验证:', isValid ? '✅ 成功' : '❌ 失败');
    
    console.log('\n📋 使用说明:');
    console.log('1. 将上面生成的哈希值更新到MongoDB Atlas中的用户文档');
    console.log('2. 在users集合中找到对应用户，将password字段更新为上面的哈希值');
    console.log('3. 确保用户文档格式如下:');
    console.log('   {');
    console.log('     "_id": ObjectId("..."),');
    console.log('     "email": "admin@jiangxijiudian.com",');
    console.log('     "password": "' + hash + '",');
    console.log('     "name": "管理员",');
    console.log('     "isActive": true');
    console.log('   }');
    
  } catch (error) {
    console.error('💥 生成哈希时发生错误:', error);
  }
}

generatePasswordHash();