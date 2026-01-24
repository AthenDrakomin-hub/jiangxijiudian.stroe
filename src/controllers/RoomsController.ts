import { Request, Response } from 'express';
import Room from '../models/Room';



class RoomsController {
  public getRoomByNumber = async (req: Request, res: Response): Promise<void> => {
    try {
      const roomNumber = req.params.roomNumber;
      
      const room = await Room.findOne({ roomNumber, isActive: true });
      
      if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      
      res.json(room);
    } catch (error) {
      console.error('Error fetching room:', error);
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  };

  public getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
      const rooms = await Room.find({});
      res.json(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  };
}

export default new RoomsController();