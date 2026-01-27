"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SystemConfig_1 = __importDefault(require("../models/SystemConfig"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
console.log('🔍 开始检查系统配置和策略...');
async function checkSystemConfig() {
    try {
        // 连接到数据库
        console.log('🔌 正在连接到数据库...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ 成功连接到数据库');
        // 获取系统配置
        const configs = await SystemConfig_1.default.find({});
        console.log(`\n⚙️ 系统配置项 (${configs.length} 个):`);
        for (const config of configs) {
            console.log(`\n📋 配置 ID: ${config._id}`);
            console.log(`   激活主题: ${config.activeTheme}`);
            console.log(`   主题设置: ${JSON.stringify(config.themeSettings)}`);
            console.log(`   创建时间: ${config.createdAt}`);
            console.log(`   更新时间: ${config.updatedAt}`);
        }
        // 检查默认配置是否存在
        if (configs.length === 0) {
            console.log('\n⚠️ 未发现系统配置，建议初始化默认配置');
        }
        else {
            console.log('\n✅ 系统配置已存在');
            // 检查主题配置的完整性
            const themes = ['glass', 'clay', 'bento', 'brutal'];
            const activeThemes = configs.map(c => c.activeTheme);
            const missingThemes = themes.filter(theme => !activeThemes.includes(theme));
            console.log('\n🎨 主题配置检查:');
            console.log(`   支持的主题: ${themes.join(', ')}`);
            console.log(`   已配置的主题: ${activeThemes.join(', ')}`);
            if (missingThemes.length === 0) {
                console.log('✅ 所有主题配置完整');
            }
            else {
                console.log(`⚠️ 缺失的主题配置: ${missingThemes.join(', ')}`);
            }
        }
        await mongoose_1.default.disconnect();
        console.log('\n✅ 系统配置检查完成！');
    }
    catch (error) {
        console.error('💥 检查过程中出现错误:', error);
        process.exit(1);
    }
}
checkSystemConfig();
