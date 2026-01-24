import { Request, Response } from 'express';
import Category from '../models/Category';

class CategoriesController {
  public getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await Category.find({});
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  };

  public getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const category = await Category.findById(id);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  };

  public createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, sortOrder } = req.body;

      const category = new Category({
        name,
        description,
        sortOrder
      });

      const savedCategory = await category.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  };

  public updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { name, description, sortOrder } = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { name, description, sortOrder },
        { new: true }
      );

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  };

  public deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  };
}

export default new CategoriesController();