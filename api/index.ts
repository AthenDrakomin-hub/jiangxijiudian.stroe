// Vercel API Route for handling all requests
import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../src/config/vercel-mongoose';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://www.jiangxijiudian.store');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to database
    await connectDB();
    
    // Health check endpoint
    if (req.url?.includes('/health')) {
      return res.status(200).json({
        status: 'ok',
        service: 'jx-server-ts',
        db: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          readyState: mongoose.connection.readyState
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    // Handle authentication routes
    if (req.url?.includes('/api/auth/login') && req.method === 'POST') {
      // Import the auth service
      const AuthService = (await import('../src/services/AuthService')).default;
      
      // Execute login logic
      const { email, password } = req.body;
      
      // Perform login using the shared service
      const loginResult = await AuthService.login({ email, password });
      
      // Return appropriate response based on login result
      if (loginResult.success) {
        return res.status(200).json(loginResult);
      } else {
        const statusCode = loginResult.error?.includes('密码错误') || loginResult.error?.includes('邮箱或密码错误') ? 401 : 400;
        return res.status(statusCode).json(loginResult);
      }
    }
    
    // Root route
    if (req.url === '/' || req.url === '') {
      return res.status(200).json({
        message: '江西酒店API - 纯TS版（Vercel MongoDB原生适配）',
        status: 'running',
        docs: '/health'
      });
    }
    
    // 404 for other routes
    return res.status(404).json({
      success: false,
      error: '接口不存在',
      path: req.url
    });
  } catch (error: any) {
    console.error('API Handler Error:', error);
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      message: process.env.NODE_ENV === 'production' ? '服务器错误' : error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};