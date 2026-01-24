import { Request, Response } from 'express';
import User from '../models/User';

class RegistrationController {
  public submitRegistration = async (req: Request, res: Response) => {
    try {
      const { email, password, name, role } = req.body;
      
      // 检查用户是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }
      
      // 创建新用户
      const newUser = new User({
        name,
        email,
        password, // 在实际应用中，密码应该被加密
        role: role || 'staff',
        isActive: false // 默认未激活
      });
      
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error('Error submitting registration:', error);
      res.status(500).json({ error: 'Failed to submit registration' });
    }
  };

  public verifyRegistration = async (req: Request, res: Response) => {
    try {
      // 实际应用中需要实现验证逻辑
      const { token } = req.params;
      
      // 这里只是一个示例实现，实际需要验证token
      res.json({ 
        message: 'Verification token is valid', 
        token 
      });
    } catch (error) {
      console.error('Error verifying registration:', error);
      res.status(500).json({ error: 'Failed to verify registration' });
    }
  };

  public approveRegistration = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // 更新用户状态（实际应用中可能需要不同的字段）
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isActive: status === 'approved' },
        { new: true }
      );
      
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error approving registration:', error);
      res.status(500).json({ error: 'Failed to approve registration' });
    }
  };
}

export default new RegistrationController();