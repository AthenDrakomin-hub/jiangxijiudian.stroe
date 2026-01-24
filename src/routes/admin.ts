import { Router } from 'express';
import dishesController from '../controllers/DishesController';
import categoriesController from '../controllers/CategoriesController';
import ordersController from '../controllers/OrdersController';
import staffController from '../controllers/StaffController';
import inventoryController from '../controllers/InventoryController';
import paymentController from '../controllers/PaymentController';
import financeController from '../controllers/FinanceController';
import supplyChainController from '../controllers/SupplyChainController';
import partnerController from '../controllers/PartnerController';
import systemConfigController from '../controllers/SystemConfigController';
import registrationController from '../controllers/RegistrationController';
import IngredientsController from '../controllers/IngredientsController';
import ExpenseController from '../controllers/ExpenseController';
import SystemConfigController from '../controllers/SystemConfigController';
import RegistrationController from '../controllers/RegistrationController';
import { verifyRole, partnerFilterMiddleware } from '../middleware/roleGuard';

const router = Router();

// 菜品管理相关API
router.get('/dishes', dishesController.getAllDishes);
router.get('/dishes/:id', dishesController.getDishById);
router.post('/dishes', dishesController.createDish);
router.put('/dishes/:id', dishesController.updateDish);
router.delete('/dishes/:id', dishesController.deleteDish);

// 分类管理相关API
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id', categoriesController.getCategoryById);
router.post('/categories', categoriesController.createCategory);
router.put('/categories/:id', categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

// 订单管理相关API（已在api.ts中定义，这里作为参考）
// router.get('/orders', ordersController.getOrders);
// router.get('/orders/:id', ordersController.getOrderById);
// router.patch('/orders/:id/status', ordersController.updateOrderStatus);

// 员工管理相关API
router.get('/staff', staffController.getAllStaff);
router.get('/staff/:id', staffController.getStaffById);
router.post('/staff', staffController.createStaff);
router.put('/staff/:id', staffController.updateStaff);
router.delete('/staff/:id', staffController.deleteStaff);

// 库存管理相关API
router.get('/inventory', inventoryController.getAllInventory);
router.get('/inventory/:id', inventoryController.getInventoryById);
router.post('/inventory', inventoryController.createInventory);
router.put('/inventory/:id', inventoryController.updateInventory);
router.delete('/inventory/:id', inventoryController.deleteInventory);

// 支付管理相关API
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.post('/payments', paymentController.createPayment);
router.put('/payments/:id', paymentController.updatePayment);
router.delete('/payments/:id', paymentController.deletePayment);

// 财务管理相关API - 仅允许 admin
router.get('/finance', verifyRole(['admin']), financeController.getAllFinanceRecords);
router.get('/finance/:id', verifyRole(['admin']), financeController.getFinanceRecordById);
router.post('/finance', verifyRole(['admin']), financeController.createFinanceRecord);
router.put('/finance/:id', verifyRole(['admin']), financeController.updateFinanceRecord);
router.delete('/finance/:id', verifyRole(['admin']), financeController.deleteFinanceRecord);

// 供应链管理相关API - 如果用户是 partner，则应用数据过滤
router.get('/supply-chain', partnerFilterMiddleware, supplyChainController.getAllSuppliers);
router.get('/supply-chain/:id', partnerFilterMiddleware, supplyChainController.getSupplierById);
router.post('/supply-chain', verifyRole(['admin', 'partner']), supplyChainController.createSupplier);
router.put('/supply-chain/:id', verifyRole(['admin', 'partner']), supplyChainController.updateSupplier);
router.delete('/supply-chain/:id', verifyRole(['admin']), supplyChainController.deleteSupplier);

// 合作伙伴管理相关API
router.get('/partners', partnerController.getAllPartners);
router.get('/partners/:id', partnerController.getPartnerById);
router.post('/partners', partnerController.createPartner);
router.put('/partners/:id', partnerController.updatePartner);
router.delete('/partners/:id', partnerController.deletePartner);

// 食材管理相关API
router.get('/ingredients', IngredientsController.getAllIngredients);
router.get('/ingredients/:id', IngredientsController.getIngredientById);
router.post('/ingredients', IngredientsController.createIngredient);
router.put('/ingredients/:id', IngredientsController.updateIngredient);
router.delete('/ingredients/:id', IngredientsController.deleteIngredient);

// 支出管理相关API
router.get('/expenses', ExpenseController.getAllExpenses);
router.get('/expenses/:id', ExpenseController.getExpenseById);
router.post('/expenses', ExpenseController.createExpense);
router.put('/expenses/:id', ExpenseController.updateExpense);
router.delete('/expenses/:id', ExpenseController.deleteExpense);

// 系统配置管理相关API
router.get('/config', systemConfigController.getConfig);
router.patch('/config', systemConfigController.updateConfig);

// 用户注册审核相关API
router.post('/registration', RegistrationController.submitRegistration);
router.get('/registration/verify/:token', RegistrationController.verifyRegistration);
router.patch('/registration/approve/:id', RegistrationController.approveRegistration);

export default router;