import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

// 全局MongoClient实例，确保在Vercel Functions间共享
let cachedClient: MongoClient | null = null;

/**
 * 适配Vercel Serverless的MongoDB连接方法
 * 使用Vercel原生MongoDB集成和连接池管理
 */
const connectDB = async (): Promise<MongoClient> => {
  try {
    console.log('🔄 初始化Vercel原生MongoDB连接...');
    console.log('🔧 环境:', process.env.NODE_ENV || 'development');
    console.log('☁️ Vercel环境:', !!process.env.VERCEL);
    console.log('📡 MongoDB URI配置:', !!process.env.MONGODB_URI);

    // 复用已存在的连接
    if (cachedClient) {
      console.log('🔄 复用已存在的数据库连接');
      return cachedClient;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI环境变量未设置（请确认Vercel已关联MongoDB：Storage→MongoDB）');
    }

    // Vercel推荐的MongoDB配置
    const options: MongoClientOptions = {
      appName: "jx-server-ts",
      maxIdleTimeMS: 10000,  // 连接空闲超时
      serverSelectionTimeoutMS: 15000, // 服务发现超时
      connectTimeoutMS: 15000,        // 连接建立超时
      socketTimeoutMS: 60000,         // 套接字超时
    };

    console.log('🔗 创建新的MongoDB客户端连接...');
    const client = new MongoClient(process.env.MONGODB_URI, options);
    
    // 附加数据库连接池管理（Vercel Functions最佳实践）
    attachDatabasePool(client);
    
    // 连接到数据库
    await client.connect();
    
    // 缓存连接实例
    cachedClient = client;
    
    console.log('✅ 数据库连接成功!');
    console.log('📊 连接详情: 数据库连接已建立');

    return client;

  } catch (error: any) {
    console.error('💥 数据库初始化失败!');
    console.error('📋 错误详情:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // Vercel生产环境连接失败直接终止
    if (process.env.VERCEL) {
      console.error('☁️ Vercel MongoDB连接失败，请检查Storage→MongoDB配置');
      process.exit(1);
    }

    throw error;
  }
};

// 导出模块作用域的MongoClient以确保跨函数共享
export default connectDB;

// 为了兼容现有代码，提供获取数据库实例的方法
export const getDatabase = async () => {
  const client = await connectDB();
  // 从MONGODB_URI中提取数据库名称，或使用默认值
  const dbName = process.env.DB_NAME || extractDbNameFromUri(process.env.MONGODB_URI) || 'defaultdb';
  return client.db(dbName); // 使用动态数据库名
};

// 从MongoDB连接字符串中提取数据库名的辅助函数
const extractDbNameFromUri = (uri: string | undefined): string | null => {
  if (!uri) return null;
  try {
    const url = new URL(uri);
    // 从路径中提取数据库名 (mongodb+srv://.../database_name?...)
    const dbName = url.pathname.split('/')[1];
    return dbName || null;
  } catch (error) {
    console.warn('⚠️ 无法从MONGODB_URI中解析数据库名称:', error);
    return null;
  }
};