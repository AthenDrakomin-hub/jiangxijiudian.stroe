import { Request, Response } from 'express';
import Expense from '../models/Expense';

class ExpenseController {
  public getAllExpenses = async (req: Request, res: Response) => {
    try {
      const expenses = await Expense.find({});
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  };

  public getExpenseById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id);
      
      if (!expense) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      
      res.json(expense);
    } catch (error) {
      console.error('Error fetching expense:', error);
      res.status(500).json({ error: 'Failed to fetch expense' });
    }
  };

  public createExpense = async (req: Request, res: Response) => {
    try {
      const expense = new Expense(req.body);
      const savedExpense = await expense.save();
      res.status(201).json(savedExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Failed to create expense' });
    }
  };

  public updateExpense = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!expense) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      
      res.json(expense);
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'Failed to update expense' });
    }
  };

  public deleteExpense = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findByIdAndDelete(id);
      
      if (!expense) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  };
}

export default new ExpenseController();