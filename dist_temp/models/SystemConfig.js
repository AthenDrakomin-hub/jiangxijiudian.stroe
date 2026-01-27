"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SystemConfigSchema = new mongoose_1.default.Schema({
    activeTheme: {
        type: String,
        required: true,
        default: 'glass',
        enum: ['glass', 'clay', 'bento', 'brutal']
    },
    themeSettings: {
        container: {
            type: String,
            required: true,
            default: ''
        },
        card: {
            type: String,
            required: true,
            default: ''
        },
        button: {
            type: String,
            required: true,
            default: ''
        },
        text: {
            type: String,
            required: true,
            default: ''
        }
    }
}, {
    timestamps: true,
});
const SystemConfig = mongoose_1.default.model('SystemConfig', SystemConfigSchema);
exports.default = SystemConfig;
