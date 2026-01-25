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

// 配置CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || ''] // 生产环境使用环境变量指定的前端地址
    : '*', // 开发环境允许所有来源
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库并等待连接完成
let dbConnectionPromise: Promise<mongoose.Connection>;

const initializeDatabase = async () => {
  try {
    console.log('Initializing database connection...');
    dbConnectionPromise = connectDB();
    await dbConnectionPromise;
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw error;
  }
};

// 立即开始数据库连接
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
  // 在生产环境中，这里可能需要更严格的错误处理
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