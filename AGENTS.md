# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## 项目概述

这是一个纯TypeScript项目，采用Express + Mongoose + MongoDB技术栈构建，专为Vercel Serverless环境深度适配。项目专注于提供RESTful API服务，支持用户认证、订单管理、菜单管理、房间管理、库存管理、供应商管理等核心功能。

## 技术架构

### 核心技术栈
- **Node.js** - JavaScript运行时环境
- **Express** - Web应用框架
- **TypeScript** - 强类型编程语言
- **MongoDB** - NoSQL数据库（通过Vercel原生关联）
- **Mongoose** - MongoDB ODM
- **bcryptjs** - 密码加密
- **cors** - 跨域资源共享
- **ws** - WebSocket实时通信

### 项目结构
```
├── src/
│   ├── config/
│   │   ├── db.ts                 # MongoDB连接配置
│   │   ├── s3.ts                 # S3存储配置
│   │   └── vercel-mongoose.ts    # Vercel Mongoose连接配置
│   ├── controllers/              # 控制器层
│   │   ├── AuthController.ts     # 认证控制器
│   │   ├── CategoriesController.ts # 分类管理
│   │   ├── CustomerController.ts # 客户端控制器
│   │   ├── DishesController.ts   # 菜品管理
│   │   ├── ExpenseController.ts  # 支出管理
│   │   ├── FinanceController.ts  # 财务管理
│   │   ├── IngredientsController.ts # 原料管理
│   │   ├── InventoryController.ts # 库存管理
│   │   ├── OrdersController.ts   # 订单管理
│   │   ├── PartnerController.ts  # 供应商管理
│   │   ├── PaymentController.ts  # 支付管理
│   │   ├── PrintController.ts    # 打印管理
│   │   ├── QRManagementController.ts # 二维码管理
│   │   ├── RegistrationController.ts # 注册管理
│   │   ├── RoomsController.ts    # 房间管理
│   │   ├── StaffController.ts    # 员工管理
│   │   ├── SupplyChainController.ts # 供应链管理
│   │   ├── SystemConfigController.ts # 系统配置
│   │   └── UserController.ts     # 用户管理
│   ├── middleware/               # 中间件
│   │   ├── auth.ts               # 认证中间件
│   │   ├── errorHandler.ts       # 错误处理中间件
│   │   └── roleGuard.ts          # 角色权限中间件
│   ├── models/                   # 数据模型
│   │   ├── Category.ts           # 分类模型
│   │   ├── Dish.ts               # 菜品模型
│   │   ├── Expense.ts            # 支出模型
│   │   ├── Ingredient.ts         # 原料模型
│   │   ├── Inventory.ts          # 库存模型
│   │   ├── Menu.ts               # 菜单模型
│   │   ├── Notification.ts       # 通知模型
│   │   ├── Order.ts              # 订单模型
│   │   ├── Partner.ts            # 供应商模型
│   │   ├── Payment.ts            # 支付模型
│   │   ├── Product.ts            # 产品模型
│   │   ├── Room.ts               # 房间模型
│   │   ├── Staff.ts              # 员工模型
│   │   ├── SystemConfig.ts       # 系统配置模型
│   │   └── User.ts               # 用户模型
│   ├── routes/                   # 路由
│   │   ├── admin.ts              # 管理员路由
│   │   ├── api.ts                # API路由
│   │   ├── auth.ts               # 认证路由
│   │   ├── customer.ts           # 客户路由
│   │   ├── print.ts              # 打印路由
│   │   └── stub.ts               # 其他路由
│   ├── scripts/                  # 脚本文件
│   │   ├── backup-db.ts          # 数据库备份
│   │   ├── check-customer-ordering.ts # 客户点餐检查
│   │   ├── check-db-structure.ts # 数据库结构检查
│   │   ├── check-role-permissions.ts # 角色权限检查
│   │   ├── check-system-config.ts # 系统配置检查
│   │   ├── init-missing-collections.ts # 初始化缺失集合
│   │   ├── migrate-db.ts         # 数据库迁移
│   │   ├── seed-menu-data-simple.ts # 简单菜单数据种子
│   │   ├── seed-menu-data.ts     # 菜单数据种子
│   │   └── seed.ts               # 数据种子
│   ├── services/                 # 服务
│   │   └── DatabaseService.ts    # 数据库服务
│   ├── types/                    # 类型定义
│   │   └── index.ts              # 通用类型
│   ├── utils/                    # 工具函数
│   │   ├── qrGenerator.ts        # 二维码生成
│   │   └── seedData.ts           # 种子数据
│   ├── server.ts                 # 主服务器入口
│   └── test-db-connection.ts     # 数据库连接测试
├── package.json                  # 项目依赖配置
├── tsconfig.json                 # TypeScript编译配置
└── vercel.json                   # Vercel部署配置
```

## 常用开发命令

### 本地开发
```bash
# 安装依赖
npm install

# 本地开发模式（热更新）
npm run dev

# 编译TypeScript代码
npm run build

# 运行编译后的代码
npm start

# 运行数据种子
npm run seed
```

### 测试验证
```bash
# 健康检查接口测试
curl https://your-vercel-app.vercel.app/health

# 登录接口测试
curl -X POST https://your-vercel-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jiangxijiudian.com","password":"123456"}'
```

### 数据库操作
```bash
# 生成bcrypt密码密文
npx ts-node -e "
import bcrypt from 'bcryptjs';
const plainPassword = '123456';
const saltRounds = 12;
bcrypt.hash(plainPassword, saltRounds).then(hash => {
  console.log('bcrypt密文:', hash);
  process.exit();
});
"
```

## 核心配置文件

### tsconfig.json (TypeScript编译配置)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "baseUrl": "./",
    "paths": {
      "*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### vercel.json (Vercel部署配置)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node",
      "config": {
        "runtime": "nodejs20.x",
        "installCommand": "npm install",
        "buildCommand": "tsc"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Vercel原生MongoDB适配要点

### 数据库连接配置
- 直接使用Vercel自动生成的只读环境变量`MONGODB_URI`
- 无需手动配置环境变量
- 适配Serverless环境的连接池和超时设置

### 关键适配配置
```typescript
const options: ConnectOptions = {
  maxPoolSize: 1,        // 禁用连接池，适配Serverless短暂连接特性
  minPoolSize: 0,
  maxIdleTimeMS: 10000,  // 连接空闲超时
  serverSelectionTimeoutMS: 8000, // 网络延迟适配
  socketTimeoutMS: 45000,
  family: 4,             // 优先IPv4
  retryWrites: true,
  writeConcern: { w: 'majority' }
};
```

## MongoDB Atlas数据初始化

### 1. 创建数据库和集合
- 数据库名：`JIANGXIJIUDIAN`
- 集合名：`users`

### 2. 生成测试用户数据
```json
{
  "email": "admin@jiangxijiudian.com",
  "password": "<your-bcrypt-hash>",
  "name": "管理员",
  "isActive": true,
  "createdAt": { "$date": "2026-01-27T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-27T00:00:00.000Z" }
}
```

## 部署流程

### 1. 本地准备
```bash
# 安装所有依赖
npm install

# 本地编译验证
npm run build
```

### 2. Vercel部署
```bash
# 推送代码到GitHub
git add .
git commit -m "feat: 纯TS项目适配Vercel原生MongoDB"
git push origin main
```

### 3. 验证部署
- 访问健康检查接口：`https://your-app.vercel.app/health`
- 成功标志：`db.readyState=1` 且 `db.status=connected`

## 常见问题排查

### 数据库连接失败
1. 确认Vercel已关联MongoDB（Storage→MongoDB）
2. 检查Vercel Functions日志中的错误信息
3. 无需手动配置IP白名单（Vercel自动处理）

### 登录接口500错误
1. 确认Atlas中已插入测试用户数据
2. 验证密码字段为bcrypt密文
3. 检查用户状态`isActive=true`

### 部署失败
1. 本地执行`npm run build`排查TS语法错误
2. 确认`tsconfig.json`配置正确
3. 验证`vercel.json`部署配置

## 成功标志
- 健康检查接口返回`db.readyState=1`
- 登录接口返回200 OK状态码
- Vercel Functions面板无运行时错误