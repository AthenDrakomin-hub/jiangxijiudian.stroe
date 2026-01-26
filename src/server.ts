import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import { isS3Configured } from './config/s3';

import mongoose from 'mongoose';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// 创建HTTP服务器
const server = http.createServer(app);

// 配置CORS - 针对 Vercel 环境优化
// 注意：由于 Vercel 层面已经设置了 CORS 头部，这里只需处理非 CORS 相关的功能
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://www.jxfdfsfresh.vip',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  // 只预处理，不实际设置头部（由 Vercel 处理）
  preflightContinue: true
};

// 使用 cors 中间件（主要用于验证和预处理）
app.use(cors(corsOptions));

// 专门处理OPTIONS预检请求
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库并等待连接完成
let dbConnectionPromise: Promise<mongoose.Connection>;

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database connection...');
    console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
    console.log('📡 MongoDB URI configured:', !!process.env.MONGODB_URI);
    
    dbConnectionPromise = connectDB();
    
    console.log('⏳ Waiting for database connection to complete...');
    const connection = await dbConnectionPromise;
    
    console.log('✅ Database connection established successfully!');
    console.log('📊 Connection details:', {
      host: connection.host,
      name: connection.name,
      port: connection.port,
      readyState: connection.readyState
    });
    
  } catch (error: any) {
    console.error('💥 DATABASE INITIALIZATION FAILED!');
    console.error('📋 Error Details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // 在生产环境中，数据库连接失败应该终止应用
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Production environment: Shutting down due to database failure');
      process.exit(1);
    }
    
    // 在开发环境中，继续启动但标记数据库不可用
    console.warn('⚠️ Continuing startup with database unavailable...');
    throw error;
  }
};

// 立即开始数据库连接
console.log('🚀 Starting database initialization process...');
initializeDatabase().catch(error => {
  console.error('💥 Critical: Database initialization failed completely!');
  console.error('📋 Error:', error);
  
  // 在Vercel等Serverless环境中，数据库连接失败通常意味着应用无法正常工作
  if (process.env.VERCEL) {
    console.error('☁️ Vercel environment: Database connection is critical for this application');
  }
  
  // 不要让应用在数据库连接失败的情况下继续运行
  if (process.env.NODE_ENV === 'production') {
    console.error('🚨 Production: Exiting due to critical database failure');
    process.exit(1);
  }
});

// 确保在应用关闭时优雅地断开数据库连接
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Closing MongoDB connection...');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Closing MongoDB connection...');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

// 健康检查路由
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // 检查数据库连接状态
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      if (dbConnectionPromise) {
        // 等待数据库连接完成
        await Promise.race([
          dbConnectionPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB connection timeout')), 5000))
        ]);
        dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      } else {
        dbStatus = 'not_initialized';
      }
    } catch (error: any) {
      dbStatus = 'error';
      dbError = error.message || 'Unknown error';
    }
    
    res.json({
      status: 'ok',
      db: {
        status: dbStatus,
        error: dbError,
        readyState: mongoose.connection.readyState,
      },
      s3: isS3Configured(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// 添加 favicon 处理
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// 添加根路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Restaurant Ordering API - Closed Loop MVP' });
});

// 挂载API路由
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import stubRoutes from './routes/stub';
import printRoutes from './routes/print';
import authRoutes from './routes/auth';
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', stubRoutes); // 为新模型提供基础路由
app.use('/api/print', printRoutes); // 打印服务路由
app.use('/api/auth', authRoutes); // 认证服务路由

// 添加 favicon 处理（在所有 API 路由之后，但在错误处理之前）
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});
app.get('/favicon.png', (req: Request, res: Response) => {
  res.status(204).end();
});

// 设置端口，优先使用环境变量，否则使用默认端口
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// 创建WebSocket服务器
const wss = new WebSocketServer({ server, path: '/ws' }); // Add path for clarity

// 存储所有活跃的WebSocket连接
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected to WebSocket');
  clients.add(ws);

  // Send welcome message to the new client
  ws.send(JSON.stringify({ type: 'CONNECTION_ESTABLISHED', message: 'Connected to KDS server' }));

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// 广播消息给所有连接的客户端
const broadcastToClients = (data: any) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// 导出广播函数以便在其他地方使用
export { broadcastToClients };

// 只有在非 Vercel 环境下才运行 listen
if (!process.env.VERCEL_ENV) {
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// 404 处理中间件
app.use(notFoundHandler);

// 错误处理中间件
app.use(errorHandler);

// 必须导出 app 供 Vercel 调用
export default app;