# Vercel 部署清单

## 环境变量配置

在 Vercel 控制台中设置以下环境变量：

### 必需环境变量
- `MONGODB_URI` - MongoDB Atlas 连接字符串
  - 示例: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority`

### 可选环境变量
- `NODE_ENV` - 环境标识 (development/production)，默认为 production
- `PORT` - 端口号，Vercel 会自动处理，一般无需设置

## 部署步骤

1. 在 Vercel 项目设置中添加上述环境变量
2. 确保 GitHub 仓库已连接到 Vercel
3. 部署将自动触发，使用 vercel.json 中的配置

## API 端点

部署后可通过以下端点访问 API：
- `/{path}` - 通用 API 端点
- `/health` - 健康检查
- `/api/rooms/:roomNumber` - 获取房间信息
- `/api/dishes` - 获取菜品列表
- `/api/orders` - 订单相关操作
- `/api/orders/:id` - 获取特定订单

## 注意事项

- 项目已配置为 Serverless 环境优化，包括数据库连接复用
- CORS 已配置为允许所有来源（生产环境中应指定具体域名）
- 种子数据脚本 (`npm run seed`) 仅用于本地或初始化数据库，不应在生产环境中运行