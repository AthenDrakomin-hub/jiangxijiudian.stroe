"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vercel_mongoose_1 = __importDefault(require("./config/vercel-mongoose"));
// 测试数据库连接
async function testDBConnection() {
    console.log('🔍 开始测试数据库连接...');
    try {
        // 尝试连接数据库
        await (0, vercel_mongoose_1.default)();
        console.log('✅ 数据库连接测试成功！');
        console.log('📊 连接状态:', mongoose_1.default.connection.readyState);
        console.log('🏠 主机:', mongoose_1.default.connection.host);
        console.log('🏷️ 数据库名称:', mongoose_1.default.connection.name);
        // 尝试执行一个简单查询
        if (mongoose_1.default.connection.db) {
            const stats = await mongoose_1.default.connection.db.admin().ping();
            console.log('🏓 数据库响应:', stats.ok ? '可用' : '不可用');
        }
        else {
            console.log('⚠️ 数据库实例不可用');
        }
        // 关闭连接
        await mongoose_1.default.disconnect();
        console.log('🔒 数据库连接已关闭');
    }
    catch (error) {
        console.error('❌ 数据库连接测试失败:', error);
        process.exit(1);
    }
}
// 执行测试
testDBConnection();
