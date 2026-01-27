import mongoose, { ConnectOptions, Connection } from 'mongoose';

const connectDB = async (): Promise<Connection> => {
  try {
    // ========== 新增1：禁用Mongoose操作缓冲（核心解决超时） ==========
    mongoose.set('bufferCommands', false); // 禁用所有模型的操作缓冲
    // mongoose.set('bufferMaxEntries', 0);   // 该选项在新版本中已废弃
    console.log('📌 已禁用Mongoose操作缓冲，避免Serverless冷启动超时');
    // ==================================================================

    console.log('🔄 初始化数据库连接...');
    console.log('🔧 环境:', process.env.NODE_ENV || 'development');
    console.log('☁️ Vercel环境:', !!process.env.VERCEL);
    console.log('📡 MongoDB URI配置:', !!process.env.MONGODB_URI);

    // 保留你已设置的【实际目标库名】拼接逻辑（无需修改）
    const TARGET_DB_NAME = process.env.DB_NAME || 'JIANGXIJIUDIAN'; // 使用动态获取的数据库名
    let mongoUri = process.env.MONGODB_URI!;
    if (!mongoUri.includes(`/${TARGET_DB_NAME}?`)) {
      mongoUri = mongoUri.replace('/?', `/${TARGET_DB_NAME}?`) || `${mongoUri}/${TARGET_DB_NAME}`;
    }

    // ========== 修改2：优化连接池配置（消除池释放警告） ==========
    const options: ConnectOptions = {
      maxPoolSize: 1,        
      minPoolSize: 1, // 与maxPoolSize一致，避免池频繁释放/重建
      maxIdleTimeMS: 30000, // 延长空闲超时，适配Serverless请求间隔
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      family: 4,             
      retryWrites: true,
      writeConcern: { w: 'majority' }
    };
    // ==================================================================

    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI环境变量未设置（请确认Vercel已关联MongoDB）');
    }

    console.log('🔗 开始连接Vercel原生MongoDB集群...');
    const connection = await mongoose.connect(mongoUri, options);

    // ========== 新增3：显式校验连接最终就绪状态（双重保障） ==========
    if (connection.connection.readyState !== 1) {
      throw new Error('❌ 数据库连接日志显示成功，但实际就绪状态异常，readyState=' + connection.connection.readyState);
    }
    // ==================================================================

    console.log('✅ 数据库连接成功!');
    console.log('📊 连接详情:', {
      host: connection.connection.host,
      database: connection.connection.name, // 显示你的实际目标库名
      readyState: connection.connection.readyState // 1=完全就绪
    });

    // 保留原有连接事件监听（无需修改）
    connection.connection.on('error', (error) => {
      console.error('💥 数据库连接运行时错误:', error.message, error.stack);
    });
    connection.connection.on('disconnected', () => {
      console.warn('⚠️ 数据库连接已断开');
    });
    connection.connection.on('reconnected', () => {
      console.log('🔄 数据库重新连接成功');
    });

    return connection.connection;

  } catch (error: any) {
    console.error('💥 数据库初始化失败!');
    console.error('📋 错误详情:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    if (process.env.VERCEL) {
      console.error('☁️ 请确认Vercel MongoDB资源已激活（Storage→MongoDB→状态为Connected）');
      process.exit(1);
    }

    throw error;
  }
};

// 导出连接实例
export default connectDB;