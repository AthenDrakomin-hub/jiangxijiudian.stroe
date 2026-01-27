"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Staff_1 = __importDefault(require("../models/Staff"));
class StaffController {
    constructor() {
        this.getAllStaff = async (req, res) => {
            try {
                const { role, isActive } = req.query;
                const filters = {};
                if (role) {
                    filters.role = role;
                }
                if (isActive !== undefined) {
                    filters.isActive = isActive === 'true';
                }
                const staff = await Staff_1.default.find(filters);
                res.json(staff);
            }
            catch (error) {
                console.error('Error fetching staff:', error);
                res.status(500).json({ error: 'Failed to fetch staff' });
            }
        };
        this.getStaffById = async (req, res) => {
            try {
                const id = req.params.id;
                const staff = await Staff_1.default.findById(id);
                if (!staff) {
                    res.status(404).json({ error: 'Staff member not found' });
                    return;
                }
                res.json(staff);
            }
            catch (error) {
                console.error('Error fetching staff:', error);
                res.status(500).json({ error: 'Failed to fetch staff' });
            }
        };
        this.createStaff = async (req, res) => {
            try {
                const { name, email, role, phone, avatar } = req.body;
                const staff = new Staff_1.default({
                    name,
                    email,
                    role,
                    phone,
                    avatar
                });
                const savedStaff = await staff.save();
                res.status(201).json(savedStaff);
            }
            catch (error) {
                console.error('Error creating staff:', error);
                res.status(500).json({ error: 'Failed to create staff' });
            }
        };
        this.updateStaff = async (req, res) => {
            try {
                const id = req.params.id;
                const { name, email, role, phone, avatar, isActive } = req.body;
                const staff = await Staff_1.default.findByIdAndUpdate(id, { name, email, role, phone, avatar, isActive }, { new: true });
                if (!staff) {
                    res.status(404).json({ error: 'Staff member not found' });
                    return;
                }
                res.json(staff);
            }
            catch (error) {
                console.error('Error updating staff:', error);
                res.status(500).json({ error: 'Failed to update staff' });
            }
        };
        this.deleteStaff = async (req, res) => {
            try {
                const id = req.params.id;
                const staff = await Staff_1.default.findByIdAndDelete(id);
                if (!staff) {
                    res.status(404).json({ error: 'Staff member not found' });
                    return;
                }
                res.json({ message: 'Staff member deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting staff:', error);
                res.status(500).json({ error: 'Failed to delete staff' });
            }
        };
    }
}
exports.default = new StaffController();
