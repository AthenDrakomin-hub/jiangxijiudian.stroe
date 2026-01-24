import { Request, Response } from 'express';
import Inventory from '../models/Inventory';

class InventoryController {
  public getAllInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, lowStock, isActive } = req.query;
      const filters: any = {};

      if (category) {
        filters.category = category;
      }
      
      if (lowStock === 'true') {
        // 查找库存低于最小库存水平的商品
        const inventories = await Inventory.find({});
        const lowStockItems = inventories.filter(item => item.quantity <= item.minStockLevel);
        res.json(lowStockItems);
        return;
      }
      
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const inventory = await Inventory.find(filters);
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  };

  public getInventoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const inventory = await Inventory.findById(id);
      
      if (!inventory) {
        res.status(404).json({ error: 'Inventory item not found' });
        return;
      }
      
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  };

  public createInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, sku, quantity, unit, minStockLevel, supplier, costPerUnit, category, description } = req.body;

      const inventory = new Inventory({
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
    } catch (error) {
      console.error('Error creating inventory:', error);
      res.status(500).json({ error: 'Failed to create inventory' });
    }
  };

  public updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { name, sku, quantity, unit, minStockLevel, supplier, costPerUnit, category, description, isActive } = req.body;

      const inventory = await Inventory.findByIdAndUpdate(
        id,
        { name, sku, quantity, unit, minStockLevel, supplier, costPerUnit, category, description, isActive },
        { new: true }
      );

      if (!inventory) {
        res.status(404).json({ error: 'Inventory item not found' });
        return;
      }

      res.json(inventory);
    } catch (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  };

  public deleteInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const inventory = await Inventory.findByIdAndDelete(id);

      if (!inventory) {
        res.status(404).json({ error: 'Inventory item not found' });
        return;
      }

      res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
      console.error('Error deleting inventory:', error);
      res.status(500).json({ error: 'Failed to delete inventory' });
    }
  };
}

export default new InventoryController();