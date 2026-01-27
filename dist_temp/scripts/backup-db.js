"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
        await mongoose_1.default.connect(CURRENT_MONGODB_URI);
        console.log('✅ 成功连接到当前数据库');
        // 获取所有集合名称
        if (!mongoose_1.default.connection.db) {
            throw new Error('MongoDB connection did not initialize properly');
        }
        const collections = await mongoose_1.default.connection.db.collections();
        console.log(`📋 发现 ${collections.length} 个集合:`);
        const backupData = {};
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
        const backupDir = path_1.default.join(__dirname, '../../backups');
        await promises_1.default.mkdir(backupDir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = path_1.default.join(backupDir, `backup-${timestamp}.json`);
        await promises_1.default.writeFile(backupFileName, JSON.stringify(backupData, null, 2));
        console.log(`💾 备份文件已保存到: ${backupFileName}`);
        console.log('🎉 数据库备份完成！');
        console.log(`📊 统计信息:`);
        for (const [collectionName, documents] of Object.entries(backupData)) {
            console.log(`   ${collectionName}: ${documents.length} 条记录`);
        }
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('💥 备份过程中出现错误:', error);
        process.exit(1);
    }
}
backupDatabase();
