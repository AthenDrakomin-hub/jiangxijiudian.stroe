"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DishSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    nameEn: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: false, // 改为可选
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        trim: true,
    },
    categoryId: {
        type: String,
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isRecommended: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        default: 999,
    },
    partnerId: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
const Dish = mongoose_1.default.model('Dish', DishSchema);
exports.default = Dish;
