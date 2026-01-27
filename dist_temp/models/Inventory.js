"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const inventorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'lb', 'oz', 'liter', 'ml', 'piece', 'pack', 'box']
    },
    minStockLevel: {
        type: Number,
        default: 0,
        min: 0
    },
    supplier: {
        type: String,
        trim: true
    },
    costPerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Inventory', inventorySchema);
