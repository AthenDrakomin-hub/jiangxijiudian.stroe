import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
  // 用户登录
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // 验证输入
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
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
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  };



  // 获取当前用户信息
  public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };

      const user = await User.findById(decoded.userId, { password: 0 });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
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
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user information' });
    }
  };
}

export default new AuthController();