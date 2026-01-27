"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DishesController_1 = __importDefault(require("../controllers/DishesController"));
const CategoriesController_1 = __importDefault(require("../controllers/CategoriesController"));
const StaffController_1 = __importDefault(require("../controllers/StaffController"));
const InventoryController_1 = __importDefault(require("../controllers/InventoryController"));
const PaymentController_1 = __importDefault(require("../controllers/PaymentController"));
const FinanceController_1 = __importDefault(require("../controllers/FinanceController"));
const SupplyChainController_1 = __importDefault(require("../controllers/SupplyChainController"));
const PartnerController_1 = __importDefault(require("../controllers/PartnerController"));
const SystemConfigController_1 = __importDefault(require("../controllers/SystemConfigController"));
const IngredientsController_1 = __importDefault(require("../controllers/IngredientsController"));
const ExpenseController_1 = __importDefault(require("../controllers/ExpenseController"));
const RegistrationController_1 = __importDefault(require("../controllers/RegistrationController"));
const QRManagementController_1 = __importDefault(require("../controllers/QRManagementController"));
const roleGuard_1 = require("../middleware/roleGuard");
const router = (0, express_1.Router)();
// 菜品管理相关API
router.get('/dishes', DishesController_1.default.getAllDishes);
router.get('/dishes/:id', DishesController_1.default.getDishById);
router.post('/dishes', DishesController_1.default.createDish);
router.put('/dishes/:id', DishesController_1.default.updateDish);
router.delete('/dishes/:id', DishesController_1.default.deleteDish);
// 分类管理相关API
router.get('/categories', CategoriesController_1.default.getAllCategories);
router.get('/categories/:id', CategoriesController_1.default.getCategoryById);
router.post('/categories', CategoriesController_1.default.createCategory);
router.put('/categories/:id', CategoriesController_1.default.updateCategory);
router.delete('/categories/:id', CategoriesController_1.default.deleteCategory);
// 订单管理相关API（已在api.ts中定义，这里作为参考）
// router.get('/orders', ordersController.getOrders);
// router.get('/orders/:id', ordersController.getOrderById);
// router.patch('/orders/:id/status', ordersController.updateOrderStatus);
// 员工管理相关API
router.get('/staff', StaffController_1.default.getAllStaff);
router.get('/staff/:id', StaffController_1.default.getStaffById);
router.post('/staff', StaffController_1.default.createStaff);
router.put('/staff/:id', StaffController_1.default.updateStaff);
router.delete('/staff/:id', StaffController_1.default.deleteStaff);
// 库存管理相关API
router.get('/inventory', InventoryController_1.default.getAllInventory);
router.get('/inventory/:id', InventoryController_1.default.getInventoryById);
router.post('/inventory', InventoryController_1.default.createInventory);
router.put('/inventory/:id', InventoryController_1.default.updateInventory);
router.delete('/inventory/:id', InventoryController_1.default.deleteInventory);
// 支付管理相关API
router.get('/payments', PaymentController_1.default.getAllPayments);
router.get('/payments/:id', PaymentController_1.default.getPaymentById);
router.post('/payments', PaymentController_1.default.createPayment);
router.put('/payments/:id', PaymentController_1.default.updatePayment);
router.delete('/payments/:id', PaymentController_1.default.deletePayment);
// 财务管理相关API - 仅允许 admin
router.get('/finance', (0, roleGuard_1.verifyRole)(['admin']), FinanceController_1.default.getAllFinanceRecords);
router.get('/finance/:id', (0, roleGuard_1.verifyRole)(['admin']), FinanceController_1.default.getFinanceRecordById);
router.post('/finance', (0, roleGuard_1.verifyRole)(['admin']), FinanceController_1.default.createFinanceRecord);
router.put('/finance/:id', (0, roleGuard_1.verifyRole)(['admin']), FinanceController_1.default.updateFinanceRecord);
router.delete('/finance/:id', (0, roleGuard_1.verifyRole)(['admin']), FinanceController_1.default.deleteFinanceRecord);
// 供应链管理相关API - 如果用户是 partner，则应用数据过滤
router.get('/supply-chain', roleGuard_1.partnerFilterMiddleware, SupplyChainController_1.default.getAllSuppliers);
router.get('/supply-chain/:id', roleGuard_1.partnerFilterMiddleware, SupplyChainController_1.default.getSupplierById);
router.post('/supply-chain', (0, roleGuard_1.verifyRole)(['admin', 'partner']), SupplyChainController_1.default.createSupplier);
router.put('/supply-chain/:id', (0, roleGuard_1.verifyRole)(['admin', 'partner']), SupplyChainController_1.default.updateSupplier);
router.delete('/supply-chain/:id', (0, roleGuard_1.verifyRole)(['admin']), SupplyChainController_1.default.deleteSupplier);
// 合作伙伴管理相关API
router.get('/partners', PartnerController_1.default.getAllPartners);
router.get('/partners/:id', PartnerController_1.default.getPartnerById);
router.post('/partners', PartnerController_1.default.createPartner);
router.put('/partners/:id', PartnerController_1.default.updatePartner);
router.delete('/partners/:id', PartnerController_1.default.deletePartner);
// 食材管理相关API
router.get('/ingredients', IngredientsController_1.default.getAllIngredients);
router.get('/ingredients/:id', IngredientsController_1.default.getIngredientById);
router.post('/ingredients', IngredientsController_1.default.createIngredient);
router.put('/ingredients/:id', IngredientsController_1.default.updateIngredient);
router.delete('/ingredients/:id', IngredientsController_1.default.deleteIngredient);
// 支出管理相关API
router.get('/expenses', ExpenseController_1.default.getAllExpenses);
router.get('/expenses/:id', ExpenseController_1.default.getExpenseById);
router.post('/expenses', ExpenseController_1.default.createExpense);
router.put('/expenses/:id', ExpenseController_1.default.updateExpense);
router.delete('/expenses/:id', ExpenseController_1.default.deleteExpense);
// 系统配置管理相关API
router.get('/config', SystemConfigController_1.default.getConfig);
router.patch('/config', SystemConfigController_1.default.updateConfig);
// 用户注册审核相关API
router.post('/registration', RegistrationController_1.default.submitRegistration);
router.get('/registration/verify/:token', RegistrationController_1.default.verifyRegistration);
router.patch('/registration/approve/:id', RegistrationController_1.default.approveRegistration);
// 二维码管理相关API
router.get('/qr/config', (0, roleGuard_1.verifyRole)(['admin']), QRManagementController_1.default.getQRConfig);
router.post('/qr/generate/:roomNumber', (0, roleGuard_1.verifyRole)(['admin']), QRManagementController_1.default.generateRoomQR);
router.post('/qr/generate-all', (0, roleGuard_1.verifyRole)(['admin']), QRManagementController_1.default.generateAllQR);
router.get('/qr/svg/:roomNumber', (0, roleGuard_1.verifyRole)(['admin']), QRManagementController_1.default.generateQRSVG);
exports.default = router;
