import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Serverless 环境下的 MongoDB 连接复用
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/*
 * 注意：如果部署到 Vercel 或其他 Serverless 环境，请确保：
 * 1. 在 MongoDB Atlas 的 Network Access 设置中添加 0.0.0.0/0 到 IP 白名单
 * 2. 使用 SRV 连接字符串格式 (mongodb+srv://...)
 */

// 定义全局 mongoose 连接缓存类型
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  } | undefined;
}

const connectDB = async (): Promise<mongoose.Connection> => {
  // 初始化全局对象
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (global.mongoose.conn) {
    console.log('Reusing existing MongoDB connection');
    return global.mongoose.conn;
  }
  
  if (global.mongoose.promise) {
    console.log('Using existing MongoDB connection promise');
    return global.mongoose.promise;
  }

  try {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10秒连接超时
      socketTimeoutMS: 45000,  // 45秒socket超时
      maxPoolSize: 10,         // 连接池最大连接数
      minPoolSize: 2,          // 连接池最小连接数
      serverSelectionTimeoutMS: 30000, // 服务器选择超时
      heartbeatFrequencyMS: 10000,     // 心跳频率
      retryWrites: true,       // 启用重试写入
    }).then(mongooseInstance => mongooseInstance.connection);
    
    global.mongoose.conn = await global.mongoose.promise;
    console.log(`MongoDB Connected: ${global.mongoose.conn.host}`);
    
    // 监听数据库连接事件
    global.mongoose.conn.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    
    global.mongoose.conn.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    
    global.mongoose.conn.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
      if (global.mongoose) {
        global.mongoose.conn = null;
      }
    });
    
    return global.mongoose.conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }
    throw error;
  }
};

export default connectDB;