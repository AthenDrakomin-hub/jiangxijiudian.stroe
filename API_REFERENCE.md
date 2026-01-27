# API 参考文档

## 认证相关

### POST /api/auth/login
用户登录

**请求体**：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## 房间管理

### GET /api/rooms
获取所有房间

**响应**：
```json
[
  {
    "_id": "room_id",
    "roomNumber": "8201",
    "tableName": "餐桌8201",
    "capacity": 4,
    "status": "available",
    "occupiedBy": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/rooms/:roomNumber
获取特定房间信息

## 菜品管理

### GET /api/dishes
获取所有菜品

**响应**：
```json
[
  {
    "_id": "dish_id",
    "name": "宫保鸡丁",
    "nameEn": "Kung Pao Chicken",
    "description": "经典川菜",
    "price": 38,
    "category": "川菜",
    "categoryId": "category_id",
    "isAvailable": true,
    "isRecommended": false,
    "tags": [],
    "stock": 999,
    "partnerId": "partner_id",
    "image": "https://example.com/image.jpg",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 订单管理

### POST /api/orders
创建订单

**请求体**：
```json
{
  "roomNumber": "8201",
  "items": [
    {
      "dishId": "dish_id",
      "quantity": 2
    }
  ],
  "note": "少辣"
}
```

### PATCH /api/orders/:id/status
更新订单状态

**请求体**：
```json
{
  "status": "confirmed"
}
```

## 系统管理

### GET /health
健康检查

**响应**：
```json
{
  "status": "ok",
  "service": "jx-server-ts",
  "db": {
    "status": "connected",
    "readyState": 1,
    "message": "数据库连接正常"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 管理员接口

### GET /api/admin/dishes
获取所有菜品（管理接口）

### POST /api/admin/dishes
创建菜品

### PUT /api/admin/dishes/:id
更新菜品

### DELETE /api/admin/dishes/:id
删除菜品

## 权限说明

- **公开接口**：需要有效的 JWT token
- **管理接口**：需要认证用户（当前实现中未区分具体角色权限）
- **员工接口**：需要认证用户（当前实现中未区分具体角色权限）