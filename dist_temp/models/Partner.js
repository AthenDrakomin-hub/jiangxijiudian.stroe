"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const partnerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['delivery', 'marketing', 'technology', 'other']
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    agreementStartDate: {
        type: Date
    },
    agreementEndDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    commissionRate: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Partner', partnerSchema);
