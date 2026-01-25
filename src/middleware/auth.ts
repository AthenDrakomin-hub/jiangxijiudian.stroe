import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// JWT 密钥 - 从环境变量中获取
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// 定义扩展的请求接口，添加 user 属性
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * 基础认证中间件 - 仅验证JWT token，不验证角色
 */
export const authMiddleware = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
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
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    } catch (err) {
      res.status(401).json({ error: '认证令牌无效或已过期。' });
      return;
    }

    // 从数据库获取用户信息
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: '用户未找到。' });
      return;
    }

    // 将用户信息附加到请求对象上
    req.user = user;

    next(); // 认证通过，继续执行下一个中间件或路由处理器
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({ error: '认证过程中发生服务器错误。' });
  }
};