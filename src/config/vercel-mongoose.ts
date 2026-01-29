import mongoose, { ConnectOptions, Connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// 定义全局 mongoose 连接缓存类型（Serverless 环境下的连接复用机制）
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  } | undefined;
}

const connectDB = async (): Promise<Connection> => {
  // 初始化全局对象
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (global.mongoose.conn) {
    console.log('✅ Reusing existing MongoDB connection');
    return global.mongoose.conn;
  }
  
  if (global.mongoose.promise) {
    console.log('🔄 Using existing MongoDB connection promise');
    return global.mongoose.promise;
  }

  try {
    // 保留禁用缓冲（之前已验证有效）
    mongoose.set('bufferCommands', false);
    console.log('📌 已禁用Mongoose操作缓冲，避免Serverless冷启动超时');

    console.log('🔄 初始化数据库连接...');
    console.log('🔧 环境:', process.env.NODE_ENV || 'development');
    console.log('☁️ Vercel环境:', !!process.env.VERCEL);
    console.log('📡 MongoDB URI配置:', !!process.env.MONGODB_URI);

    // 使用Vercel原生集成提供的环境变量，并确保连接到正确的数据库
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI环境变量未设置（请确认Vercel已关联MongoDB）');
    }
    
    let mongoUri = process.env.MONGODB_URI;
    
    // 在Vercel环境中使用传入的URI，不做修改
    // Vercel会自动提供正确的数据库连接字符串
    if (process.env.VERCEL) {
      mongoUri = process.env.MONGODB_URI!;
    }
    
    console.log('🔗 修正后的连接串:', mongoUri.slice(0, 50) + '***'); // 隐藏密码，仅看前50位

    // ========== 核心强制适配配置（解决网络/解析/超时问题） ==========
    const options: ConnectOptions = {
      bufferCommands: false,
      connectTimeoutMS: 30000,        // 30秒：连接握手超时
      socketTimeoutMS: 60000,         // 60秒：socket通信超时
      serverSelectionTimeoutMS: 30000, // 30秒：服务器选择超时
      heartbeatFrequencyMS: 10000,     // 心跳频率
      retryWrites: true,              // 启用重试写入
      retryReads: true,               // 启用重试读取
      maxPoolSize: 1,                 // 禁用连接池，适配Vercel Serverless短暂连接特性
      minPoolSize: 0,                 // Serverless环境不需要最小连接池
      maxIdleTimeMS: 30000,           // 30秒空闲超时
      family: 4,                      // 强制启用IPv4（核心！避免IPv6解析问题）
      ssl: true,                      // 显式开启TLS，匹配Atlas强制加密要求
      tls: true,
      writeConcern: { w: 'majority' }
    };
    // ==============================================================

    console.log('🔍 使用Vercel原生集成连接MongoDB Atlas...');
    
    // 创建连接Promise，避免重复连接
    global.mongoose.promise = mongoose.connect(mongoUri, options)
      .then(mongooseInstance => {
        console.log('✅ MongoDB connection promise resolved');
        
        // 设置连接事件监听
        mongooseInstance.connection.on('error', (error) => {
          console.error('💥 数据库运行时错误:', error.message);
        });
        
        mongooseInstance.connection.on('disconnected', () => {
          console.warn('⚠️ 数据库连接已断开（Serverless单次请求结束）');
          // 在Serverless环境中，连接断开时清除缓存
          if (global.mongoose) {
            global.mongoose.conn = null;
          }
        });
        
        mongooseInstance.connection.on('reconnected', () => {
          console.log('🔄 数据库重新连接成功');
        });
        
        return mongooseInstance.connection;
      });

    // 等待连接建立
    global.mongoose.conn = await global.mongoose.promise;
    
    console.log('✅ 数据库连接成功!');
    console.log('📊 连接详情:', {
      host: global.mongoose.conn.host,
      database: global.mongoose.conn.name,
      readyState: global.mongoose.conn.readyState,
      protocol: 'IPv4',
      integration: 'Vercel Native Integration'
    });

    return global.mongoose.conn;

  } catch (error: any) {
    console.error('💥 数据库初始化失败!');
    console.error('📋 错误详情:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.slice(0, 200) // 缩短堆栈，方便查看核心错误
    });

    if (process.env.VERCEL) {
      console.error('☁️ 已配置强制IPv4+超长超时，仍失败请检查Atlas连接串有效性');
      process.exit(1);
    }
    
    // 连接失败时，清除缓存以便重试
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }

    throw error;
  }
};

export default connectDB;