"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// 创建完整的菜品分类结构
const categories = [
    // 一级分类
    { id: 'MAIN_DISHES', name: '主食类', nameEn: 'Main Dishes', parentId: null, level: 1, displayOrder: 1, isActive: true },
    { id: 'HOT_DISHES', name: '热菜类', nameEn: 'Hot Dishes', parentId: null, level: 1, displayOrder: 2, isActive: true },
    { id: 'SEAFOOD', name: '海鲜类', nameEn: 'Seafood', parentId: null, level: 1, displayOrder: 3, isActive: true },
    { id: 'CANTONESE_SPECIAL', name: '粤式特色菜', nameEn: 'Cantonese Specialties', parentId: null, level: 1, displayOrder: 4, isActive: true },
    { id: 'DESSERTS', name: '甜品类', nameEn: 'Desserts', parentId: null, level: 1, displayOrder: 5, isActive: true },
    { id: 'BEVERAGES', name: '饮品类', nameEn: 'Beverages', parentId: null, level: 1, displayOrder: 6, isActive: true },
    // 二级分类 - 主食类
    { id: 'BASIC_MAIN', name: '基础主食', nameEn: 'Basic Main Dishes', parentId: 'MAIN_DISHES', level: 2, displayOrder: 1, isActive: true },
    { id: 'MAIN_SET', name: '主食套餐', nameEn: 'Main Dish Sets', parentId: 'MAIN_DISHES', level: 2, displayOrder: 2, isActive: true },
    { id: 'NOODLES', name: '面食类', nameEn: 'Noodles', parentId: 'MAIN_DISHES', level: 2, displayOrder: 3, isActive: true },
    { id: 'FRIED_RICE', name: '炒饭类', nameEn: 'Fried Rice', parentId: 'MAIN_DISHES', level: 2, displayOrder: 4, isActive: true },
    // 二级分类 - 热菜类
    { id: 'HOME_COOKING', name: '家常炒菜', nameEn: 'Home Cooking', parentId: 'HOT_DISHES', level: 2, displayOrder: 1, isActive: true },
    { id: 'SPICY_DISHES', name: '辣味炒菜', nameEn: 'Spicy Dishes', parentId: 'HOT_DISHES', level: 2, displayOrder: 2, isActive: true },
    // 二级分类 - 海鲜类
    { id: 'STEAMED_SEAFOOD', name: '清蒸海鲜', nameEn: 'Steamed Seafood', parentId: 'SEAFOOD', level: 2, displayOrder: 1, isActive: true },
    { id: 'STIR_FRY_SEAFOOD', name: '爆炒海鲜', nameEn: 'Stir-fry Seafood', parentId: 'SEAFOOD', level: 2, displayOrder: 2, isActive: true },
    { id: 'SEAFOOD_SOUP', name: '海鲜汤品', nameEn: 'Seafood Soup', parentId: 'SEAFOOD', level: 2, displayOrder: 3, isActive: true },
    { id: 'SEAFOOD_MAIN', name: '海鲜主食', nameEn: 'Seafood Main Dish', parentId: 'SEAFOOD', level: 2, displayOrder: 4, isActive: true },
    // 二级分类 - 粤式特色菜
    { id: 'CANT_STEAMED', name: '粤式蒸菜', nameEn: 'Cantonese Steamed', parentId: 'CANTONESE_SPECIAL', level: 2, displayOrder: 1, isActive: true },
    { id: 'CANT_BRAISED', name: '粤式煲仔', nameEn: 'Cantonese Casserole', parentId: 'CANTONESE_SPECIAL', level: 2, displayOrder: 2, isActive: true },
    { id: 'CANT_SPECIAL', name: '特色粤菜', nameEn: 'Special Cantonese', parentId: 'CANTONESE_SPECIAL', level: 2, displayOrder: 3, isActive: true },
    // 二级分类 - 甜品类
    { id: 'CLASSIC_DESSERT', name: '经典甜品', nameEn: 'Classic Desserts', parentId: 'DESSERTS', level: 2, displayOrder: 1, isActive: true },
    { id: 'SEASONAL_DESSERT', name: '季节限定', nameEn: 'Seasonal Desserts', parentId: 'DESSERTS', level: 2, displayOrder: 2, isActive: true },
    // 二级分类 - 饮品类
    { id: 'BASIC_DRINKS', name: '基础饮品', nameEn: 'Basic Drinks', parentId: 'BEVERAGES', level: 2, displayOrder: 1, isActive: true },
    { id: 'FRESH_JUICE', name: '鲜榨饮品', nameEn: 'Fresh Juice', parentId: 'BEVERAGES', level: 2, displayOrder: 2, isActive: true },
    { id: 'BEER', name: '啤酒', nameEn: 'Beer', parentId: 'BEVERAGES', level: 2, displayOrder: 3, isActive: true },
    { id: 'WINE_SPIRITS', name: '红酒洋酒', nameEn: 'Wine & Spirits', parentId: 'BEVERAGES', level: 2, displayOrder: 4, isActive: true }
];
// Create complete dish data
const dishes = [
    // Main Dishes
    { id: 'MAIN_001', name: '白米饭', nameEn: 'Steamed Rice', price: 2, category: '主食类', categoryId: 'MAIN_DISHES', isAvailable: true },
    { id: 'MAIN_002', name: '扬州炒饭', nameEn: 'Yangzhou Fried Rice', price: 18, category: '主食类', categoryId: 'MAIN_DISHES', isAvailable: true },
    { id: 'MAIN_003', name: '炸酱面', nameEn: 'Zhajiang Noodles', price: 22, category: '主食类', categoryId: 'MAIN_DISHES', isAvailable: true },
    // Hot Dishes
    { id: 'HOT_001', name: '宫保鸡丁', nameEn: 'Kung Pao Chicken', price: 32, category: '热菜类', categoryId: 'HOT_DISHES', isAvailable: true },
    { id: 'HOT_002', name: '鱼香肉丝', nameEn: 'Shredded Pork with Garlic Sauce', price: 28, category: '热菜类', categoryId: 'HOT_DISHES', isAvailable: true },
    { id: 'HOT_003', name: '麻婆豆腐', nameEn: 'Mapo Tofu', price: 18, category: '热菜类', categoryId: 'HOT_DISHES', isAvailable: true },
    { id: 'HOT_004', name: '红烧肉', nameEn: 'Braised Pork Belly', price: 38, category: '热菜类', categoryId: 'HOT_DISHES', isAvailable: true },
    // Seafood
    { id: 'SEA_001', name: '清蒸鲈鱼', nameEn: 'Steamed Sea Bass', price: 68, category: '海鲜类', categoryId: 'SEAFOOD', isAvailable: true },
    { id: 'SEA_002', name: '蒜蓉扇贝', nameEn: 'Garlic Scallops', price: 48, category: '海鲜类', categoryId: 'SEAFOOD', isAvailable: true },
    // Cantonese Specialties
    { id: 'CANT_001', name: '广式烧鹅', nameEn: 'Cantonese Roast Goose', price: 88, category: '粤式特色菜', categoryId: 'CANTONESE_SPECIAL', isAvailable: true },
    { id: 'CANT_002', name: '蜜汁叉烧', nameEn: 'Honey BBQ Pork', price: 42, category: '粤式特色菜', categoryId: 'CANTONESE_SPECIAL', isAvailable: true },
    // Beverages
    { id: 'DRINK_001', name: '可乐', nameEn: 'Coke', price: 8, category: '饮品类', categoryId: 'BEVERAGES', isAvailable: true },
    { id: 'DRINK_002', name: '橙汁', nameEn: 'Orange Juice', price: 12, category: '饮品类', categoryId: 'BEVERAGES', isAvailable: true },
    { id: 'WINE_SPIRIT_10', name: '蓝带马爹利', nameEn: 'Martell Blue Ribbon', price: 588, category: '红酒洋酒', categoryId: 'WINE_SPIRITS', isAvailable: true }
];
// 从环境变量获取MongoDB连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db';
async function seedMenuData() {
    const client = new mongodb_1.MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        // 清空现有数据
        await db.collection('categories').deleteMany({});
        await db.collection('dishes').deleteMany({});
        console.log('Cleared existing categories and dishes');
        // 插入分类数据
        const categoryResult = await db.collection('categories').insertMany(categories.map(cat => ({
            ...cat,
            _id: new mongodb_1.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
        })));
        console.log(`Inserted ${categoryResult.insertedCount} categories`);
        // 插入菜品数据
        const dishResult = await db.collection('dishes').insertMany(dishes.map((dish) => ({
            ...dish,
            _id: new mongodb_1.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
        })));
        console.log(`Inserted ${dishResult.insertedCount} dishes`);
        console.log('Menu data seeding completed successfully!');
    }
    catch (error) {
        console.error('Error seeding menu data:', error);
    }
    finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}
// 运行脚本
if (require.main === module) {
    seedMenuData().catch(console.error);
}
exports.default = seedMenuData;
