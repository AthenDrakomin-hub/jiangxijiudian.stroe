# 客户点餐API文档

## 概述
本文档描述了为实现客户扫码点餐功能而新增的API接口。这些接口无需认证，客户可以直接通过扫描二维码访问。

## 基础URL
```
https://your-domain.com/api/customer
```

## API接口列表

### 1. 获取房间信息
**GET** `/rooms/{roomNumber}`

获取指定房间的基本信息。

**请求参数:**
- `roomNumber` (path): 房间号

**响应示例:**
```json
{
  "roomNumber": "8201",
  "tableName": "餐桌8201",
  "capacity": 4,
  "status": "available"
}
```

### 2. 获取菜单
**GET** `/menu`

获取所有上架菜品，按分类组织。

**响应示例:**
```json
{
  "categories": ["川菜", "家常菜", "海鲜"],
  "menu": {
    "川菜": [
      {
        "id": "6977f681c9ec59e444fba6dd",
        "name": "宫保鸡丁",
        "description": "经典川菜，酸甜微辣",
        "price": 32,
        "category": "川菜"
      }
    ]
  }
}
```

### 3. 创建订单
**POST** `/orders`

客户为指定房间创建订单。

**请求体:**
```json
{
  "roomNumber": "8201",
  "items": [
    {
      "dishId": "6977f681c9ec59e444fba6dd",
      "quantity": 2
    }
  ],
  "note": "少辣",
  "paymentMethod": "mobile"
}
```

**响应示例:**
```json
{
  "message": "订单创建成功",
  "orderId": "6977f681c9ec59e444fba6dd",
  "totalAmount": 64,
  "status": "pending"
}
```

### 4. 查询订单状态
**GET** `/orders/{orderId}`

查询指定订单的详细状态。

**请求参数:**
- `orderId` (path): 订单ID

**响应示例:**
```json
{
  "orderId": "6977f681c9ec59e444fba6dd",
  "roomNumber": "8201",
  "status": "preparing",
  "totalAmount": 64,
  "items": [...],
  "createdAt": "2026-01-27T00:00:00.000Z",
  "preparingAt": "2026-01-27T00:05:00.000Z"
}
```

### 5. 获取房间订单历史
**GET** `/rooms/{roomNumber}/orders`

获取指定房间的所有订单历史。

**请求参数:**
- `roomNumber` (path): 房间号

**响应示例:**
```json
{
  "roomNumber": "8201",
  "tableName": "餐桌8201",
  "currentStatus": "available",
  "orders": [
    {
      "orderId": "6977f681c9ec59e444fba6dd",
      "status": "delivered",
      "totalAmount": 64,
      "itemsCount": 1,
      "createdAt": "2026-01-27T00:00:00.000Z"
    }
  ]
}
```

## 管理端二维码API

### 1. 获取二维码配置
**GET** `/api/admin/qr/config`

获取二维码生成的相关配置信息。

**权限:** admin

**响应示例:**
```json
{
  "roomCount": 67,
  "sampleBaseUrl": "https://your-frontend-domain.com",
  "supportedFormats": ["PNG", "SVG"],
  "apiUrl": "/api/admin/qr/generate",
  "batchApiUrl": "/api/admin/qr/generate-all"
}
```

### 2. 生成单个房间二维码
**POST** `/api/admin/qr/generate/{roomNumber}`

为指定房间生成二维码。

**权限:** admin

**请求体:**
```json
{
  "baseUrl": "https://your-frontend-domain.com"
}
```

**响应示例:**
```json
{
  "roomNumber": "8201",
  "tableName": "餐桌8201",
  "qrCode": "data:image/png;base64,...",
  "orderUrl": "https://your-frontend-domain.com/order/8201"
}
```

### 3. 批量生成所有房间二维码
**POST** `/api/admin/qr/generate-all`

批量生成所有房间的二维码。

**权限:** admin

**请求体:**
```json
{
  "baseUrl": "https://your-frontend-domain.com"
}
```

**响应示例:**
```json
{
  "totalCount": 67,
  "generatedCount": 67,
  "qrCodes": [
    {
      "roomNumber": "8201",
      "tableName": "餐桌8201",
      "qrCode": "data:image/png;base64,...",
      "orderUrl": "https://your-frontend-domain.com/order/8201"
    }
  ]
}
```

### 4. 生成SVG格式二维码
**GET** `/api/admin/qr/svg/{roomNumber}`

生成SVG格式的二维码文件。

**权限:** admin

**请求体:**
```json
{
  "baseUrl": "https://your-frontend-domain.com"
}
```

**响应:** 直接返回SVG文件内容

## 状态码说明

- `200`: 请求成功
- `201`: 创建成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

## 订单状态流转

订单状态按照以下流程流转：
```
pending(待确认) → confirmed(已确认) → preparing(制作中) → ready(就绪) → delivered(已送达)
```

## 支付方式

支持的支付方式：
- `cash`: 现金
- `card`: 刷卡
- `mobile`: 移动支付
- `online`: 在线支付

## 错误响应格式

```json
{
  "error": "错误描述信息"
}
```