"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerFilterMiddleware = exports.verifyRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// JWT 密钥 - 从环境变量中获取
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
/**
 * 验证用户角色的中间件
 * @param allowedRoles 允许的角色数组
 */
const verifyRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // 从请求头获取 token
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Access denied. No token provided.' });
                return;
            }
            const token = authHeader.substring(7, authHeader.length); // 移除 'Bearer ' 前缀
            // 验证 JWT token
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            }
            catch (err) {
                res.status(401).json({ error: 'Invalid token.' });
                return;
            }
            // 从数据库获取用户信息
            const user = await User_1.default.findById(decoded.userId);
            if (!user) {
                res.status(401).json({ error: 'User not found.' });
                return;
            }
            // 检查用户角色是否在允许的角色列表中
            if (!allowedRoles.includes('admin')) {
                res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
                return;
            }
            // 将用户信息附加到请求对象上
            req.user = user;
            next(); // 角色验证通过，继续执行下一个中间件或路由处理器
        }
        catch (error) {
            console.error('Role verification error:', error);
            res.status(500).json({ error: 'Internal server error during role verification.' });
        }
    };
};
exports.verifyRole = verifyRole;
/**
 * 为合作伙伴提供数据隔离的中间件
 * 如果用户是 partner，则在其查询语句中自动加入 partnerId 过滤条件
 */
const partnerFilterMiddleware = async (req, res, next) => {
    try {
        // 从请求头获取 token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }
        const token = authHeader.substring(7, authHeader.length); // 移除 'Bearer ' 前缀
        // 验证 JWT token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (err) {
            res.status(401).json({ error: 'Invalid token.' });
            return;
        }
        // 从数据库获取用户信息
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: 'User not found.' });
            return;
        }
        // 将用户信息附加到请求对象上
        req.user = user;
        next(); // 继续执行下一个中间件或路由处理器
    }
    catch (error) {
        console.error('Partner filter middleware error:', error);
        res.status(500).json({ error: 'Internal server error during partner filtering.' });
    }
};
exports.partnerFilterMiddleware = partnerFilterMiddleware;
