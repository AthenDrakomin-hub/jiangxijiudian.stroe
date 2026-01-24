# 江云厨智能点餐系统

这是一个完整的餐厅点餐管理系统，包含前端用户界面和后端API服务。

## 项目结构

```
.
├── src/                    # 后端源码
│   ├── config/             # 数据库配置
│   ├── controllers/        # 控制器
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   ├── services/           # 服务层
│   ├── utils/              # 工具函数
│   └── server.ts           # 主服务器文件
├── frontend/               # 前端源码 (React + TypeScript + Tailwind CSS)
│   ├── public/             # 静态资源
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── utils/          # 工具函数
│   │   └── App.tsx         # 应用主组件
│   └── package.json
├── package.json            # 项目配置
└── vercel.json             # Vercel部署配置
```

## 功能特性

### 顾客点餐页 (/guest?room=8201)
- 自动获取菜品列表
- 显示房间号信息
- 购物车功能
- 订单提交

### 订单管理中心 (/admin/orders)
- 实时订单列表
- 订单状态管理
- 自动刷新功能

## 环境要求

- Node.js 18+ 
- MongoDB (本地或云端)

## 安装与运行

### 开发模式

1. 安装依赖：
```bash
npm install
cd frontend && npm install
```

2. 设置环境变量：
```bash
# 根目录下复制环境变量文件
cp .env.example .env
# 修改 .env 文件中的数据库连接字符串
```

3. 运行开发服务器：
```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

这将同时构建前端和后端代码。

### 运行生产版本

```bash
npm start
```

## API 接口

- `GET /api/dishes` - 获取菜品列表
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取所有订单
- `PATCH /api/orders/:id/status` - 更新订单状态

## 部署

项目已配置为可在 Vercel 上部署。只需连接 GitHub 仓库即可自动部署。

## 技术栈

- **前端**: React, TypeScript, Tailwind CSS, Axios
- **后端**: Node.js, Express, TypeScript, Mongoose
- **数据库**: MongoDB
- **构建工具**: Vite, Webpack
- **部署**: Vercel