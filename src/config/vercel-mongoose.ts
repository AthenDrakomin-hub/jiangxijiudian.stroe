import mongoose, { ConnectOptions, Connection } from 'mongoose';

/**
 * 适配Vercel Serverless的MongoDB连接方法
 * 直接引用Vercel自动生成的只读MONGODB_URI，无需手动配置
 */
let connectTimeout: NodeJS.Timeout;

const connectDB = async (): Promise<Connection> => {
  try {
    console.log('🔄 初始化数据库连接...');
    console.log('🔧 环境:', process.env.NODE_ENV || 'development');
    console.log('☁️ Vercel环境:', !!process.env.VERCEL);
    console.log('📡 MongoDB URI配置:', !!process.env.MONGODB_URI);

    // 新增：连接超时强制提示（15秒后未完成则输出日志）
    connectTimeout = setTimeout(() => {
      console.error('⚠️ 数据库连接超时（15秒未完成），Vercel冷启动可能存在网络延迟');
    }, 15000);

    // Vercel Serverless核心适配配置（动态IP/无连接池/网络延迟适配）
    const options: ConnectOptions = {
      maxPoolSize: 1,        // 禁用连接池，适配Serverless短暂连接特性
      minPoolSize: 0,
      maxIdleTimeMS: 10000,  // 连接空闲超时，及时释放资源
      serverSelectionTimeoutMS: 15000, // 延长到15秒（适配Vercel跨区域网络延迟）
      connectTimeoutMS: 15000,        // 延长到15秒
      socketTimeoutMS: 60000,         // 延长到60秒
      family: 4,             // 优先IPv4，避免域名解析问题
      retryWrites: true,
      writeConcern: { w: 'majority' }
    };

    // ========== 核心修改：替换为你的实际目标库名 ==========
    const TARGET_DB_NAME = 'JIANGXIJIUDIAN'; // 例：TARGET_DB_NAME = 'jiangxi-hotel'
    let mongoUri = process.env.MONGODB_URI!;
    // 自动拼接目标库名，保留原有连接串查询参数（不影响连接）
    if (!mongoUri.includes(`/${TARGET_DB_NAME}?`)) {
      mongoUri = mongoUri.replace('/?', `/${TARGET_DB_NAME}?`) || `${mongoUri}/${TARGET_DB_NAME}`;
    }
    // ======================================================

    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI环境变量未设置（请确认Vercel已关联MongoDB：Storage→MongoDB）');
    }

    console.log('🔗 开始连接Vercel原生MongoDB集群...');
    const connection = await mongoose.connect(mongoUri, options); // 用拼接后的新地址连接

    // 连接成功后清除超时
    clearTimeout(connectTimeout);

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
    // 连接失败时清除超时并输出日志
    clearTimeout(connectTimeout);
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