import { Request, Response } from 'express';
import Dish from '../models/Dish';

class DishesController {
  public getAllDishes = async (req: Request, res: Response): Promise<void> => {
    try {
      const dishes = await Dish.find({ isAvailable: true });
      res.json(dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      res.status(500).json({ error: 'Failed to fetch dishes' });
    }
  };

  public getDishById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const dish = await Dish.findById(id);
      
      if (!dish) {
        res.status(404).json({ error: 'Dish not found' });
        return;
      }
      
      res.json(dish);
    } catch (error) {
      console.error('Error fetching dish:', error);
      res.status(500).json({ error: 'Failed to fetch dish' });
    }
  };

  public createDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, price, description, image, category, isAvailable } = req.body;

      const dish = new Dish({
        name,
        price,
        description,
        image,
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true
      });

      const savedDish = await dish.save();
      res.status(201).json(savedDish);
    } catch (error) {
      console.error('Error creating dish:', error);
      res.status(500).json({ error: 'Failed to create dish' });
    }
  };

  public updateDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { name, price, description, image, category, isAvailable } = req.body;

      const dish = await Dish.findByIdAndUpdate(
        id,
        { name, price, description, image, category, isAvailable },
        { new: true }
      );

      if (!dish) {
        res.status(404).json({ error: 'Dish not found' });
        return;
      }

      res.json(dish);
    } catch (error) {
      console.error('Error updating dish:', error);
      res.status(500).json({ error: 'Failed to update dish' });
    }
  };

  public deleteDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const dish = await Dish.findByIdAndDelete(id);

      if (!dish) {
        res.status(404).json({ error: 'Dish not found' });
        return;
      }

      res.json({ message: 'Dish deleted successfully' });
    } catch (error) {
      console.error('Error deleting dish:', error);
      res.status(500).json({ error: 'Failed to delete dish' });
    }
  };
}

export default new DishesController();