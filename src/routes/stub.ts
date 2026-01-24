import { Router } from 'express';
import Partner from '../models/Partner';
import Expense from '../models/Expense';
import Ingredient from '../models/Ingredient';
import Category from '../models/Category';

const router = Router();

// 基础数据模型的通用路由
router.get('/partners', async (_req, res) => {
  try {
    const partners = await Partner.find({});
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

router.get('/expenses', async (_req, res) => {
  try {
    const expenses = await Expense.find({});
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});



export default router;