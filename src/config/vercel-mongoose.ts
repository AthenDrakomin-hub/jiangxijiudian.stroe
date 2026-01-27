import mongoose, { ConnectOptions, Connection } from 'mongoose';

const connectDB = async (): Promise<Connection> => {
  try {
    // 保留禁用缓冲（之前已验证有效）
    mongoose.set('bufferCommands', false);
    console.log('📌 已禁用Mongoose操作缓冲，避免Serverless冷启动超时');

    console.log('🔄 初始化数据库连接...');
    console.log('🔧 环境:', process.env.NODE_ENV || 'development');
    console.log('☁️ Vercel环境:', !!process.env.VERCEL);
    console.log('📡 MongoDB URI配置:', !!process.env.MONGODB_URI);

    // ========== 仅改这1处：替换为你的实际目标库名 ==========
    const TARGET_DB_NAME = process.env.DB_NAME || 'atlas-sky-ball'; // 使用atlas-sky-ball集群
    // ======================================================

    // 保留库名拼接逻辑（无需修改）
    let mongoUri = process.env.MONGODB_URI!;
    if (!mongoUri.includes(`/${TARGET_DB_NAME}?`)) {
      mongoUri = mongoUri.replace('/?', `/${TARGET_DB_NAME}?`) || `${mongoUri}/${TARGET_DB_NAME}`;
    }
    console.log('🔗 拼接后连接串:', mongoUri.slice(0, 50) + '***'); // 隐藏密码，仅看前50位

    // ========== 核心强制适配配置（解决网络/解析/超时问题） ==========
    const options: ConnectOptions = {
      maxPoolSize: 1,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      // 大幅延长超时，适配所有网络延迟
      serverSelectionTimeoutMS: 30000, // 30秒：服务器选择超时
      connectTimeoutMS: 30000,        // 30秒：连接握手超时
      socketTimeoutMS: 60000,         // 60秒：socket通信超时
      family: 4,                      // 强制启用IPv4（核心！避免IPv6解析问题）
      retryWrites: true,
      writeConcern: { w: 'majority' }
    };
    // ==============================================================


    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI环境变量未设置（请确认Vercel已关联MongoDB）');
    }

    console.log('🔍 强制IPv4连接Atlas集群...');
    const connection = await mongoose.connect(mongoUri, options);

    // 双重校验就绪状态
    if (connection.connection.readyState !== 1) {
      throw new Error(`❌ 连接状态异常，readyState=${connection.connection.readyState}`);
    }

    console.log('✅ 数据库连接成功!');
    console.log('📊 连接详情:', {
      host: connection.connection.host,
      database: connection.connection.name,
      readyState: connection.connection.readyState,
      protocol: 'IPv4' // 确认使用IPv4
    });

    // 保留连接事件监听
    connection.connection.on('error', (error) => {
      console.error('💥 数据库运行时错误:', error.message);
    });
    connection.connection.on('disconnected', () => {
      console.warn('⚠️ 数据库连接已断开（Serverless单次请求结束）');
    });

    return connection.connection;

  } catch (error: any) {
    console.error('💥 数据库初始化失败!');
    console.error('📋 错误详情:', {
      message: error.message,
      name: error.name,
      stack: error.stack.slice(0, 200) // 缩短堆栈，方便查看核心错误
    });

    if (process.env.VERCEL) {
      console.error('☁️ 已配置强制IPv4+超长超时，仍失败请检查Atlas连接串有效性');
      process.exit(1);
    }

    throw error;
  }
};

export default connectDB;