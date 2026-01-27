"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const Menu_1 = require("../models/Menu");
const Order_1 = __importDefault(require("../models/Order"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Product_1 = __importDefault(require("../models/Product"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
console.log('🔄 开始初始化缺失的数据库集合...');
async function initMissingCollections() {
    try {
        // 连接到数据库
        console.log('🔌 正在连接到数据库...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ 成功连接到数据库');
        // 初始化库存集合
        console.log('\n📦 初始化库存集合...');
        const inventoryItems = [
            {
                name: '大米',
                sku: 'RICE001',
                quantity: 100,
                unit: 'kg',
                minStockLevel: 20,
                supplier: '江云供应链集团',
                costPerUnit: 5.8,
                category: '主食原料',
                description: '优质东北大米',
                isActive: true
            },
            {
                name: '食用油',
                sku: 'OIL001',
                quantity: 50,
                unit: 'liter',
                minStockLevel: 10,
                supplier: '江云供应链集团',
                costPerUnit: 12.5,
                category: '调料',
                description: '一级大豆油',
                isActive: true
            }
        ];
        await Inventory_1.default.deleteMany({});
        await Inventory_1.default.insertMany(inventoryItems);
        console.log(`✅ 库存集合初始化完成 (${inventoryItems.length} 条记录)`);
        // 初始化菜单集合
        console.log('\n📋 初始化菜单集合...');
        const menuItems = [
            {
                name: '午餐套餐A',
                description: '经典午餐组合',
                dishes: [], // 实际应用中会关联具体的菜品ID
                price: 38,
                isActive: true,
                displayOrder: 1
            },
            {
                name: '晚餐套餐B',
                description: '丰盛晚餐组合',
                dishes: [],
                price: 58,
                isActive: true,
                displayOrder: 2
            }
        ];
        await Menu_1.Menu.deleteMany({});
        await Menu_1.Menu.insertMany(menuItems);
        console.log(`✅ 菜单集合初始化完成 (${menuItems.length} 条记录)`);
        // 初始化订单集合（创建一个测试订单）
        console.log('\n📝 初始化订单集合...');
        const testOrder = {
            tableId: 'TABLE_8201',
            roomNumber: '8201',
            items: [
                {
                    dishId: new mongoose_1.default.Types.ObjectId(),
                    name: '宫保鸡丁',
                    quantity: 2,
                    price: 32
                }
            ],
            totalAmount: 64,
            status: 'pending'
        };
        await Order_1.default.deleteMany({});
        await Order_1.default.create(testOrder);
        console.log('✅ 订单集合初始化完成 (1 条测试记录)');
        // 初始化支付集合
        console.log('\n💳 初始化支付集合...');
        const testPayment = {
            orderId: new mongoose_1.default.Types.ObjectId(),
            amount: 64,
            method: 'mobile',
            status: 'completed',
            transactionId: 'TEST_TX_001',
            paidAt: new Date()
        };
        await Payment_1.default.deleteMany({});
        await Payment_1.default.create(testPayment);
        console.log('✅ 支付集合初始化完成 (1 条测试记录)');
        // 初始化产品集合
        console.log('\n🛍️ 初始化产品集合...');
        const products = [
            {
                name: '餐厅专用餐具套装',
                description: '高品质陶瓷餐具',
                price: 128,
                category: '餐具用品',
                stock: 50,
                status: 'available'
            },
            {
                name: '定制桌布',
                description: '高档亚麻桌布',
                price: 88,
                category: '装饰用品',
                stock: 30,
                status: 'available'
            }
        ];
        await Product_1.default.deleteMany({});
        await Product_1.default.insertMany(products);
        console.log(`✅ 产品集合初始化完成 (${products.length} 条记录)`);
        await mongoose_1.default.disconnect();
        console.log('\n🎉 所有缺失集合初始化完成！');
    }
    catch (error) {
        console.error('💥 初始化过程中出现错误:', error);
        process.exit(1);
    }
}
initMissingCollections();
