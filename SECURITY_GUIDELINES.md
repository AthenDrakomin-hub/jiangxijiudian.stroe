# 安全配置指南

## 环境变量安全

### 本地开发环境
- 将包含真实凭据的 `.env` 文件添加到 `.gitignore` 中
- 使用 `.env.example` 作为模板，其中包含占位符而非真实凭据

### 生产环境部署
- 在 Vercel 控制台中配置环境变量
- 绝不在代码中硬编码真实凭据

## 环境变量配置示例

在 Vercel 项目设置中配置以下环境变量：

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
FRONTEND_URL=your_frontend_domain
```

### MongoDB Atlas 连接字符串格式

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

请替换：
- `<username>`: MongoDB Atlas 用户名
- `<password>`: MongoDB Atlas 用户密码
- `<cluster>`: 集群名称
- `<database>`: 数据库名称

## 安全注意事项

1. **凭据保护**: 绝不在代码库中存储真实凭据
2. **访问控制**: 限制对环境变量的访问权限
3. **定期轮换**: 定期更换数据库密码和JWT密钥
4. **网络白名单**: 在 MongoDB Atlas 中配置 IP 白名单