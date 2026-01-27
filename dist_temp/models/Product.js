"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true, // 自动添加createdAt和updatedAt字段
});
const Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
