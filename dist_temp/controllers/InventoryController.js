"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = __importDefault(require("../models/Inventory"));
class InventoryController {
    constructor() {
        this.getAllInventory = async (req, res) => {
            try {
                const { category, lowStock, isActive } = req.query;
                const filters = {};
                if (category) {
                    filters.category = category;
                }
                if (lowStock === 'true') {
                    // 查找库存低于最小库存水平的商品
                    const inventories = await Inventory_1.default.find({});
                    const lowStockItems = inventories.filter(item => item.quantity <= item.minStockLevel);
                    res.json(lowStockItems);
                    return;
                }
                if (isActive !== undefined) {
                    filters.isActive = isActive === 'true';
                }
                const inventory = await Inventory_1.default.find(filters);
                res.json(inventory);
            }
            catch (error) {
                console.error('Error fetching inventory:', error);
                res.status(500).json({ error: 'Failed to fetch inventory' });
            }
        };
        this.getInventoryById = async (req, res) => {
            try {
                const id = req.params.id;
                const inventory = await Inventory_1.default.findById(id);
                if (!inventory) {
                    res.status(404).json({ error: 'Inventory item not found' });
                    return;
                }
                res.json(inventory);
            }
            catch (error) {
                console.error('Error fetching inventory:', error);
                res.status(500).json({ error: 'Failed to fetch inventory' });
            }
        };
        this.createInventory = async (req, res) => {
            try {
                const { name, sku, quantity, unit, minStockLevel, supplier, costPerUnit, category, description } = req.body;
                const inventory = new Inventory_1.default({
                    name,
                    sku,
                    quantity,
                    unit,
                    minStockLevel,
                    supplier,
                    costPerUnit,
                    category,
                    description
                });
                const savedInventory = await inventory.save();
                res.status(201).json(savedInventory);
            }
            catch (error) {
                console.error('Error creating inventory:', error);
                res.status(500).json({ error: 'Failed to create inventory' });
            }
        };
        this.updateInventory = async (req, res) => {
            try {
                const id = req.params.id;
                const { name, sku, quantity, unit, minStockLevel, supplier, costPerUnit, category, description, isActive } = req.body;
                const inventory = await Inventory_1.default.findByIdAndUpdate(id, { name, sku, quantity, unit, minStockLevel, supplier, costPerUnit, category, description, isActive }, { new: true });
                if (!inventory) {
                    res.status(404).json({ error: 'Inventory item not found' });
                    return;
                }
                res.json(inventory);
            }
            catch (error) {
                console.error('Error updating inventory:', error);
                res.status(500).json({ error: 'Failed to update inventory' });
            }
        };
        this.deleteInventory = async (req, res) => {
            try {
                const id = req.params.id;
                const inventory = await Inventory_1.default.findByIdAndDelete(id);
                if (!inventory) {
                    res.status(404).json({ error: 'Inventory item not found' });
                    return;
                }
                res.json({ message: 'Inventory item deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting inventory:', error);
                res.status(500).json({ error: 'Failed to delete inventory' });
            }
        };
    }
}
exports.default = new InventoryController();
