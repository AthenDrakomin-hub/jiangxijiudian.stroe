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
 * 验证用户角色的中间件
 * @param allowedRoles 允许的角色数组
 */
export const verifyRole = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
        decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
      } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
        return;
      }

      // 从数据库获取用户信息
      const user = await User.findById(decoded.userId);
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
    } catch (error) {
      console.error('Role verification error:', error);
      res.status(500).json({ error: 'Internal server error during role verification.' });
    }
  };
};

/**
 * 为合作伙伴提供数据隔离的中间件
 * 如果用户是 partner，则在其查询语句中自动加入 partnerId 过滤条件
 */
export const partnerFilterMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    } catch (err) {
      res.status(401).json({ error: 'Invalid token.' });
      return;
    }

    // 从数据库获取用户信息
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found.' });
      return;
    }

    // 将用户信息附加到请求对象上
    req.user = user;

    next(); // 继续执行下一个中间件或路由处理器
  } catch (error) {
    console.error('Partner filter middleware error:', error);
    res.status(500).json({ error: 'Internal server error during partner filtering.' });
  }
};