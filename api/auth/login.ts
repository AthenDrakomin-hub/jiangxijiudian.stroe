import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../src/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../src/config/db';

// 连接数据库
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Origin', 'https://www.jiangxijiudian.store');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      res.status(400).json({ error: '邮箱和密码是必填项' });
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

    res.status(200).json({
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
}