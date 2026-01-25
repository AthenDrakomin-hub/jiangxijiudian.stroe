import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class AuthController {
  // 用户登录
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // 验证输入
      if (!email || !password) {
        res.status(400).json({ error: '邮箱和密码是必填项' });
        return;
      }

      // 检查数据库连接
      if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected. Ready state:', mongoose.connection.readyState);
        res.status(500).json({ 
          error: '数据库连接不可用',
          dbState: mongoose.connection.readyState
        });
        return;
      }

      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: '用户名或密码错误' });
        return;
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: '用户名或密码错误' });
        return;
      }

      // 生成JWT token
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          defaultLang: user.defaultLang,
          modulePermissions: user.modulePermissions
        }
      });
    } catch (error: any) {
      console.error('登录过程中发生错误:', error);
      res.status(500).json({ 
        error: '登录失败',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };



  // 获取当前用户信息
  public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: '访问被拒绝，未提供令牌。' });
        return;
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };

      const user = await User.findById(decoded.userId, { password: 0 });
      if (!user) {
        res.status(404).json({ error: '用户未找到' });
        return;
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        defaultLang: user.defaultLang,
        modulePermissions: user.modulePermissions
      });
    } catch (error) {
      console.error('获取当前用户信息时发生错误:', error);
      res.status(500).json({ error: '获取用户信息失败' });
    }
  };
}

export default new AuthController();