"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    tableName: {
        type: String,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'maintenance'],
        default: 'available',
    },
    occupiedBy: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// 索引优化
// roomNumber 的唯一索引由 unique: true 自动生成，无需手动添加
RoomSchema.index({ status: 1 });
const Room = mongoose_1.default.model('Room', RoomSchema);
exports.default = Room;
