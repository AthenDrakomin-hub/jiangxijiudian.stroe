"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
class CategoriesController {
    constructor() {
        this.getAllCategories = async (req, res) => {
            try {
                const categories = await Category_1.default.find({});
                res.json(categories);
            }
            catch (error) {
                console.error('Error fetching categories:', error);
                res.status(500).json({ error: 'Failed to fetch categories' });
            }
        };
        this.getCategoryById = async (req, res) => {
            try {
                const id = req.params.id;
                const category = await Category_1.default.findById(id);
                if (!category) {
                    res.status(404).json({ error: 'Category not found' });
                    return;
                }
                res.json(category);
            }
            catch (error) {
                console.error('Error fetching category:', error);
                res.status(500).json({ error: 'Failed to fetch category' });
            }
        };
        this.createCategory = async (req, res) => {
            try {
                const { name, description, sortOrder } = req.body;
                const category = new Category_1.default({
                    name,
                    description,
                    sortOrder
                });
                const savedCategory = await category.save();
                res.status(201).json(savedCategory);
            }
            catch (error) {
                console.error('Error creating category:', error);
                res.status(500).json({ error: 'Failed to create category' });
            }
        };
        this.updateCategory = async (req, res) => {
            try {
                const id = req.params.id;
                const { name, description, sortOrder } = req.body;
                const category = await Category_1.default.findByIdAndUpdate(id, { name, description, sortOrder }, { new: true });
                if (!category) {
                    res.status(404).json({ error: 'Category not found' });
                    return;
                }
                res.json(category);
            }
            catch (error) {
                console.error('Error updating category:', error);
                res.status(500).json({ error: 'Failed to update category' });
            }
        };
        this.deleteCategory = async (req, res) => {
            try {
                const id = req.params.id;
                const category = await Category_1.default.findByIdAndDelete(id);
                if (!category) {
                    res.status(404).json({ error: 'Category not found' });
                    return;
                }
                res.json({ message: 'Category deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting category:', error);
                res.status(500).json({ error: 'Failed to delete category' });
            }
        };
    }
}
exports.default = new CategoriesController();
