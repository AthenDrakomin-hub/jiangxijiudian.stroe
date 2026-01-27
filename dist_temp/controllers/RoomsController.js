"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("../models/Room"));
class RoomsController {
    constructor() {
        this.getRoomByNumber = async (req, res) => {
            try {
                const roomNumber = req.params.roomNumber;
                const room = await Room_1.default.findOne({ roomNumber, isActive: true });
                if (!room) {
                    res.status(404).json({ error: 'Room not found' });
                    return;
                }
                res.json(room);
            }
            catch (error) {
                console.error('Error fetching room:', error);
                res.status(500).json({ error: 'Failed to fetch room' });
            }
        };
        this.getAllRooms = async (req, res) => {
            try {
                const rooms = await Room_1.default.find({});
                res.json(rooms);
            }
            catch (error) {
                console.error('Error fetching rooms:', error);
                res.status(500).json({ error: 'Failed to fetch rooms' });
            }
        };
    }
}
exports.default = new RoomsController();
