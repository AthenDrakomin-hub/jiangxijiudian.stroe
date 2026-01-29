# 江西酒店项目 - Vercel 与 MongoDB Atlas 集成部署指南

## 1. 项目概述

这是一个基于 Express + TypeScript + Mongoose 构建的 Node.js 后端项目，专门适配 Vercel Serverless 环境和 MongoDB Atlas 数据库。

## 2. 部署前准备

### 2.1 项目依赖检查
确保项目中包含以下关键依赖：
- `@vercel/node` - Vercel Node.js 运行时
- `mongoose` - MongoDB 对象文档映射器
- `express` - Web 应用框架
- `typescript` - 类型安全

### 2.2 环境变量配置
项目需要以下环境变量：
- `MONGODB_URI` - MongoDB Atlas 连接字符串（Vercel 原生集成自动提供）
- `JWT_SECRET` - JWT 令牌加密密钥
- `FRONTEND_URL` - 前端应用 URL（用于 CORS）

## 3. Vercel 与 MongoDB Atlas 原生集成设置

### 3.1 在 Vercel 中安装 MongoDB Atlas 集成

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入您的项目页面
3. 点击 "Settings" -> "Integrations"
4. 搜索 "MongoDB Atlas"
5. 点击 "Add Integration"

### 3.2 配置集成

1. 选择 "Native Integration"（原生集成）
2. 接受服务条款
3. 选择合适的集群层级（推荐免费层级用于开发）
4. 选择地理位置（建议选择靠近用户的位置）
5. 选择安装计划（免费或付费）
6. 输入数据库名称
7. 点击 "Create MongoDB Atlas Cluster"

### 3.3 集成验证

集成完成后，Vercel 会自动配置以下内容：
- MongoDB Atlas 集群
- 网络访问权限（自动添加 0.0.0.0/0 到 IP 白名单）
- 数据库用户和权限
- 环境变量（MONGODB_URI）

## 4. 项目配置优化

### 4.1 vercel.json 配置

```json
{
  "version": 2,
  "env": {
    "NODE_ENV": "production"
  }
}
```

或者，如果您想使用更明确的配置：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**注意**：由于项目使用了 Vercel API Routes（位于 `api/index.ts`），Vercel 会自动检测并处理构建过程，因此简单的配置即可正常工作。

### 4.2 数据库连接优化

项目已包含针对 Vercel Serverless 环境优化的数据库连接配置：

- 连接池大小限制为 1，适应 Serverless 短暂连接特性
- 增加超时时间以应对网络延迟
- 强制使用 IPv4 协议
- 实现连接复用机制，避免重复连接

## 5. 部署流程

### 5.1 通过 Git 部署（推荐）

1. 将项目推送至 GitHub/GitLab/Bitbucket：
```bash
git add .
git commit -m "feat: 准备 Vercel 部署"
git push origin main
```

2. 在 Vercel Dashboard 中导入项目
3. Vercel 会自动检测项目类型并开始构建

### 5.2 通过 Vercel CLI 部署

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录并部署：
```bash
vercel login
vercel --prod
```

## 6. 部署后验证

### 6.1 健康检查

部署完成后，访问以下 URL 验证服务状态：
```
https://your-project-name.vercel.app/health
```

预期响应：
```json
{
  "status": "ok",
  "service": "jx-server-ts",
  "db": {
    "status": "connected",
    "readyState": 1
  },
  "timestamp": "2026-01-29T00:00:00.000Z"
}
```

### 6.2 功能测试

1. 测试根路径：
```
https://your-project-name.vercel.app/
```

2. 测试 API 接口：
```
https://your-project-name.vercel.app/api/auth/login
```

## 7. 常见问题排查

### 7.1 数据库连接失败

**症状**：健康检查返回 `db.status: disconnected`

**解决方案**：
1. 确认 Vercel 已成功集成 MongoDB Atlas
2. 检查 Vercel 环境变量中是否包含 `MONGODB_URI`
3. 验证 MongoDB Atlas 网络访问设置中是否包含 `0.0.0.0/0`

### 7.2 CORS 错误

**症状**：前端请求出现跨域错误

**解决方案**：
1. 确认前端域名已在 CORS 配置中添加
2. 检查 Vercel 项目设置中的环境变量

### 7.3 构建失败

**症状**：Vercel 构建阶段出现错误

**解决方案**：
1. 检查依赖项是否完整
2. 验证 TypeScript 编译错误
3. 确认 `vercel.json` 配置正确

## 8. 性能优化建议

### 8.1 数据库连接优化
- 项目已实现连接复用机制，减少连接开销
- 适当调整连接池大小和超时设置

### 8.2 API 响应优化
- 实施缓存策略减少数据库查询
- 使用索引优化数据库查询性能

### 8.3 Serverless 优化
- 最小化打包体积
- 优化冷启动时间

## 9. 安全考虑

### 9.1 数据库安全
- 使用强密码保护数据库访问
- 定期轮换数据库凭据
- 限制 IP 白名单范围（生产环境）

### 9.2 API 安全
- 实施速率限制防止滥用
- 使用 HTTPS 加密传输
- 验证和清理所有输入数据

## 10. 监控和维护

### 10.1 日志监控
- 利用 Vercel 日志系统监控应用运行状态
- 实施错误追踪和报告机制

### 10.2 数据库监控
- 使用 MongoDB Atlas 监控工具
- 设置性能告警

### 10.3 自动化部署
- 配置 CI/CD 管道
- 实施自动化测试

## 11. 故障排除

### 11.1 部署故障
- 检查 Vercel 构建日志
- 验证依赖项兼容性
- 确认环境变量配置

### 11.2 连接故障
- 检查网络连通性
- 验证连接字符串格式
- 确认认证凭据正确

### 11.3 性能问题
- 分析慢查询日志
- 优化数据库索引
- 考虑缓存策略

---

此指南提供了将江西酒店项目成功部署到 Vercel 并集成 MongoDB Atlas 的完整流程。如有问题，请参考相关文档或寻求技术支持。