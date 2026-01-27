"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// JWT 密钥 - 从环境变量中获取
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('CRITICAL ERROR: JWT_SECRET is not configured in environment variables');
    console.error('Please set JWT_SECRET in your environment variables.');
    process.exit(1); // 在服务器启动时检测到关键错误就退出
}
/**
 * 基础认证中间件 - 仅验证JWT token，不验证角色
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 从请求头获取 token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: '访问被拒绝，未提供有效的认证令牌。' });
            return;
        }
        const token = authHeader.substring(7, authHeader.length); // 移除 'Bearer ' 前缀
        // 验证 JWT token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (err) {
            res.status(401).json({ error: '认证令牌无效或已过期。' });
            return;
        }
        // 从数据库获取用户信息
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: '用户未找到。' });
            return;
        }
        // 将用户信息附加到请求对象上
        req.user = user;
        next(); // 认证通过，继续执行下一个中间件或路由处理器
    }
    catch (error) {
        console.error('认证中间件错误:', error);
        res.status(500).json({ error: '认证过程中发生服务器错误。' });
    }
};
exports.authMiddleware = authMiddleware;
