"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ingredient_1 = __importDefault(require("../models/Ingredient"));
class IngredientsController {
    constructor() {
        this.getAllIngredients = async (req, res) => {
            try {
                const ingredients = await Ingredient_1.default.find({});
                res.json(ingredients);
            }
            catch (error) {
                console.error('Error fetching ingredients:', error);
                res.status(500).json({ error: 'Failed to fetch ingredients' });
            }
        };
        this.getIngredientById = async (req, res) => {
            try {
                const { id } = req.params;
                const ingredient = await Ingredient_1.default.findById(id);
                if (!ingredient) {
                    res.status(404).json({ error: 'Ingredient not found' });
                    return;
                }
                res.json(ingredient);
            }
            catch (error) {
                console.error('Error fetching ingredient:', error);
                res.status(500).json({ error: 'Failed to fetch ingredient' });
            }
        };
        this.createIngredient = async (req, res) => {
            try {
                const ingredient = new Ingredient_1.default(req.body);
                const savedIngredient = await ingredient.save();
                res.status(201).json(savedIngredient);
            }
            catch (error) {
                console.error('Error creating ingredient:', error);
                res.status(500).json({ error: 'Failed to create ingredient' });
            }
        };
        this.updateIngredient = async (req, res) => {
            try {
                const { id } = req.params;
                const ingredient = await Ingredient_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
                if (!ingredient) {
                    res.status(404).json({ error: 'Ingredient not found' });
                    return;
                }
                res.json(ingredient);
            }
            catch (error) {
                console.error('Error updating ingredient:', error);
                res.status(500).json({ error: 'Failed to update ingredient' });
            }
        };
        this.deleteIngredient = async (req, res) => {
            try {
                const { id } = req.params;
                const ingredient = await Ingredient_1.default.findByIdAndDelete(id);
                if (!ingredient) {
                    res.status(404).json({ error: 'Ingredient not found' });
                    return;
                }
                res.json({ message: 'Ingredient deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting ingredient:', error);
                res.status(500).json({ error: 'Failed to delete ingredient' });
            }
        };
    }
}
exports.default = new IngredientsController();
