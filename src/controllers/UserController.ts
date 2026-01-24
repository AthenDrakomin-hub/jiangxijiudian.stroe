import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

class UserController {
  // 更新用户权限
  public updatePermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      // 验證是否為管理員
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
      }

      const token = authHeader.substring(7, authHeader.length);
      let decoded;
      try {
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
        decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
      } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
        return;
      }

      // 檢查角色是否為admin
      if (decoded.role !== 'admin') {
        res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
        return;
      }

      const userId = req.params.id;
      const { role, defaultLang, modulePermissions } = req.body;

      // 查找用戶
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // 更新用戶信息
      if (role) user.role = role;
      if (defaultLang) user.defaultLang = defaultLang;
      if (modulePermissions) user.modulePermissions = modulePermissions;

      await user.save();

      res.json({
        message: 'User permissions updated successfully',
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
      console.error('Error updating user permissions:', error);
      res.status(500).json({ error: 'Failed to update user permissions' });
    }
  };

  // 獲取所有用戶
  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find({}, { password: 0 }); // 排除密碼字段
      
      res.json(users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        defaultLang: user.defaultLang,
        modulePermissions: user.modulePermissions,
        isActive: user.isActive,
        phone: user.phone,
        avatar: user.avatar
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };

  // 獲取單個用戶
  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id, { password: 0 });
      
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
        modulePermissions: user.modulePermissions,
        isActive: user.isActive,
        phone: user.phone,
        avatar: user.avatar
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  };
}

export default new UserController();