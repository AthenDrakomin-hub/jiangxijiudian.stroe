"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Mongoose Schema（与TS接口IUser完全匹配，添加验证规则）
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, '邮箱不能为空'],
        unique: true,
        lowercase: true, // 统一转小写，避免查询时大小写问题
        trim: true
    },
    password: {
        type: String,
        required: [true, '密码不能为空']
    },
    name: {
        type: String,
        required: [true, '姓名不能为空'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true, // 默认启用用户
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true // 不可修改
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false, // 关闭自动时间戳，手动维护createdAt/updatedAt
    collection: 'users' // 显式指定MongoDB集合名，避免Mongoose自动复数化
});
// 在保存前对密码进行哈希处理的中间件
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const saltRounds = 10;
    this.password = await bcryptjs_1.default.hash(this.password, saltRounds);
    next();
});
// 比较密码的方法
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
// 生成并导出用户模型
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
