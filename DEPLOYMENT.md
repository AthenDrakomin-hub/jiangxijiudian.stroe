# 部署指南

## Vercel 一键部署配置

本项目已配置为可在 Vercel 上一键部署。

### 部署步骤

1. 将项目推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 在部署设置中配置以下环境变量：
   - `MONGODB_URI`: MongoDB 数据库连接字符串
   - `NODE_ENV`: production (可选)

### 构建脚本

项目使用以下构建脚本：
- `npm run build:full`: 完整构建前后端的脚本，Vercel 会自动执行

### 项目结构

- 后端：Node.js + Express + TypeScript，位于根目录
- 前端：React + TypeScript + Tailwind CSS，位于 `frontend/` 目录
- 前端构建产物会输出到 `frontend/build` 目录
- 后端会在生产环境中托管前端静态文件

### API 路由

- `/api/*`: 后端 API 接口
- `/*`: 前端 SPA 路由（非 API 请求）

### 环境变量

- 开发环境：前端 API 请求发送到 `http://localhost:4000/api`
- 生产环境：前端 API 请求使用相对路径 `/api`