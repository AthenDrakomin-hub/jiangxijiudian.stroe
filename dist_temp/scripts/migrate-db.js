"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 当前数据库和目标数据库连接URI
const CURRENT_MONGODB_URI = process.env.MONGODB_URI;
const TARGET_MONGODB_URI = process.env.TARGET_MONGODB_URI;
if (!CURRENT_MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
if (!TARGET_MONGODB_URI) {
    throw new Error('Please define the TARGET_MONGODB_URI environment variable');
}
console.log('🔄 开始数据库迁移...');
async function migrateDatabase() {
    try {
        // 连接到当前数据库
        console.log('🔌 正在连接到当前数据库...');
        await mongoose_1.default.connect(CURRENT_MONGODB_URI);
        console.log('✅ 成功连接到当前数据库');
        // 获取所有集合名称
        if (!mongoose_1.default.connection.db) {
            throw new Error('Current MongoDB connection did not initialize properly');
        }
        const collections = await mongoose_1.default.connection.db.collections();
        console.log(`📋 发现 ${collections.length} 个集合:`);
        const migrationData = {};
        // 逐个备份每个集合的数据
        for (const collection of collections) {
            const collectionName = collection.collectionName;
            console.log(`📦 正在导出集合: ${collectionName}`);
            // 查询所有文档
            const documents = await collection.find({}).toArray();
            migrationData[collectionName] = documents;
            console.log(`   → 导出了 ${documents.length} 条记录`);
        }
        await mongoose_1.default.disconnect();
        console.log('✅ 当前数据库连接已断开');
        // 连接到目标数据库
        console.log('🔌 正在连接到目标数据库...');
        await mongoose_1.default.connect(TARGET_MONGODB_URI);
        console.log('✅ 成功连接到目标数据库');
        // 逐个集合导入数据
        for (const [collectionName, documents] of Object.entries(migrationData)) {
            console.log(`📥 正在导入集合: ${collectionName} (${documents.length} 条记录)`);
            if (documents.length > 0) {
                // 清空目标集合（可选，取决于是否需要替换数据）
                await mongoose_1.default.connection.db.collection(collectionName).deleteMany({});
                // 插入文档
                await mongoose_1.default.connection.db.collection(collectionName).insertMany(documents);
            }
            console.log(`   → 成功导入 ${documents.length} 条记录到 ${collectionName}`);
        }
        console.log('🎉 数据库迁移完成！');
        console.log(`📊 迁移统计:`);
        for (const [collectionName, documents] of Object.entries(migrationData)) {
            console.log(`   ${collectionName}: ${documents.length} 条记录`);
        }
        await mongoose_1.default.disconnect();
        console.log('✅ 目标数据库连接已断开');
    }
    catch (error) {
        console.error('💥 迁移过程中出现错误:', error);
        process.exit(1);
    }
}
migrateDatabase();
