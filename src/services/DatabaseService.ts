import mongoose from 'mongoose';
import { EventEmitter } from 'events';

class DatabaseService extends EventEmitter {
  private isConnected: boolean = false;

  async connect(uri?: string): Promise<void> {
    if (this.isConnected) {
      console.log('Database is already connected');
      return;
    }

    try {
      const connectionString = uri || process.env.MONGODB_URI;

      if (!connectionString) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }

      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions);

      this.isConnected = true;
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);

      // 监听连接事件
      mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
        this.emit('connected');
      });

      mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
        this.emit('error', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected from DB');
        this.isConnected = false;
        this.emit('disconnected');
      });

      // 处理进程关闭时的优雅断开
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      console.error('Database connection error:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB Disconnected');
    }
  }

  getConnectionState(): boolean {
    return this.isConnected;
  }

  getConnection(): typeof mongoose {
    return mongoose;
  }
}

export default new DatabaseService();