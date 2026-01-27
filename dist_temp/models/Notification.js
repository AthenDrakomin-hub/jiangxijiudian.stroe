"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info',
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// 索引优化
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
const Notification = mongoose_1.default.model('Notification', NotificationSchema);
exports.default = Notification;
