import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// 当前数据库连接URI
const CURRENT_MONGODB_URI = process.env.MONGODB_URI;

if (!CURRENT_MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('🔍 开始备份当前数据库...');

async function backupDatabase() {
  try {
    // 连接到当前数据库
    console.log('🔌 正在连接到当前数据库...');
    await mongoose.connect(CURRENT_MONGODB_URI!);
    console.log('✅ 成功连接到当前数据库');

    // 获取所有集合名称
    if (!mongoose.connection.db) {
      throw new Error('MongoDB connection did not initialize properly');
    }
    const collections = await mongoose.connection.db.collections();
    console.log(`📋 发现 ${collections.length} 个集合:`);
    
    const backupData: Record<string, any[]> = {};
    
    // 逐个备份每个集合的数据
    for (const collection of collections) {
      const collectionName = collection.collectionName;
      console.log(`📦 正在备份集合: ${collectionName}`);
      
      // 查询所有文档
      const documents = await collection.find({}).toArray();
      backupData[collectionName] = documents;
      
      console.log(`   → 备份了 ${documents.length} 条记录`);
    }

    // 将备份数据保存到文件
    const backupDir = path.join(__dirname, '../../backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = path.join(backupDir, `backup-${timestamp}.json`);
    
    await fs.writeFile(backupFileName, JSON.stringify(backupData, null, 2));
    console.log(`💾 备份文件已保存到: ${backupFileName}`);
    
    console.log('🎉 数据库备份完成！');
    console.log(`📊 统计信息:`);
    for (const [collectionName, documents] of Object.entries(backupData)) {
      console.log(`   ${collectionName}: ${documents.length} 条记录`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('💥 备份过程中出现错误:', error);
    process.exit(1);
  }
}

backupDatabase();