"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isS3Configured = exports.S3_BUCKET = exports.S3_SECRET_KEY = exports.S3_ACCESS_KEY = exports.S3_REGION = exports.S3_ENDPOINT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// S3 配置 - 用于客户端直接连接 Supabase 存储
const S3_ENDPOINT = process.env.S3_ENDPOINT;
exports.S3_ENDPOINT = S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION || 'auto'; // Supabase 默认区域
exports.S3_REGION = S3_REGION;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
exports.S3_ACCESS_KEY = S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
exports.S3_SECRET_KEY = S3_SECRET_KEY;
const S3_BUCKET = process.env.S3_BUCKET || 'dishes'; // 默认bucket名称
exports.S3_BUCKET = S3_BUCKET;
// 检查 S3 配置是否完整
const isS3Configured = () => {
    return !!(S3_ENDPOINT && S3_ACCESS_KEY && S3_SECRET_KEY && S3_BUCKET);
};
exports.isS3Configured = isS3Configured;
exports.default = {
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
    bucket: S3_BUCKET
};
