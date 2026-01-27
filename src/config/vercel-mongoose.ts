import mongoose, { ConnectOptions, Connection } from 'mongoose';

/**
 * 适配Vercel Serverless的MongoDB连接方法
 * 直接引用Vercel自动生成的只读MONGODB_URI，无需手动配置
 */
const connectDB = async (): Promise<Connection> => {
  try {
    console.log('🔄 初始化数据库连接...');
    console.log('🔧 环境:', process.env.NODE_ENV || 'development');
    console.log('☁️ Vercel环境:', !!process.env.VERCEL);
    console.log('📡 MongoDB URI配置:', !!process.env.MONGODB_URI);

    // Vercel Serverless核心适配配置（动态IP/无连接池/网络延迟适配）
    const options: ConnectOptions = {
      maxPoolSize: 1,        // 禁用连接池，适配Serverless短暂连接特性
      minPoolSize: 0,
      maxIdleTimeMS: 10000,  // 连接空闲超时，及时释放资源
      serverSelectionTimeoutMS: 8000, // 延长超时，适配Vercel跨区域网络延迟
      socketTimeoutMS: 45000,
      family: 4,             // 优先IPv4，避免域名解析问题
      retryWrites: true,
      writeConcern: { w: 'majority' }
    };

    // 校验Vercel自动生成的MONGODB_URI
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI环境变量未设置（请确认Vercel已关联MongoDB：Storage→MongoDB）');
    }

    console.log('🔗 开始连接Vercel原生MongoDB集群...');
    const connection = await mongoose.connect(process.env.MONGODB_URI, options);

    // 连接成功日志（关键排查信息）
    console.log('✅ 数据库连接成功!');
    console.log('📊 连接详情:', {
      host: connection.connection.host,
      database: connection.connection.name,
      readyState: connection.connection.readyState // 1=连接成功
    });

    // 数据库连接事件监听（便于排查运行时问题）
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

    // Vercel生产环境连接失败直接终止，避免无效运行
    if (process.env.VERCEL) {
      console.error('☁️ 请检查：Vercel项目是否已正确关联MongoDB（Storage→MongoDB）');
      process.exit(1);
    }

    throw error;
  }
};

export default connectDB;