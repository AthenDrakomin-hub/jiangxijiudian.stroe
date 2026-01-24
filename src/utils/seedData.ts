import mongoose from 'mongoose';
import Room from '../models/Room';
import Dish from '../models/Dish';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

const seedRooms = async (): Promise<void> => {
  try {
    // 删除现有房间数据
    await Room.deleteMany({});
    console.log('Deleted existing rooms');

    // 创建房间数据：8201-8232, 8301-8332, 3333, 6666, 9999
    const rooms = [];
    
    // 8201-8232 (32个房间)
    for (let i = 8201; i <= 8232; i++) {
      rooms.push({
        roomNumber: i.toString(),
        isActive: true,
      });
    }
    
    // 8301-8332 (32个房间)
    for (let i = 8301; i <= 8332; i++) {
      rooms.push({
        roomNumber: i.toString(),
        isActive: true,
      });
    }
    
    // 3333, 6666, 9999
    rooms.push(
      { roomNumber: '3333', isActive: true },
      { roomNumber: '6666', isActive: true },
      { roomNumber: '9999', isActive: true }
    );

    // 插入房间数据
    await Room.insertMany(rooms);
    console.log(`Inserted ${rooms.length} rooms`);
  } catch (error) {
    console.error('Error seeding rooms:', error);
  }
};

const seedDishes = async (): Promise<void> => {
  try {
    // 删除现有菜品数据
    await Dish.deleteMany({});
    console.log('Deleted existing dishes');

    // 创建示例菜品数据
    const dishes = [
      { name: '宫保鸡丁', description: '经典川菜，酸甜微辣', price: 32, category: '川菜', isAvailable: true },
      { name: '麻婆豆腐', description: '嫩滑豆腐配麻辣肉末', price: 26, category: '川菜', isAvailable: true },
      { name: '红烧肉', description: '经典家常菜，肥而不腻', price: 38, category: '家常菜', isAvailable: true },
      { name: '糖醋里脊', description: '外酥内嫩，酸甜可口', price: 35, category: '家常菜', isAvailable: true },
      { name: '清蒸鲈鱼', description: '鲜美嫩滑，营养丰富', price: 68, category: '海鲜', isAvailable: true },
      { name: '白切鸡', description: '鸡肉嫩滑，蘸料香浓', price: 42, category: '粤菜', isAvailable: true },
      { name: '干煸豆角', description: '豆角脆嫩，肉末香浓', price: 28, category: '家常菜', isAvailable: true },
      { name: '水煮牛肉', description: '牛肉嫩滑，麻辣鲜香', price: 48, category: '川菜', isAvailable: true },
      { name: '蒜蓉粉丝蒸扇贝', description: '扇贝鲜美，蒜香浓郁', price: 58, category: '海鲜', isAvailable: true },
      { name: '小笼包', description: '皮薄汁多，肉质鲜美', price: 22, category: '点心', isAvailable: true },
      { name: '扬州炒饭', description: '粒粒分明，配料丰富', price: 18, category: '主食', isAvailable: true },
      { name: '酸辣汤', description: '酸辣开胃，配料丰富', price: 15, category: '汤品', isAvailable: true },
      { name: '春卷', description: '外酥内嫩，清香可口', price: 12, category: '小吃', isAvailable: true },
      { name: '葱油拌面', description: '面条劲道，葱香浓郁', price: 16, category: '主食', isAvailable: true },
      { name: '红烧茄子', description: '茄子软糯，酱香浓郁', price: 24, category: '家常菜', isAvailable: true },
      { name: '鱼香肉丝', description: '经典川菜，鱼香味美', price: 30, category: '川菜', isAvailable: true },
      { name: '回锅肉', description: '肥瘦相间，香辣下饭', price: 36, category: '川菜', isAvailable: true },
      { name: '冬瓜排骨汤', description: '清淡滋补，营养丰富', price: 28, category: '汤品', isAvailable: true },
      { name: '白灼虾', description: '虾肉鲜甜，原汁原味', price: 52, category: '海鲜', isAvailable: true },
      { name: '剁椒鱼头', description: '鱼头鲜嫩，剁椒香辣', price: 78, category: '湘菜', isAvailable: true },
      { name: '锅贴', description: '底部焦脆，肉汁丰富', price: 20, category: '点心', isAvailable: true },
      { name: '蒸蛋羹', description: '口感滑嫩，营养丰富', price: 14, category: '汤品', isAvailable: true },
      { name: '凉拌黄瓜', description: '清爽解腻，脆嫩可口', price: 10, category: '凉菜', isAvailable: true },
      { name: '炸酱面', description: '面条劲道，酱香浓郁', price: 18, category: '主食', isAvailable: true },
      { name: '红烧狮子头', description: '肉质鲜嫩，汤汁浓郁', price: 42, category: '家常菜', isAvailable: true },
      { name: '糖醋排骨', description: '外酥内嫩，酸甜可口', price: 45, category: '家常菜', isAvailable: true },
      { name: '干锅花菜', description: '花菜脆嫩，腊肉香浓', price: 32, category: '家常菜', isAvailable: true },
      { name: '西红柿鸡蛋', description: '经典家常菜，营养搭配', price: 22, category: '家常菜', isAvailable: true },
      { name: '手撕包菜', description: '包菜爽脆，干香下饭', price: 18, category: '家常菜', isAvailable: true },
      { name: '干煸四季豆', description: '四季豆脆嫩，肉末香浓', price: 26, category: '家常菜', isAvailable: true },
    ];

    // 插入菜品数据
    await Dish.insertMany(dishes);
    console.log(`Inserted ${dishes.length} dishes`);
  } catch (error) {
    console.error('Error seeding dishes:', error);
  }
};

const seedData = async (): Promise<void> => {
  try {
    await connectDB();
    
    await seedRooms();
    await seedDishes();
    
    console.log('Seed data completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error in seed process:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

export default seedData;