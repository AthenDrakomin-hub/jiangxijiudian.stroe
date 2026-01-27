"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class UserController {
    constructor() {
        // 獲取所有用戶
        this.getAllUsers = async (req, res) => {
            try {
                const users = await User_1.default.find({}, { password: 0 }); // 排除密碼字段
                res.json(users.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                })));
            }
            catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ error: 'Failed to fetch users' });
            }
        };
        // 獲取單個用戶
        this.getUserById = async (req, res) => {
            try {
                const user = await User_1.default.findById(req.params.id, { password: 0 });
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                });
            }
            catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).json({ error: 'Failed to fetch user' });
            }
        };
    }
}
exports.default = new UserController();
