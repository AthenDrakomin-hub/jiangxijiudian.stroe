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
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin",
    "defaultLang": "zh",
    "modulePermissions": {}
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
    "name": {
      "zh": "宫保鸡丁",
      "en": "Kung Pao Chicken"
    },
    "description": "经典川菜",
    "price": 38,
    "category": "川菜",
    "isAvailable": true,
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
  "db": {
    "status": "connected",
    "error": null,
    "readyState": 1
  },
  "s3": false,
  "uptime": 123.456,
  "timestamp": "2024-01-01T00:00:00.000Z"
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
- **管理接口**：需要 admin 角色
- **员工接口**：需要 admin 或 staff 角色