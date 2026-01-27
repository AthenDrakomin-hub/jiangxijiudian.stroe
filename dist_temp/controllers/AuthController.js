"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
/**
 * 登录接口控制器（TS类式写法，完整类型约束）
 */
class AuthController {
    constructor() {
        /**
         * 处理用户登录请求
         * @param req Express请求对象
         * @param res Express响应对象
         */
        this.login = async (req, res) => {
            try {
                console.log('🔐 开始处理登录请求...');
                const { email, password } = req.body;
                // 入参日志（隐藏密码明文）
                console.log('📋 接收到的参数:', { email, password: password ? '***' : '未提供' });
                // 1. 入参非空校验
                if (!email || !password) {
                    console.warn('❌ 登录参数缺失:', { email: !!email, password: !!password });
                    res.status(400).json({
                        success: false,
                        error: '邮箱和密码不能为空'
                    });
                    return;
                }
                // 2. 根据邮箱查询用户（统一转小写，与模型匹配）
                const lowerEmail = email.toLowerCase().trim();
                console.log('🔍 正在查询用户:', lowerEmail);
                const user = await User_1.default.findOne({ email: lowerEmail });
                // 用户不存在校验
                if (!user) {
                    console.warn('❌ 用户不存在:', lowerEmail);
                    res.status(401).json({
                        success: false,
                        error: '邮箱或密码错误'
                    });
                    return;
                }
                console.log('👤 找到用户:', {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    isActive: user.isActive
                });
                // 3. 用户状态校验（是否启用）
                if (!user.isActive) {
                    console.warn('❌ 用户账户已停用:', user.email);
                    res.status(401).json({
                        success: false,
                        error: '账户已被停用，请联系管理员'
                    });
                    return;
                }
                // 4. bcrypt密码校验（明文 → 数据库密文）
                console.log('🔑 开始密码校验...');
                const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    console.warn('❌ 密码校验失败:', user.email);
                    res.status(401).json({
                        success: false,
                        error: '邮箱或密码错误'
                    });
                    return;
                }
                console.log('✅ 密码校验成功');
                // 5. 登录成功响应（返回核心用户信息，隐藏敏感字段）
                const responseData = {
                    success: true,
                    message: '登录成功',
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name
                    }
                };
                console.log('🎉 登录成功:', responseData.user);
                res.status(200).json(responseData);
            }
            catch (error) {
                console.error('💥 登录接口执行异常:');
                console.error('📋 错误详情:', {
                    message: error.message,
                    stack: error.stack
                });
                // 服务器内部错误统一响应
                res.status(500).json({
                    success: false,
                    error: '服务器内部错误'
                });
            }
        };
    }
}
// 导出单例控制器（避免重复实例化）
exports.default = new AuthController();
