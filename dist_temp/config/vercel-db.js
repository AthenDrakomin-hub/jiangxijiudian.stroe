"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const functions_1 = require("@vercel/functions");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 确保MONGODB_URI环境变量已设置
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
// 配置MongoDB客户端选项
const options = {
    appName: "jx-restaurant-api",
    maxIdleTimeMS: 5000, // 5秒空闲时间后断开连接
    serverSelectionTimeoutMS: 10000, // 10秒服务器选择超时
    connectTimeoutMS: 10000, // 10秒连接超时
    socketTimeoutMS: 45000, // 45秒socket超时
    retryWrites: true, // 启用重试写入
    retryReads: true, // 启用重试读取
    ssl: true, // 显式开启TLS
    tls: true
};
// 创建MongoClient实例
const client = new mongodb_1.MongoClient(MONGODB_URI, options);
// Attach the client to ensure proper cleanup on function suspension
(0, functions_1.attachDatabasePool)(client);
// 导出模块作用域的MongoClient以确保客户端可以在函数间共享
exports.default = client;
