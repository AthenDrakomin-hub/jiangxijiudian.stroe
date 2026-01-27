"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const vercel_mongoose_1 = __importDefault(require("./config/vercel-mongoose"));
// 导入路由
const auth_1 = __importDefault(require("./routes/auth"));
// 创建Express应用实例
const app = (0, express_1.default)();
// Vercel自动分配端口，本地默认3000
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// ########## 1. 中间件配置（顺序不可乱，跨域已适配你的前端域名）##########
// CORS配置：固定你的前端域名，避免跨域问题，保留凭证支持
app.use((0, cors_1.default)({
    origin: 'https://www.jiangxijiudian.store', // 你的前端实际域名，不可修改
    credentials: true, // 允许跨域携带Cookie/Token
    methods: ['GET', 'POST', 'OPTIONS'], // 允许的请求方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));
// 解析JSON请求体（前端已正确设置Content-Type: application/json）
app.use(express_1.default.json({ limit: '10kb' }));
// 解析表单URL编码请求体（备用，适配后续扩展）
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// ########## 2. 数据库初始化（Vercel Serverless按需执行，仅初始化一次）##########
let dbConnectionPromise = null;
/**
 * 初始化数据库连接（防止重复连接）
 */
const initializeDatabase = async () => {
    if (!dbConnectionPromise) {
        console.log('🔄 首次初始化数据库连接...');
        dbConnectionPromise = (0, vercel_mongoose_1.default)();
    }
    return dbConnectionPromise;
};
// 立即执行数据库初始化，捕获初始化错误
initializeDatabase().catch((error) => {
    console.error('💥 数据库初始化关键错误:', error.message);
    // Vercel生产环境数据库初始化失败，直接终止服务
    if (process.env.VERCEL)
        process.exit(1);
});
// ########## 3. 路由挂载 ##########
// Favicon处理路由：消除浏览器自动请求favicon.ico产生的404错误
app.get('/favicon.ico', (req, res) => {
    // 返回204 No Content，表示请求成功但无内容返回
    res.status(204).end();
});
// 健康检查路由：快速验证服务状态+数据库连接（优先测试此接口）
app.get('/health', async (req, res) => {
    try {
        let dbStatus = 'unknown';
        let dbReadyState = mongoose_1.default.connection.readyState;
        // 等待数据库连接完成，设置5秒超时
        if (dbConnectionPromise) {
            await Promise.race([
                dbConnectionPromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('数据库连接超时')), 5000))
            ]);
            dbReadyState = mongoose_1.default.connection.readyState;
            dbStatus = dbReadyState === 1 ? 'connected' : 'disconnected';
        }
        // 健康检查成功响应
        res.status(200).json({
            status: 'ok',
            service: 'jx-server-ts',
            db: {
                status: dbStatus,
                readyState: dbReadyState, // 1=连接成功，0=未连接，2=正在连接，3=断开连接
                message: dbReadyState === 1 ? '数据库连接正常' : '数据库连接异常'
            },
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    catch (error) {
        // 健康检查失败响应
        res.status(500).json({
            status: 'error',
            service: 'jx-server-ts',
            db: {
                status: 'error',
                message: error.message
            },
            timestamp: new Date().toISOString()
        });
    }
});
// 认证路由：挂载登录接口（路径：/api/auth/login）
app.use('/api/auth', auth_1.default);
// 根路由：验证服务是否正常启动
app.get('/', (req, res) => {
    res.status(200).json({
        message: '江西酒店API - 纯TS版（Vercel MongoDB原生适配）',
        status: 'running',
        docs: '/health'
    });
});
// ########## 4. 错误处理中间件 ##########
// 404错误：处理无效接口路径
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: '接口不存在',
        path: req.originalUrl
    });
});
// 全局异常处理：捕获所有未处理的错误
app.use((err, req, res, next) => {
    console.error('💥 全局未处理异常:', err.message, err.stack);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});
// ########## 5. 服务启动（Vercel环境自动处理，本地开发手动启动）##########
// 非Vercel环境（本地开发）才启动listen，Vercel会自动识别并托管app
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 纯TS服务本地启动成功 → http://localhost:${PORT}`);
        console.log(`🔍 健康检查地址 → http://localhost:${PORT}/health`);
    });
}
// 必须导出app实例，供Vercel Serverless函数识别
exports.default = app;
