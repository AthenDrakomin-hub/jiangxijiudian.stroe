// 验证更新后的Dish模型
import mongoose from 'mongoose';
import Dish from './src/models/Dish'; // 导入更新后的模型

// 测试数据
const testData = {
  name: '宫保鸡丁',
  nameEn: 'Kung Pao Chicken',
  description: '经典川菜，辣味鲜香',
  price: 28.00,
  category: '家常炒菜',
  categoryId: 'HOME_COOKING',
  isAvailable: true,
  isRecommended: true,
  tags: ['辣', '热销', '川菜'],
  stock: 50,
  partnerId: 'PARTNER001',
  image: 'https://example.com/kungbao.jpg'
};

async function validateDishModel() {
  console.log('正在验证 Dish 模型...');
  
  try {
    // 连接数据库（使用内存数据库进行测试）
    await mongoose.connect('mongodb://localhost:27017/test_dish_model');
    
    // 创建测试菜品
    const testDish = new Dish(testData);
    
    // 验证数据
    console.log('✅ Dish 模型验证通过');
    console.log('包含的字段:');
    console.log('- name:', testDish.name);
    console.log('- nameEn:', testDish.nameEn);
    console.log('- description:', testDish.description);
    console.log('- price:', testDish.price);
    console.log('- category:', testDish.category);
    console.log('- categoryId:', testDish.categoryId);
    console.log('- isAvailable:', testDish.isAvailable);
    console.log('- isRecommended:', testDish.isRecommended);
    console.log('- tags:', testDish.tags);
    console.log('- stock:', testDish.stock);
    console.log('- partnerId:', testDish.partnerId);
    console.log('- image:', testDish.image);
    console.log('- createdAt:', testDish.createdAt);
    console.log('- updatedAt:', testDish.updatedAt);
    
    // 验证默认值
    const defaultDish = new Dish({
      name: '测试菜品',
      price: 10,
      isAvailable: true
    });
    
    console.log('\n✅ 默认值验证:');
    console.log('- isRecommended 默认值:', defaultDish.isRecommended); // 应该是 false
    console.log('- tags 默认值:', defaultDish.tags); // 应该是 []
    console.log('- stock 默认值:', defaultDish.stock); // 应该是 999
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// 运行验证
validateDishModel();