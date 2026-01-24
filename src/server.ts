import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import { isS3Configured } from './config/s3';
import mongoose from 'mongoose';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const app = express();

// 创建HTTP服务器
const server = http.createServer(app);

// 配置CORS，允许所有来源
app.use(cors({
  origin: '*', // 在生产环境中应该指定具体的域名
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库
connectDB().catch(error => {
  console.error('Database connection failed:', error);
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
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1,
    s3: isS3Configured(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 添加根路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Restaurant Ordering API - Closed Loop MVP' });
});

// 挂载API路由
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import stubRoutes from './routes/stub';
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', stubRoutes); // 为新模型提供基础路由

// 托管前端静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // 处理SPA路由，将所有非API请求重定向到index.html
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

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

server.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});

export default app;