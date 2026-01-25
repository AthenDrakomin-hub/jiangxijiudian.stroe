# 江云厨智能点餐系统 - 后端 API (Jiangyun Chef Smart Ordering System - Backend API)

## 项目概述

这是一个现代化的餐厅智能点餐系统后端服务，采用Node.js + Express + TypeScript技术栈构建，提供完整的餐饮业务API解决方案。系统专注于提供RESTful API服务，支持顾客点餐、订单管理、菜单管理、房间管理等功能模块。

## 技术架构

### 后端技术栈
- **Node.js** - JavaScript 运行时环境
- **Express** - Web 应用框架
- **TypeScript** - 强类型编程语言
- **MongoDB** - NoSQL 数据库
- **Mongoose** - MongoDB ODM
- **AWS S3** - 通过S3协议连接Supabase存储
- **WebSocket** - 实时通信
- **Cors** - 跨域资源共享中间件

## 项目结构

```
├── src/                           # 后端源代码
│   ├── config/                    # 配置文件
│   │   └── db.ts                  # MongoDB 连接配置
│   ├── controllers/               # 控制器层
│   │   ├── CategoriesController.ts # 分类管理
│   │   ├── DishesController.ts    # 菜品管理
│   │   ├── OrdersController.ts    # 订单管理
│   │   ├── RoomsController.ts     # 房间管理
│   │   ├── SystemConfigController.ts # 系统配置
│   │   └── UserController.ts      # 用户管理
│   ├── middleware/                # 中间件
│   │   └── roleGuard.ts           # 角色权限中间件
│   ├── models/                    # 数据模型
│   │   ├── Category.ts            # 分类模型
│   │   ├── Dish.ts                # 菜品模型
│   │   ├── Order.ts               # 订单模型
│   │   ├── Room.ts                # 房间模型
│   │   ├── SystemConfig.ts        # 系统配置模型
│   │   └── User.ts                # 用户模型
│   ├── routes/                    # API 路由
│   │   ├── admin.ts               # 管理员路由
│   │   ├── api.ts                 # 公共 API 路由
│   │   └── stub.ts                # 其他路由
│   ├── scripts/                   # 脚本文件
│   │   └── seed.ts                # 数据初始化脚本
│   ├── services/                  # 业务逻辑服务
│   ├── types/                     # 类型定义
│   ├── utils/                     # 工具函数
│   └── server.ts                  # 主服务器入口
├── .env.example                   # 环境变量示例
├── .gitignore                     # Git 忽略配置
├── package.json                   # 项目依赖
├── tsconfig.json                  # TypeScript 配置
├── vercel.json                    # Vercel 部署配置
└── README.md                      # 项目说明
```

## 功能特性

### 核心功能
- **顾客点餐系统** - 通过扫描餐桌二维码实现自助点餐
- **实时订单管理** - 支持订单状态流转（待确认→确认→制作中→就绪→送达）
- **多角色权限管理** - 管理员、员工、合作伙伴不同权限
- **房间/桌位管理** - 实时显示房间状态（可用、占用、维护中）
- **菜品管理** - 支持图片上传、价格管理、分类管理
- **多语言支持** - 中英文界面切换

### 管理后台功能
- **仪表板** - 综合统计和数据分析
- **订单管理** - 订单处理和状态跟踪
- **菜单管理** - 菜品编辑和分类管理
- **房间管理** - 房间状态监控
- **供应链管理** - 供应商和原料管理
- **财务中心** - 支出和支付记录
- **员工管理** - 用户权限分配
- **系统设置** - 主题配置和系统参数

### 特色功能
- **厨房显示系统 (KDS)** - 通过 WebSocket 实现实时厨房订单推送
- **库存管理** - 原料库存跟踪与预警
- **支付管理** - 支付记录和状态管理
- **注册审核** - 员工注册审批流程
- **供应商管理** - 合作伙伴关系管理
- **实时通信** - 基于 WebSocket 的订单状态实时推送

## 部署方式

### 后端API部署

1. **Vercel部署**（推荐）
   - 项目已配置 `vercel.json`，可直接部署到 Vercel
   - 部署后将获得类似 `https://your-project-name.vercel.app` 的 URL
   - API 端点将可通过 `https://your-project-name.vercel.app/api/*` 访问

2. **环境变量配置**
   - 复制 `.env.example` 为 `.env`
   - 配置 `MONGODB_URI` 为 MongoDB Atlas 连接字符串
   - 如需使用 S3 存储，配置 S3 相关参数

3. **部署命令**
   ```bash
   # 构建项目
   npm run build
   
   # 启动生产服务器
   npm start
   ```

### 前端项目连接后端API

1. **获取后端API URL**
   - 使用已部署的后端API URL（如 `https://your-project-name.vercel.app`）

2. **前端项目配置**
   在前端项目的环境变量中设置：
   ```env
   REACT_APP_API_BASE_URL=https://your-project-name.vercel.app
   ```

3. **API请求配置**
   ```javascript
   // axios 或 fetch 配置
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
   
   // 示例请求
   fetch(`${API_BASE_URL}/api/dishes`)
     .then(response => response.json())
     .then(data => console.log(data));
   ```

4. **可用API端点**
   - `GET ${API_BASE_URL}/api/dishes` - 获取菜品列表
   - `GET ${API_BASE_URL}/api/rooms/:roomNumber` - 获取房间信息
   - `POST ${API_BASE_URL}/api/orders` - 创建订单
   - `GET ${API_BASE_URL}/api/orders` - 查询订单
   - `PATCH ${API_BASE_URL}/api/orders/:id/status` - 更新订单状态
   - `GET ${API_BASE_URL}/health` - 健康检查

5. **WebSocket连接**
   如需实时通信，使用：
   ```javascript
   const wsUrl = `wss://your-project-name.vercel.app/ws`;
   const ws = new WebSocket(wsUrl);
   ```

### 本地开发部署
1. 克隆项目仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 配置环境变量（复制 `.env.example` 为 `.env` 并填写配置）
4. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 生产环境部署
1. 构建项目：
   ```bash
   npm run build
   ```
2. 启动生产服务器：
   ```bash
   npm start
   ```

注意：构建命令现在只编译后端TypeScript代码，不再包含前端构建步骤。

### Vercel 部署
项目已配置 Vercel 部署，通过 `vercel.json` 文件实现：
- API 请求转发至后端服务
- 专为后端API服务优化的路由配置

## 环境要求

- Node.js 18+ 
- MongoDB (本地或云端)

## 安装与运行

### 开发模式

1. 安装依赖：
```bash
npm install
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

这将构建后端TypeScript代码。

### 运行生产版本

```bash
npm start
```

## API 接口

### 数据模型字段定义

#### 1. 房间(Room) 模型
```typescript
interface Room {
  roomNumber: string;     // 房号 (如: "8201", "8301", "3333", "6666", "9999")
  tableName: string;      // 餐桌名称 (如: "餐桌8201", "VIP包厢A")
  capacity: number;       // 容量 (人数: 2-20)
  status: 'available' | 'occupied' | 'maintenance'; // 状态
}
```

#### 2. 菜品(Dish) 模型
```typescript
interface Dish {
  _id: string;           // 菜品ID
  name: string;          // 菜品名称 (如: "宫保鸡丁")
  description: string;   // 菜品描述 (如: "经典川菜，酸甜微辣")
  price: number;         // 价格 (单位: 元)
  category: string;      // 分类 (如: "川菜", "家常菜", "海鲜")
  isAvailable: boolean;  // 是否上架
  imageUrl?: string;     // 图片URL (可选)
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}
```

#### 3. 订单(Order) 模型
```typescript
interface Order {
  _id: string;           // 订单ID
  roomNumber: string;    // 房号
  items: Array<{         // 菜品项
    dishId: string;      // 菜品ID
    name: string;        // 菜品名称
    quantity: number;    // 数量
    price: number;       // 单价
    subtotal: number;    // 小计 (quantity * price)
  }>;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  totalAmount: number;   // 总金额 (后端自动计算)
  remark?: string;       // 备注
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
  tableNumber?: string;  // 桌号 (可选)
}
```

#### 4. API响应格式
```typescript
// 成功响应
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 错误响应
interface ApiError {
  success: boolean;
  error: string;
  message?: string;
}
```

#### 5. 状态流转规则
- **订单状态**: `pending` → `confirmed` → `preparing` → `ready` → `delivered` → `completed`
- **取消状态**: `pending` → `cancelled` (仅在待确认状态下可取消)
- **完成状态**: `completed`/`cancelled` 为终态，不可逆转

#### 6. API请求体示例
```typescript
// 创建订单请求
interface CreateOrderRequest {
  roomNumber: string;
  items: Array<{
    dishId: string;
    quantity: number;
  }>;
  remark?: string;
}

// 更新订单状态请求
interface UpdateOrderStatusRequest {
  status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
}
```

### 核心业务接口
- `GET /api/rooms/:roomNumber` - 获取房间信息
- `GET /api/dishes` - 获取菜品列表（仅上架菜品）
- `POST /api/orders` - 创建订单（后端自动计算总价）
- `GET /api/orders` - 查询订单（支持按状态和房间号筛选）
- `GET /api/orders/:id` - 获取单个订单详情
- `PATCH /api/orders/:id/status` - 更新订单状态（状态流转校验）

### 管理接口
- `GET /api/admin/orders` - 管理员获取所有订单
- `POST /api/admin/dishes` - 管理员添加菜品
- `PUT /api/admin/dishes/:id` - 管理员更新菜品
- `DELETE /api/admin/dishes/:id` - 管理员删除菜品

### 系统接口
- `GET /health` - 健康检查
- `GET /api/config` - 获取系统配置

### 打印接口
- `POST /api/print/orders/:id` - 打印订单到热敏打印机

## 商业价值声明

### 为餐厅带来的价值
1. **提升运营效率** - 自助点餐减少服务员工作量，加快订单处理速度
2. **降低人力成本** - 减少点餐环节的人力投入，优化人员配置
3. **改善客户体验** - 顾客可自主浏览菜单、点餐，减少等待时间
4. **增强数据洞察** - 实时销售数据和客户偏好分析，助力经营决策
5. **提升服务质量** - 订单状态透明化，减少沟通误差
6. **增加营收潜力** - 24小时自助点餐能力，延长营业时间覆盖
7. **品牌形象升级** - 现代化点餐系统提升餐厅科技感和专业形象

### 技术优势
1. **RESTful API 设计** - 符合 REST 架构规范的 API 接口
2. **实时同步** - WebSocket 实现实时数据更新
3. **高扩展性** - 模块化架构便于功能扩展
4. **安全性保障** - 多层次权限控制和数据保护
5. **Serverless 友好** - 针对 Vercel 等 Serverless 平台优化

## 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

ISC License