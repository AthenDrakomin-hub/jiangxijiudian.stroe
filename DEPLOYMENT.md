# 部署指南

## Vercel 一键部署配置

本项目已配置为可在 Vercel 上一键部署为纯后端API服务。

### 部署步骤

1. 将项目推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 在部署设置中配置以下环境变量：
   - `MONGODB_URI`: Vercel自动关联的MongoDB数据库连接字符串
   - `JWT_SECRET`: JWT密钥，用于用户认证
   - `NODE_ENV`: production (可选)

### 构建脚本

项目使用以下构建脚本：
- `npm run build`: 编译TypeScript代码为JavaScript，Vercel会自动执行

### 项目结构

- 后端：Node.js + Express + TypeScript，位于根目录
- 专门适配Vercel Serverless环境的MongoDB连接
- 提供RESTful API服务，不包含前端代码

### API 路由

- `/api/*`: 后端 API 接口
- `/health`: 健康检查接口
- `/*`: 根路由返回服务状态

### 环境变量

- `MONGODB_URI`: 由Vercel自动提供（如果已关联MongoDB）
- `JWT_SECRET`: 用于生成和验证JWT令牌