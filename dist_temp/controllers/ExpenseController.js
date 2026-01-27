"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpenseController {
    constructor() {
        this.getAllExpenses = async (req, res) => {
            try {
                const expenses = await Expense_1.default.find({});
                res.json(expenses);
            }
            catch (error) {
                console.error('Error fetching expenses:', error);
                res.status(500).json({ error: 'Failed to fetch expenses' });
            }
        };
        this.getExpenseById = async (req, res) => {
            try {
                const { id } = req.params;
                const expense = await Expense_1.default.findById(id);
                if (!expense) {
                    res.status(404).json({ error: 'Expense not found' });
                    return;
                }
                res.json(expense);
            }
            catch (error) {
                console.error('Error fetching expense:', error);
                res.status(500).json({ error: 'Failed to fetch expense' });
            }
        };
        this.createExpense = async (req, res) => {
            try {
                const expense = new Expense_1.default(req.body);
                const savedExpense = await expense.save();
                res.status(201).json(savedExpense);
            }
            catch (error) {
                console.error('Error creating expense:', error);
                res.status(500).json({ error: 'Failed to create expense' });
            }
        };
        this.updateExpense = async (req, res) => {
            try {
                const { id } = req.params;
                const expense = await Expense_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
                if (!expense) {
                    res.status(404).json({ error: 'Expense not found' });
                    return;
                }
                res.json(expense);
            }
            catch (error) {
                console.error('Error updating expense:', error);
                res.status(500).json({ error: 'Failed to update expense' });
            }
        };
        this.deleteExpense = async (req, res) => {
            try {
                const { id } = req.params;
                const expense = await Expense_1.default.findByIdAndDelete(id);
                if (!expense) {
                    res.status(404).json({ error: 'Expense not found' });
                    return;
                }
                res.json({ message: 'Expense deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting expense:', error);
                res.status(500).json({ error: 'Failed to delete expense' });
            }
        };
    }
}
exports.default = new ExpenseController();
