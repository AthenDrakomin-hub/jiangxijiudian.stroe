import { Request, Response } from 'express';
import Staff from '../models/Staff';

class StaffController {
  public getAllStaff = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, isActive } = req.query;
      const filters: any = {};

      if (role) {
        filters.role = role;
      }
      
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const staff = await Staff.find(filters);
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Failed to fetch staff' });
    }
  };

  public getStaffById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const staff = await Staff.findById(id);
      
      if (!staff) {
        res.status(404).json({ error: 'Staff member not found' });
        return;
      }
      
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Failed to fetch staff' });
    }
  };

  public createStaff = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, role, phone, avatar } = req.body;

      const staff = new Staff({
        name,
        email,
        role,
        phone,
        avatar
      });

      const savedStaff = await staff.save();
      res.status(201).json(savedStaff);
    } catch (error) {
      console.error('Error creating staff:', error);
      res.status(500).json({ error: 'Failed to create staff' });
    }
  };

  public updateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { name, email, role, phone, avatar, isActive } = req.body;

      const staff = await Staff.findByIdAndUpdate(
        id,
        { name, email, role, phone, avatar, isActive },
        { new: true }
      );

      if (!staff) {
        res.status(404).json({ error: 'Staff member not found' });
        return;
      }

      res.json(staff);
    } catch (error) {
      console.error('Error updating staff:', error);
      res.status(500).json({ error: 'Failed to update staff' });
    }
  };

  public deleteStaff = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const staff = await Staff.findByIdAndDelete(id);

      if (!staff) {
        res.status(404).json({ error: 'Staff member not found' });
        return;
      }

      res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
      console.error('Error deleting staff:', error);
      res.status(500).json({ error: 'Failed to delete staff' });
    }
  };
}

export default new StaffController();