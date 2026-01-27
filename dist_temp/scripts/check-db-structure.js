"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
console.log('🔍 开始检查数据库结构完整性...');
async function checkDatabaseStructure() {
    try {
        // 连接到数据库
        console.log('🔌 正在连接到数据库...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ 成功连接到数据库');
        if (!mongoose_1.default.connection.db) {
            throw new Error('MongoDB connection did not initialize properly');
        }
        // 获取所有集合名称
        const collections = await mongoose_1.default.connection.db.collections();
        const collectionNames = collections.map(c => c.collectionName).sort();
        console.log(`\n📋 数据库中发现的集合 (${collections.length} 个):`);
        collectionNames.forEach(name => console.log(`   • ${name}`));
        // 项目中定义的模型对应的集合名称
        const expectedCollections = [
            'categories', // Category.ts
            'dishes', // Dish.ts
            'expenses', // Expense.ts
            'ingredients', // Ingredient.ts
            'inventories', // Inventory.ts
            'menus', // Menu.ts
            'notifications', // Notification.ts
            'orders', // Order.ts
            'partners', // Partner.ts
            'payments', // Payment.ts
            'products', // Product.ts
            'rooms', // Room.ts
            'staffs', // Staff.ts
            'systemconfigs', // SystemConfig.ts
            'users' // User.ts
        ].sort();
        console.log(`\n🎯 项目预期的集合 (${expectedCollections.length} 个):`);
        expectedCollections.forEach(name => console.log(`   • ${name}`));
        // 检查缺失的集合
        const missingCollections = expectedCollections.filter(name => !collectionNames.includes(name));
        const extraCollections = collectionNames.filter(name => !expectedCollections.includes(name));
        console.log('\n📊 结构对比分析:');
        if (missingCollections.length === 0) {
            console.log('✅ 所有预期的集合都存在');
        }
        else {
            console.log(`❌ 缺失的集合 (${missingCollections.length} 个):`);
            missingCollections.forEach(name => console.log(`   • ${name}`));
        }
        if (extraCollections.length === 0) {
            console.log('✅ 没有多余的集合');
        }
        else {
            console.log(`⚠️ 额外的集合 (${extraCollections.length} 个):`);
            extraCollections.forEach(name => console.log(`   • ${name}`));
        }
        // 检查每个集合的文档数量
        console.log('\n📈 集合数据统计:');
        for (const collectionName of collectionNames) {
            const count = await mongoose_1.default.connection.db.collection(collectionName).countDocuments();
            console.log(`   ${collectionName}: ${count} 条记录`);
        }
        await mongoose_1.default.disconnect();
        console.log('\n✅ 数据库结构检查完成！');
    }
    catch (error) {
        console.error('💥 检查过程中出现错误:', error);
        process.exit(1);
    }
}
checkDatabaseStructure();
