import { Request, Response } from 'express';
import User from '../models/User';

class UserController {
  // 獲取所有用戶
  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find({}, { password: 0 }); // 排除密碼字段
      
      res.json(users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
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
        isActive: user.isActive
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  };
}

export default new UserController();