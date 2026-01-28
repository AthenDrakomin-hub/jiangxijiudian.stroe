import fs from 'fs';
import path from 'path';

console.log('🚀 准备部署到 Vercel...');

// 检查必要的文件
const requiredFiles = [
  'vercel.json',
  'package.json',
  'tsconfig.json',
  'src/server.ts'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ 必需文件不存在: ${file}`);
    process.exit(1);
  }
}

console.log('✅ 所有必需文件存在');

// 检查 package.json 中的构建脚本
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.scripts.build) {
  console.error('❌ package.json 中缺少 build 脚本');
  process.exit(1);
}

console.log('✅ 构建脚本存在');

// 确保 dist 目录存在
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
  console.log('✅ 创建了 dist 目录');
} else {
  console.log('✅ dist 目录已存在');
}

// 检查环境变量配置
const envFilePath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envFilePath)) {
  console.warn('⚠️ .env 文件不存在 - 在 Vercel 上部署时需要在环境变量中配置');
} else {
  console.log('✅ .env 文件存在（注意：生产环境不应提交此文件）');
}

console.log('\n📋 部署准备完成清单:');
console.log('1. 确保 MongoDB Atlas 数据库已创建');
console.log('2. 在 Vercel 项目设置中配置环境变量:');
console.log('   - MONGODB_URI: MongoDB Atlas 连接字符串');
console.log('   - JWT_SECRET: JWT 密钥');
console.log('   - NODE_ENV: production');
console.log('   - FRONTEND_URL: 前端域名');
console.log('3. 推送代码到 GitHub/GitLab');
console.log('4. 在 Vercel 仪表板导入项目');
console.log('5. 验证部署状态');
console.log('\n📖 更多信息请参阅 DEPLOYMENT_VERCEL.md');

console.log('\n🎉 部署准备就绪！');