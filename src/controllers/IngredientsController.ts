import { Request, Response } from 'express';
import Ingredient from '../models/Ingredient';

class IngredientsController {
  public getAllIngredients = async (req: Request, res: Response) => {
    try {
      const ingredients = await Ingredient.find({});
      res.json(ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
  };

  public getIngredientById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ingredient = await Ingredient.findById(id);
      
      if (!ingredient) {
        res.status(404).json({ error: 'Ingredient not found' });
        return;
      }
      
      res.json(ingredient);
    } catch (error) {
      console.error('Error fetching ingredient:', error);
      res.status(500).json({ error: 'Failed to fetch ingredient' });
    }
  };

  public createIngredient = async (req: Request, res: Response) => {
    try {
      const ingredient = new Ingredient(req.body);
      const savedIngredient = await ingredient.save();
      res.status(201).json(savedIngredient);
    } catch (error) {
      console.error('Error creating ingredient:', error);
      res.status(500).json({ error: 'Failed to create ingredient' });
    }
  };

  public updateIngredient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ingredient = await Ingredient.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!ingredient) {
        res.status(404).json({ error: 'Ingredient not found' });
        return;
      }
      
      res.json(ingredient);
    } catch (error) {
      console.error('Error updating ingredient:', error);
      res.status(500).json({ error: 'Failed to update ingredient' });
    }
  };

  public deleteIngredient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ingredient = await Ingredient.findByIdAndDelete(id);
      
      if (!ingredient) {
        res.status(404).json({ error: 'Ingredient not found' });
        return;
      }
      
      res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      res.status(500).json({ error: 'Failed to delete ingredient' });
    }
  };
}

export default new IngredientsController();