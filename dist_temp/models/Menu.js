"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuSection = exports.Menu = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MenuSectionSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dishes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Dish',
        }],
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const MenuSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sections: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'MenuSection',
        }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// 索引优化
MenuSchema.index({ isActive: 1 });
MenuSchema.index({ name: 1 });
MenuSectionSchema.index({ name: 1 });
const Menu = mongoose_1.default.model('Menu', MenuSchema);
exports.Menu = Menu;
const MenuSection = mongoose_1.default.model('MenuSection', MenuSectionSchema);
exports.MenuSection = MenuSection;
