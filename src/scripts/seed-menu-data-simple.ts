import { MongoClient, ObjectId } from 'mongodb';

// 简化的分类数据
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
  { id: 'WINE_SPIRITS', name: '红酒洋酒', nameEn: 'Wine & Spirits', parentId: 'BEVERAGES', level: 2, displayOrder: 4, isActive: true },
];

// 简化的菜品数据
const dishes = [
  // 主食类
  { id: 'RICE_PLATE', name: '白米饭', nameEn: 'Steamed Rice', price: 2, category: '基础主食', categoryId: 'BASIC_MAIN', isAvailable: true },
  { id: 'FRIED_RICE_BASIC', name: '蛋炒饭', nameEn: 'Fried Rice with Egg', price: 15, category: '基础主食', categoryId: 'BASIC_MAIN', isAvailable: true },
  { id: 'NOODLE_BOWL', name: '阳春面', nameEn: 'Simple Noodles', price: 12, category: '面食类', categoryId: 'NOODLES', isAvailable: true },
  { id: 'FRIED_RICE_SHRIMP', name: '虾仁炒饭', nameEn: 'Shrimp Fried Rice', price: 28, category: '炒饭类', categoryId: 'FRIED_RICE', isAvailable: true },
  
  // 热菜类
  { id: 'GREEN_BEANS', name: '干煸四季豆', nameEn: 'Dry-Fried Green Beans', price: 18, category: '家常炒菜', categoryId: 'HOME_COOKING', isAvailable: true },
  { id: 'MAP_TOFU', name: '麻婆豆腐', nameEn: 'Mapo Tofu', price: 16, category: '家常炒菜', categoryId: 'HOME_COOKING', isAvailable: true },
  { id: 'KUNG_PO_CHICKEN', name: '宫保鸡丁', nameEn: 'Kung Pao Chicken', price: 28, category: '家常炒菜', categoryId: 'HOME_COOKING', isAvailable: true },
  { id: 'SICHUAN_CHICKEN', name: '水煮肉片', nameEn: 'Sichuan Boiled Meat', price: 35, category: '辣味炒菜', categoryId: 'SPICY_DISHES', isAvailable: true },
  
  // 海鲜类
  { id: 'STEAMED_FISH', name: '清蒸鲈鱼', nameEn: 'Steamed Perch', price: 68, category: '清蒸海鲜', categoryId: 'STEAMED_SEAFOOD', isAvailable: true },
  { id: 'STEAMED_CRAB', name: '清蒸大闸蟹', nameEn: 'Steamed Crab', price: 128, category: '清蒸海鲜', categoryId: 'STEAMED_SEAFOOD', isAvailable: true },
  { id: 'STIR_FRY_CRAB', name: '香辣蟹', nameEn: 'Spicy Crabs', price: 88, category: '爆炒海鲜', categoryId: 'STIR_FRY_SEAFOOD', isAvailable: true },
  { id: 'SEAFOOD_SOUP_1', name: '海鲜豆腐汤', nameEn: 'Seafood Tofu Soup', price: 38, category: '海鲜汤品', categoryId: 'SEAFOOD_SOUP', isAvailable: true },
  
  // 粤式特色菜
  { id: 'CANT_STEAMED_CHICKEN', name: '白切鸡', nameEn: 'White Cut Chicken', price: 58, category: '粤式蒸菜', categoryId: 'CANT_STEAMED', isAvailable: true },
  { id: 'CANT_BRAISED_RICE_1', name: '腊味煲仔饭', nameEn: 'Casserole Rice with Cured Meat', price: 38, category: '粤式煲仔', categoryId: 'CANT_BRAISED', isAvailable: true },
  { id: 'CANT_SPECIAL_1', name: '广东白切鸭', nameEn: 'Cantonese White Cut Duck', price: 78, category: '特色粤菜', categoryId: 'CANT_SPECIAL', isAvailable: true },
  
  // 甜品类
  { id: 'CLASSIC_DESSERT_1', name: '红豆沙', nameEn: 'Red Bean Paste', price: 12, category: '经典甜品', categoryId: 'CLASSIC_DESSERT', isAvailable: true },
  { id: 'SEASONAL_DESSERT_1', name: '杨枝甘露', nameEn: 'Mango Pomelo Sago', price: 22, category: '季节限定', categoryId: 'SEASONAL_DESSERT', isAvailable: true },
  
  // 饮品类
  { id: 'BASIC_DRINK_1', name: '白开水', nameEn: 'Plain Water', price: 0, category: '基础饮品', categoryId: 'BASIC_DRINKS', isAvailable: true },
  { id: 'BASIC_DRINK_2', name: '绿茶', nameEn: 'Green Tea', price: 8, category: '基础饮品', categoryId: 'BASIC_DRINKS', isAvailable: true },
  { id: 'FRESH_JUICE_1', name: '鲜榨橙汁', nameEn: 'Fresh Orange Juice', price: 18, category: '鲜榨饮品', categoryId: 'FRESH_JUICE', isAvailable: true },
  { id: 'BEER_1', name: '青岛啤酒', nameEn: 'Tsingtao Beer', price: 8, category: '啤酒', categoryId: 'BEER', isAvailable: true },
  { id: 'WINE_SPIRIT_1', name: '长城干红', nameEn: 'Great Wall Red Wine', price: 88, category: '红酒洋酒', categoryId: 'WINE_SPIRITS', isAvailable: true },
];

// 从环境变量获取MongoDB连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db';

async function seedMenuData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // 清空现有数据
    await db.collection('categories').deleteMany({});
    await db.collection('dishes').deleteMany({});
    
    console.log('Cleared existing categories and dishes');

    // 插入分类数据
    const categoryResult = await db.collection('categories').insertMany(
      categories.map((cat: any) => ({
        ...cat,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    
    console.log(`Inserted ${categoryResult.insertedCount} categories`);

    // 插入菜品数据
    const dishResult = await db.collection('dishes').insertMany(
      dishes.map((dish: any) => ({
        ...dish,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    
    console.log(`Inserted ${dishResult.insertedCount} dishes`);
    
    console.log('Menu data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding menu data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// 运行脚本
if (require.main === module) {
  seedMenuData().catch(console.error);
}

export default seedMenuData;