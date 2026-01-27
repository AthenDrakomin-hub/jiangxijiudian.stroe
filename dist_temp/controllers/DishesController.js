"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dish_1 = __importDefault(require("../models/Dish"));
class DishesController {
    constructor() {
        this.getAllDishes = async (req, res) => {
            try {
                const dishes = await Dish_1.default.find({ isAvailable: true });
                res.json(dishes);
            }
            catch (error) {
                console.error('Error fetching dishes:', error);
                res.status(500).json({ error: 'Failed to fetch dishes' });
            }
        };
        this.getDishById = async (req, res) => {
            try {
                const id = req.params.id;
                const dish = await Dish_1.default.findById(id);
                if (!dish) {
                    res.status(404).json({ error: 'Dish not found' });
                    return;
                }
                res.json(dish);
            }
            catch (error) {
                console.error('Error fetching dish:', error);
                res.status(500).json({ error: 'Failed to fetch dish' });
            }
        };
        this.createDish = async (req, res) => {
            try {
                const { name, price, description, image, category, isAvailable } = req.body;
                const dish = new Dish_1.default({
                    name,
                    price,
                    description,
                    image,
                    category,
                    isAvailable: isAvailable !== undefined ? isAvailable : true
                });
                const savedDish = await dish.save();
                res.status(201).json(savedDish);
            }
            catch (error) {
                console.error('Error creating dish:', error);
                res.status(500).json({ error: 'Failed to create dish' });
            }
        };
        this.updateDish = async (req, res) => {
            try {
                const id = req.params.id;
                const { name, price, description, image, category, isAvailable } = req.body;
                const dish = await Dish_1.default.findByIdAndUpdate(id, { name, price, description, image, category, isAvailable }, { new: true });
                if (!dish) {
                    res.status(404).json({ error: 'Dish not found' });
                    return;
                }
                res.json(dish);
            }
            catch (error) {
                console.error('Error updating dish:', error);
                res.status(500).json({ error: 'Failed to update dish' });
            }
        };
        this.deleteDish = async (req, res) => {
            try {
                const id = req.params.id;
                const dish = await Dish_1.default.findByIdAndDelete(id);
                if (!dish) {
                    res.status(404).json({ error: 'Dish not found' });
                    return;
                }
                res.json({ message: 'Dish deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting dish:', error);
                res.status(500).json({ error: 'Failed to delete dish' });
            }
        };
    }
}
exports.default = new DishesController();
