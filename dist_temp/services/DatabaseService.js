"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const events_1 = require("events");
class DatabaseService extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.isConnected = false;
    }
    async connect(uri) {
        if (this.isConnected) {
            console.log('Database is already connected');
            return;
        }
        try {
            const connectionString = uri || process.env.MONGODB_URI;
            if (!connectionString) {
                throw new Error('MONGODB_URI environment variable is not defined');
            }
            await mongoose_1.default.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.isConnected = true;
            console.log(`MongoDB Connected: ${mongoose_1.default.connection.host}`);
            // 监听连接事件
            mongoose_1.default.connection.on('connected', () => {
                console.log('Mongoose connected to DB');
                this.emit('connected');
            });
            mongoose_1.default.connection.on('error', (err) => {
                console.error('Mongoose connection error:', err);
                this.emit('error', err);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('Mongoose disconnected from DB');
                this.isConnected = false;
                this.emit('disconnected');
            });
            // 处理进程关闭时的优雅断开
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
        catch (error) {
            console.error('Database connection error:', error);
            this.emit('error', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.isConnected) {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('MongoDB Disconnected');
        }
    }
    getConnectionState() {
        return this.isConnected;
    }
    getConnection() {
        return mongoose_1.default;
    }
}
exports.default = new DatabaseService();
