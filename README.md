# 江云厨智能点餐系统 (Jiangyun Chef Smart Ordering System)

## 项目概述

这是一个全栈餐厅智能点餐系统，采用现代化技术栈构建，提供完整的餐饮业务解决方案。系统包含顾客点餐、订单管理、菜单管理、房间管理、厨房显示系统(KDS)等功能模块。

## 技术架构

### 后端技术栈
- **Node.js** - JavaScript 运行时环境
- **Express** - Web 应用框架
- **TypeScript** - 强类型编程语言
- **MongoDB** - NoSQL 数据库
- **Mongoose** - MongoDB ODM
- **AWS S3** - 图像存储服务 (兼容 Supabase)
- **WebSocket** - 实时通信

### 前端技术栈
- **React** - UI 组件库
- **React Router DOM** - 路由管理
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **Axios** - HTTP 客户端
- **Lucide React** - 图标库
- **Recharts** - 数据可视化

## 项目结构

```
├── src/                           # 后端源代码
│   ├── config/                    # 配置文件
│   │   ├── db.ts                  # MongoDB 连接配置
│   │   └── s3.ts                  # S3 存储配置
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
├── frontend/                      # 前端源代码
│   ├── public/                    # 静态资源
│   ├── src/                       # 前端源码
│   │   ├── components/            # React 组件
│   │   │   ├── AdminLayout.tsx    # 管理员布局
│   │   │   ├── Dashboard.tsx      # 仪表板
│   │   │   ├── GuestOrderPage.tsx # 顾客点餐页面
│   │   │   ├── OrderManagement.tsx # 订单管理
│   │   │   ├── MenuManagement.tsx # 菜单管理
│   │   │   ├── RoomGrid.tsx       # 房间网格
│   │   │   ├── KitchenDisplaySystem.ts # 厨房显示系统
│   │   │   └── LoginPage.tsx      # 登录页面
│   │   ├── utils/                 # 工具函数
│   │   │   └── api.ts             # API 服务
│   │   ├── types/                 # 类型定义
│   │   ├── constants/             # 常量定义
│   │   └── App.tsx                # 主应用组件
│   ├── package.json               # 前端依赖
│   └── vite.config.ts             # Vite 配置
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
- **厨房显示系统 (KDS)** - 实时显示厨房订单信息
- **图像库管理** - 菜品图片上传和管理
- **库存管理** - 原料库存跟踪
- **支付管理** - 支付记录和状态管理
- **注册审核** - 员工注册审批流程
- **供应商管理** - 合作伙伴关系管理
- **多主题支持** - 玻璃态、粘土风、盒子风、粗野主义等主题

## 部署方式

### 本地开发部署
1. 克隆项目仓库
2. 安装依赖：
   ```bash
   npm install
   cd frontend && npm install
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

### Vercel 部署
项目已配置 Vercel 部署，通过 `vercel.json` 文件实现：
- API 请求转发至后端服务
- 静态资源托管
- SPA 路由回退支持

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
- `GET /api/config` - 获取系统配置
- `GET /health` - 健康检查

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
1. **响应式设计** - 适配各种设备屏幕尺寸
2. **实时同步** - WebSocket 实现实时数据更新
3. **高扩展性** - 模块化架构便于功能扩展
4. **安全性保障** - 多层次权限控制和数据保护
5. **可定制性** - 主题和配置灵活调整

## 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

ISC License