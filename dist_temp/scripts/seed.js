"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Room_1 = __importDefault(require("../models/Room"));
const Dish_1 = __importDefault(require("../models/Dish"));
const Category_1 = __importDefault(require("../models/Category"));
const Partner_1 = __importDefault(require("../models/Partner"));
const Expense_1 = __importDefault(require("../models/Expense"));
const Ingredient_1 = __importDefault(require("../models/Ingredient"));
const SystemConfig_1 = __importDefault(require("../models/SystemConfig"));
const Staff_1 = __importDefault(require("../models/Staff"));
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI || '');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
const seedRooms = async () => {
    try {
        // 删除现有房间数据
        await Room_1.default.deleteMany({});
        console.log('Deleted existing rooms');
        // 创建房间数据：8201-8232, 8301-8332, 3333, 6666, 9999
        const rooms = [];
        // 8201-8232 (32个房间)
        for (let i = 8201; i <= 8232; i++) {
            rooms.push({
                roomNumber: i.toString(),
                tableName: `餐桌${i}`,
                capacity: Math.floor(Math.random() * 4) + 2, // 2-5人桌
                status: 'available',
            });
        }
        // 8301-8332 (32个房间)
        for (let i = 8301; i <= 8332; i++) {
            rooms.push({
                roomNumber: i.toString(),
                tableName: `餐桌${i}`,
                capacity: Math.floor(Math.random() * 4) + 2, // 2-5人桌
                status: 'available',
            });
        }
        // 3333, 6666, 9999
        rooms.push({
            roomNumber: '3333',
            tableName: 'VIP包厢A',
            capacity: 8,
            status: 'available'
        }, {
            roomNumber: '6666',
            tableName: 'VIP包厢B',
            capacity: 10,
            status: 'available'
        }, {
            roomNumber: '9999',
            tableName: '总统套房',
            capacity: 20,
            status: 'available'
        });
        // 插入房间数据
        await Room_1.default.insertMany(rooms);
        console.log(`Inserted ${rooms.length} rooms`);
    }
    catch (error) {
        console.error('Error seeding rooms:', error);
    }
};
const seedDishes = async () => {
    try {
        // 删除现有菜品数据
        await Dish_1.default.deleteMany({});
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
        await Dish_1.default.insertMany(dishes);
        console.log(`Inserted ${dishes.length} dishes`);
    }
    catch (error) {
        console.error('Error seeding dishes:', error);
    }
};
const seedCategories = async () => {
    try {
        // 删除现有分类数据
        await Category_1.default.deleteMany({});
        console.log('Deleted existing categories');
        // 创建示例分类数据
        const categories = [
            { name: '川菜', nameEn: 'Sichuan Cuisine', description: '麻辣鲜香的四川风味菜品', level: 1, displayOrder: 1, isActive: true },
            { name: '粤菜', nameEn: 'Cantonese Cuisine', description: '清淡精致的广东风味菜品', level: 1, displayOrder: 2, isActive: true },
            { name: '家常菜', nameEn: 'Home-style Dishes', description: '日常家庭烹饪的经典菜品', level: 1, displayOrder: 3, isActive: true },
            { name: '海鲜', nameEn: 'Seafood', description: '新鲜海产制作的美味佳肴', level: 1, displayOrder: 4, isActive: true },
            { name: '点心', nameEn: 'Dim Sum', description: '精美的小份美食', level: 1, displayOrder: 5, isActive: true },
            { name: '主食', nameEn: 'Main Courses', description: '提供饱腹感的主食类菜品', level: 1, displayOrder: 6, isActive: true },
            { name: '汤品', nameEn: 'Soups', description: '温暖身心的汤类菜品', level: 1, displayOrder: 7, isActive: true },
            { name: '小吃', nameEn: 'Snacks', description: '休闲时光的小份美食', level: 1, displayOrder: 8, isActive: true },
            { name: '凉菜', nameEn: 'Cold Dishes', description: '清爽开胃的冷盘菜品', level: 1, displayOrder: 9, isActive: true },
            { name: '湘菜', nameEn: 'Hunan Cuisine', description: '香辣浓郁的湖南风味菜品', level: 1, displayOrder: 10, isActive: true },
        ];
        // 插入分类数据
        await Category_1.default.insertMany(categories);
        console.log(`Inserted ${categories.length} categories`);
    }
    catch (error) {
        console.error('Error seeding categories:', error);
    }
};
const seedPartners = async () => {
    try {
        // 删除现有合伙人数据
        await Partner_1.default.deleteMany({});
        console.log('Deleted existing partners');
        // 创建示例合伙人数据
        const partners = [
            {
                name: '江云供应链集团',
                type: 'delivery',
                contactPerson: '张总',
                email: 'zhang@jiangyun-supply.com',
                phone: '+86 138 0013 8888',
                website: 'https://jiangyun-supply.com',
                agreementStartDate: new Date('2023-01-15'),
                agreementEndDate: new Date('2025-01-15'),
                status: 'active',
                commissionRate: 8.5,
                notes: '主要供应商，长期合作'
            },
            {
                name: '云端营销科技有限公司',
                type: 'marketing',
                contactPerson: '李经理',
                email: 'li@cloud-marketing.com',
                phone: '+86 139 0013 9999',
                website: 'https://cloud-marketing.com',
                agreementStartDate: new Date('2023-03-20'),
                agreementEndDate: new Date('2025-03-20'),
                status: 'active',
                commissionRate: 12.0,
                notes: '数字营销合作伙伴'
            },
            {
                name: '智能餐饮技术中心',
                type: 'technology',
                contactPerson: '王工程师',
                email: 'wang@smart-tech.com',
                phone: '+86 137 0013 7777',
                website: 'https://smart-tech.com',
                agreementStartDate: new Date('2023-06-10'),
                agreementEndDate: new Date('2025-06-10'),
                status: 'active',
                commissionRate: 15.0,
                notes: '技术支持与系统维护'
            },
            {
                name: '食材配送联盟',
                type: 'delivery',
                contactPerson: '陈主任',
                email: 'chen@food-delivery.org',
                phone: '+86 136 0013 6666',
                status: 'pending',
                commissionRate: 6.0,
                notes: '新加入的配送合作伙伴'
            },
        ];
        // 插入合伙人数据
        await Partner_1.default.insertMany(partners);
        console.log(`Inserted ${partners.length} partners`);
    }
    catch (error) {
        console.error('Error seeding partners:', error);
    }
};
const seedExpenses = async () => {
    try {
        // 删除现有支出数据
        await Expense_1.default.deleteMany({});
        console.log('Deleted existing expenses');
        // 创建示例支出数据
        const expenses = [
            {
                title: '水电费',
                amount: 8500,
                category: '运营成本',
                date: new Date('2024-12-01'),
                description: '12月份餐厅水电费用'
            },
            {
                title: '食材采购',
                amount: 24500,
                category: '原材料',
                date: new Date('2024-12-05'),
                description: '本周新鲜食材采购'
            },
            {
                title: '员工工资',
                amount: 45000,
                category: '人力成本',
                date: new Date('2024-12-10'),
                description: '11月份员工薪资发放'
            },
            {
                title: '设备维修',
                amount: 3200,
                category: '维护费用',
                date: new Date('2024-12-15'),
                description: '厨房设备定期保养'
            },
            {
                title: '广告推广',
                amount: 12000,
                category: '营销费用',
                date: new Date('2024-12-20'),
                description: '线上广告投放费用'
            },
        ];
        // 插入支出数据
        await Expense_1.default.insertMany(expenses);
        console.log(`Inserted ${expenses.length} expenses`);
    }
    catch (error) {
        console.error('Error seeding expenses:', error);
    }
};
const seedIngredients = async () => {
    try {
        // 删除现有物料数据
        await Ingredient_1.default.deleteMany({});
        console.log('Deleted existing ingredients');
        // 创建示例物料数据
        const ingredients = [
            {
                name: '五花肉',
                nameEn: 'Pork Belly',
                category: '肉类',
                stock: 50,
                unit: 'kg',
                minStockLevel: 10,
                supplier: '江云供应链集团',
                costPerUnit: 45.0,
                isActive: true
            },
            {
                name: '草鱼',
                nameEn: 'Grass Carp',
                category: '海鲜',
                stock: 30,
                unit: 'kg',
                minStockLevel: 5,
                supplier: '江云供应链集团',
                costPerUnit: 28.0,
                isActive: true
            },
            {
                name: '鸡蛋',
                nameEn: 'Eggs',
                category: '蛋类',
                stock: 200,
                unit: 'piece',
                minStockLevel: 50,
                supplier: '江云供应链集团',
                costPerUnit: 0.8,
                isActive: true
            },
            {
                name: '大白菜',
                nameEn: 'Chinese Cabbage',
                category: '蔬菜',
                stock: 80,
                unit: 'kg',
                minStockLevel: 15,
                supplier: '江云供应链集团',
                costPerUnit: 3.5,
                isActive: true
            },
            {
                name: '大米',
                nameEn: 'Rice',
                category: '主食',
                stock: 150,
                unit: 'kg',
                minStockLevel: 30,
                supplier: '江云供应链集团',
                costPerUnit: 6.0,
                isActive: true
            },
            {
                name: '生抽酱油',
                nameEn: 'Light Soy Sauce',
                category: '调料',
                stock: 25,
                unit: 'liter',
                minStockLevel: 5,
                supplier: '江云供应链集团',
                costPerUnit: 12.0,
                isActive: true
            },
            {
                name: '生姜',
                nameEn: 'Fresh Ginger',
                category: '调料',
                stock: 15,
                unit: 'kg',
                minStockLevel: 3,
                supplier: '江云供应链集团',
                costPerUnit: 8.0,
                isActive: true
            },
            {
                name: '大蒜',
                nameEn: 'Garlic',
                category: '调料',
                stock: 12,
                unit: 'kg',
                minStockLevel: 2,
                supplier: '江云供应链集团',
                costPerUnit: 10.0,
                isActive: true
            },
        ];
        // 插入物料数据
        await Ingredient_1.default.insertMany(ingredients);
        console.log(`Inserted ${ingredients.length} ingredients`);
    }
    catch (error) {
        console.error('Error seeding ingredients:', error);
    }
};
const seedSystemConfigs = async () => {
    try {
        // 删除现有系统配置数据
        await SystemConfig_1.default.deleteMany({});
        console.log('Deleted existing system configs');
        // 创建主题配置数据
        const glassTheme = {
            activeTheme: 'glass',
            themeSettings: {
                container: 'bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8',
                card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
                button: 'bg-slate-900 text-white rounded-xl px-6 py-3 font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg',
                text: 'text-slate-800'
            }
        };
        const clayTheme = {
            activeTheme: 'clay',
            themeSettings: {
                container: 'bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen p-4 md:p-8',
                card: 'bg-amber-100 rounded-3xl shadow-xl border-4 border-amber-300 p-6 transform rotate-1 transition-transform hover:rotate-0',
                button: 'bg-amber-800 text-white rounded-2xl px-8 py-4 font-bold hover:bg-amber-700 transition-all duration-300 shadow-lg border-2 border-amber-900',
                text: 'text-amber-900'
            }
        };
        const bentoTheme = {
            activeTheme: 'bento',
            themeSettings: {
                container: 'bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen p-2 md:p-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4',
                card: 'bg-white rounded-xl shadow-md border border-indigo-100 p-4 col-span-1 row-span-1',
                button: 'bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm',
                text: 'text-indigo-900'
            }
        };
        const brutalTheme = {
            activeTheme: 'brutal',
            themeSettings: {
                container: 'bg-yellow-400 min-h-screen p-4 md:p-8 border-8 border-black',
                card: 'bg-white border-4 border-black p-6 font-bold text-black transform hover:translate-x-2 hover:translate-y-2 transition-transform',
                button: 'bg-black text-white border-4 border-black px-6 py-3 font-black hover:bg-gray-800 transition-all transform hover:translate-x-1 hover:translate-y-1',
                text: 'text-black font-bold'
            }
        };
        // 插入主题配置数据 - 只插入一个默认配置
        const defaultConfig = new SystemConfig_1.default({
            activeTheme: 'glass',
            themeSettings: glassTheme.themeSettings
        });
        await defaultConfig.save();
        console.log('Inserted default theme configuration');
    }
    catch (error) {
        console.error('Error seeding system configs:', error);
    }
};
const seedStaff = async () => {
    try {
        // 删除现有员工数据
        await Staff_1.default.deleteMany({});
        console.log('Deleted existing staff');
        // 创建示例员工数据
        const staff = [
            {
                name: '张明华',
                email: 'zhangmh@jiangyun-chef.com',
                role: 'admin',
                phone: '+86 138 1234 5678',
                avatar: '/avatars/zhangmh.jpg',
                isActive: true
            },
            {
                name: '李小红',
                email: 'lixh@jiangyun-chef.com',
                role: 'manager',
                phone: '+86 139 8765 4321',
                avatar: '/avatars/lixh.jpg',
                isActive: true
            },
            {
                name: '王大伟',
                email: 'wangdw@jiangyun-chef.com',
                role: 'kitchen',
                phone: '+86 137 1122 3344',
                avatar: '/avatars/wangdw.jpg',
                isActive: true
            },
            {
                name: '陈美丽',
                email: 'chenml@jiangyun-chef.com',
                role: 'waiter',
                phone: '+86 136 5566 7788',
                avatar: '/avatars/chenml.jpg',
                isActive: true
            },
            {
                name: '刘强东',
                email: 'liuqd@jiangyun-chef.com',
                role: 'cashier',
                phone: '+86 135 9988 7766',
                avatar: '/avatars/liuqd.jpg',
                isActive: true
            },
            {
                name: '赵小芳',
                email: 'zhaoxf@jiangyun-chef.com',
                role: 'kitchen',
                phone: '+86 134 3344 5566',
                avatar: '/avatars/zhaoxf.jpg',
                isActive: true
            },
        ];
        // 插入员工数据
        await Staff_1.default.insertMany(staff);
        console.log(`Inserted ${staff.length} staff members`);
    }
    catch (error) {
        console.error('Error seeding staff:', error);
    }
};
const seedUsers = async () => {
    try {
        // 删除现有用户数据
        await User_1.default.deleteMany({});
        console.log('Deleted existing users');
        // 创建三个演示账号
        const users = [
            {
                name: 'Admin User',
                email: 'admin@jx.com',
                password: '123456',
                role: 'admin',
                defaultLang: 'zh',
                modulePermissions: {
                    dashboard: true,
                    rooms: true,
                    orders: true,
                    dishes: true,
                    supply_chain: true,
                    financial_hub: true,
                    images: true,
                    users: true,
                    settings: true,
                    categories: true,
                    inventory: true,
                    payments: true
                },
                phone: '+86 138 0000 0001',
                isActive: true
            },
            {
                name: 'Staff User',
                email: 'staff@jx.com',
                password: '123456',
                role: 'staff',
                defaultLang: 'en',
                modulePermissions: {
                    dashboard: true,
                    rooms: true,
                    orders: true,
                    dishes: false,
                    supply_chain: false,
                    financial_hub: false,
                    images: false,
                    users: false,
                    settings: false,
                    categories: false,
                    inventory: false,
                    payments: false
                },
                phone: '+86 138 0000 0002',
                isActive: true
            },
            {
                name: 'Partner User',
                email: 'partner@jx.com',
                password: '123456',
                role: 'partner',
                partnerId: '666', // 示例合伙人ID
                defaultLang: 'zh',
                modulePermissions: {
                    dashboard: true,
                    rooms: false,
                    orders: true,
                    dishes: false,
                    supply_chain: true,
                    financial_hub: false,
                    images: false,
                    users: false,
                    settings: false,
                    categories: false,
                    inventory: false,
                    payments: false
                },
                phone: '+86 138 0000 0003',
                isActive: true
            }
        ];
        // 插入用户数据
        await User_1.default.insertMany(users);
        console.log(`Inserted ${users.length} demo users`);
    }
    catch (error) {
        console.error('Error seeding users:', error);
    }
};
const seedNotifications = async () => {
    try {
        // 删除现有通知数据
        await Notification_1.default.deleteMany({});
        console.log('Deleted existing notifications');
        // 创建示例通知数据
        const notifications = [
            {
                title: '系统维护提醒',
                message: '系统将在今晚23:00进行例行维护，预计持续30分钟，请提前安排相关工作',
                type: 'info',
                isRead: false
            },
            {
                title: '库存不足警告',
                message: '五花肉库存已低于最低安全水平，请及时补充',
                type: 'warning',
                isRead: true
            },
            {
                title: '订单处理成功',
                message: '订单 #ORD-20241224-001 已成功处理并分配至厨房',
                type: 'success',
                isRead: true
            },
            {
                title: '网络连接异常',
                message: '检测到POS终端网络连接不稳定，建议检查网络设置',
                type: 'error',
                isRead: false
            },
            {
                title: '新员工入职',
                message: '新员工赵小芳已正式入职，担任厨房助理职务',
                type: 'info',
                isRead: true
            },
            {
                title: '月度报告生成',
                message: '11月份经营报告已生成，请前往财务中心查看详细数据',
                type: 'success',
                isRead: false
            },
        ];
        // 插入通知数据
        await Notification_1.default.insertMany(notifications);
        console.log(`Inserted ${notifications.length} notifications`);
    }
    catch (error) {
        console.error('Error seeding notifications:', error);
    }
};
const seedData = async () => {
    try {
        await connectDB();
        await seedRooms();
        await seedDishes();
        await seedCategories();
        await seedPartners();
        await seedExpenses();
        await seedIngredients();
        await seedSystemConfigs();
        await seedStaff();
        await seedUsers(); // 添加用户数据
        await seedNotifications();
        console.log('✅ 所有 [13] 个模块的数据初始化完成');
        process.exit(0);
    }
    catch (error) {
        console.error('Error in seed process:', error);
        process.exit(1);
    }
};
if (require.main === module) {
    seedData();
}
exports.default = seedData;
