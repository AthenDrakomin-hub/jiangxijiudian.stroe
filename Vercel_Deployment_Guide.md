# Vercel 部署架构说明与最佳实践

## 项目架构概述

本项目采用了混合架构模式，包含两套服务入口：

1. **Vercel API Routes** (`api/index.ts`) - 用于 Vercel 部署的主要入口
2. **Express 服务器** (`src/server.ts`) - 用于本地开发和传统部署

## Vercel 部署配置说明

### 推荐配置 (当前使用)

```json
{
  "version": 2,
  "env": {
    "NODE_ENV": "production"
  }
}
```

这种配置利用了 Vercel 的自动检测功能：
- Vercel 自动识别 `api/index.ts` 作为 API Route
- 自动处理 TypeScript 编译
- 自动配置运行时环境

### 优点
- 配置简洁，不易出错
- 遵循 Vercel 的约定优于配置原则
- 避免与 Vercel 控制台设置冲突

### 替代配置（如需更精确控制）

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

## 为什么移除了 builds 配置

之前版本的 `vercel.json` 包含了 `builds` 配置，这会导致以下问题：

1. **配置冲突**：`builds` 配置会覆盖 Vercel 项目控制台中的构建设置
2. **架构不匹配**：配置指向 `src/server.ts`，但部署时使用 API Routes 模式
3. **复杂性增加**：不必要的构建配置增加了部署复杂度

## API Routes 与 Express 应用的区别

### API Routes (`api/index.ts`)
- 每个请求独立处理，适合无状态操作
- 自动伸缩，按需执行
- 更好的冷启动性能
- 适合微服务架构

### Express 应用 (`src/server.ts`)
- 保持长期运行的服务实例
- 适合需要状态保持的应用
- 更适合传统 Web 服务器模式

## 部署验证步骤

1. **本地测试**：
   ```bash
   npm run dev
   ```

2. **构建测试**：
   ```bash
   npm run build
   ```

3. **部署到 Vercel**：
   ```bash
   git push origin main  # 如果使用 Git 集成
   # 或
   vercel --prod         # 如果使用 CLI
   ```

4. **验证部署**：
   - 访问 `https://your-project-name.vercel.app/health`
   - 验证数据库连接状态
   - 测试 API 接口功能

## 故障排除

### 503 错误排查
按照以下优先级检查：
1. 部署构建：确认 TS 编译结果、依赖安装
2. 函数配置：验证 API Route 导出格式、环境变量
3. 资源限制：监控执行超时（10秒）、内存使用、MongoDB 连接超时
4. 平台状态：确认 Vercel 区域状态与 MongoDB Atlas 连通性

### 数据库连接问题
- 确认 Vercel 已集成 MongoDB Atlas
- 检查环境变量中 `MONGODB_URI` 是否正确配置
- 验证 MongoDB Atlas 网络访问设置包含 `0.0.0.0/0`

## 最佳实践

1. **配置管理**：使用简洁的 `vercel.json` 配置，依赖 Vercel 自动检测
2. **环境变量**：在 Vercel 项目设置中配置敏感信息
3. **日志监控**：使用 Vercel 日志系统监控应用运行状态
4. **错误处理**：在 API Routes 中实现适当的错误处理机制