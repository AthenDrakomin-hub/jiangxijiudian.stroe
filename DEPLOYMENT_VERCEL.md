# Vercel 部署指南

本文档详细介绍如何将本项目部署到 Vercel 平台并关联 MongoDB 数据库。

## 前提条件

1. 注册 Vercel 账号
2. 安装 Vercel CLI（可选）：`npm i -g vercel`
3. 拥有 MongoDB Atlas 账号

## 部署步骤

### 1. 在 Vercel 上创建项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 连接您的 GitHub/GitLab/Bitbucket 账号
4. 选择包含此项目的仓库
5. 点击 "Import"

### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

#### 获取 MongoDB Atlas 连接字符串：

1. 访问 [MongoDB Atlas](https://cloud.mongodb.com/)
2. 创建集群（如需要）
3. 在 "Database Access" 中创建数据库用户
4. 在 "Network Access" 中添加 IP 白名单（或允许所有 IP）
5. 在 "Clusters" 页面点击 "Connect"
6. 选择 "Connect your application"
7. 复制连接字符串并替换 `<password>` 为数据库用户密码

示例格式：
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority
```

### 3. 配置构建设置

在 Vercel 项目设置中配置：

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. 部署

配置完成后，Vercel 会自动从 Git 提交中部署应用。

## 部署后验证

### 1. 检查部署状态

访问 Vercel 仪表板查看部署日志，确保没有错误。

### 2. 测试健康检查接口

访问 `https://your-project-name.vercel.app/health`，应返回类似：

```json
{
  "status": "ok",
  "service": "jx-server-ts",
  "db": {
    "status": "connected",
    "readyState": 1,
    "message": "数据库连接正常"
  },
  "timestamp": "2026-01-29T00:00:00.000Z",
  "uptime": 10.123456
}
```

### 3. 测试登录功能

发送 POST 请求到 `https://your-project-name.vercel.app/api/auth/login`，使用以下格式：

```json
{
  "email": "admin@jx.com",
  "password": "123456"
}
```

## 故障排除

### 部署失败

1. 检查 `vercel.json` 配置
2. 确认环境变量已正确设置
3. 查看 Vercel 构建日志

### 数据库连接失败

1. 确认 `MONGODB_URI` 环境变量格式正确
2. 检查 MongoDB Atlas 的 IP 白名单设置
3. 确认数据库用户名和密码正确

### 登录失败

1. 确认数据库中有正确的用户数据
2. 如需要，重新运行数据种子脚本部署到数据库

## 自动化部署

配置 Git Hooks 以实现代码推送后自动部署：

1. 在 Vercel 项目设置中启用 "Production Branch" 自动部署
2. 每次推送到主分支时，Vercel 会自动重新构建和部署

## 注意事项

1. Vercel Serverless 函数有执行时间限制（通常为 10 秒），配置已针对此优化
2. MongoDB 连接配置已适配 Vercel 的无服务器环境
3. 保持环境变量的安全性，不要硬编码在代码中