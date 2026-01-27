"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchema = new mongoose_1.default.Schema({
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    method: {
        type: String,
        enum: ['cash', 'card', 'mobile', 'online'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // 允许空值，但非空值必须唯一
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// 索引优化
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ status: 1 });
const Payment = mongoose_1.default.model('Payment', PaymentSchema);
exports.default = Payment;
