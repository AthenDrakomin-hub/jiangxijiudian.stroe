import dotenv from 'dotenv';

dotenv.config();

// S3 配置 - 用于客户端直接连接 Supabase 存储
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION || 'auto'; // Supabase 默认区域
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const S3_BUCKET = process.env.S3_BUCKET || 'dishes'; // 默认bucket名称

// 检查 S3 配置是否完整
const isS3Configured = () => {
  return !!(S3_ENDPOINT && S3_ACCESS_KEY && S3_SECRET_KEY && S3_BUCKET);
};

// 导出 S3 配置信息
export {
  S3_ENDPOINT,
  S3_REGION,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
  S3_BUCKET,
  isS3Configured
};

export default {
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  bucket: S3_BUCKET
};