"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("../models/Room"));
const qrGenerator_1 = __importDefault(require("../utils/qrGenerator"));
class QRManagementController {
    constructor() {
        // 生成单个房间二维码
        this.generateRoomQR = async (req, res) => {
            try {
                const { roomNumber } = req.params;
                const { baseUrl } = req.body;
                if (!roomNumber) {
                    res.status(400).json({ error: '房间号不能为空' });
                    return;
                }
                if (!baseUrl) {
                    res.status(400).json({ error: '基础URL不能为空' });
                    return;
                }
                // 验证房间是否存在
                const room = await Room_1.default.findOne({ roomNumber });
                if (!room) {
                    res.status(404).json({ error: '房间不存在' });
                    return;
                }
                // 生成二维码
                const qrCode = await qrGenerator_1.default.generateRoomQRCode(roomNumber, baseUrl);
                res.json({
                    roomNumber,
                    tableName: room.tableName,
                    qrCode,
                    orderUrl: `${baseUrl}/order/${roomNumber}`
                });
            }
            catch (error) {
                console.error('生成房间二维码失败:', error);
                res.status(500).json({ error: '生成二维码失败' });
            }
        };
        // 批量生成所有房间二维码
        this.generateAllQR = async (req, res) => {
            try {
                const { baseUrl } = req.body;
                if (!baseUrl) {
                    res.status(400).json({ error: '基础URL不能为空' });
                    return;
                }
                // 获取所有房间
                const rooms = await Room_1.default.find({});
                const roomNumbers = rooms.map(room => room.roomNumber);
                // 批量生成二维码
                const qrCodes = await qrGenerator_1.default.generateBatchQRCode(roomNumbers, baseUrl);
                res.json({
                    totalCount: rooms.length,
                    generatedCount: qrCodes.length,
                    qrCodes: qrCodes.map(qr => ({
                        ...qr,
                        orderUrl: `${baseUrl}/order/${qr.roomNumber}`,
                        tableName: rooms.find(r => r.roomNumber === qr.roomNumber)?.tableName
                    }))
                });
            }
            catch (error) {
                console.error('批量生成二维码失败:', error);
                res.status(500).json({ error: '批量生成二维码失败' });
            }
        };
        // 生成二维码SVG格式
        this.generateQRSVG = async (req, res) => {
            try {
                const { roomNumber } = req.params;
                const { baseUrl } = req.body;
                if (!roomNumber) {
                    res.status(400).json({ error: '房间号不能为空' });
                    return;
                }
                if (!baseUrl) {
                    res.status(400).json({ error: '基础URL不能为空' });
                    return;
                }
                // 验证房间
                const room = await Room_1.default.findOne({ roomNumber });
                if (!room) {
                    res.status(404).json({ error: '房间不存在' });
                    return;
                }
                // 生成SVG格式二维码
                const svgQR = await qrGenerator_1.default.generateQRCodeSVG(roomNumber, baseUrl);
                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Content-Disposition', `attachment; filename="qr-${roomNumber}.svg"`);
                res.send(svgQR);
            }
            catch (error) {
                console.error('生成SVG二维码失败:', error);
                res.status(500).json({ error: '生成SVG二维码失败' });
            }
        };
        // 获取二维码生成配置
        this.getQRConfig = async (req, res) => {
            try {
                const rooms = await Room_1.default.find({});
                res.json({
                    roomCount: rooms.length,
                    sampleBaseUrl: 'https://your-frontend-domain.com',
                    supportedFormats: ['PNG', 'SVG'],
                    apiUrl: '/api/admin/qr/generate',
                    batchApiUrl: '/api/admin/qr/generate-all'
                });
            }
            catch (error) {
                console.error('获取QR配置失败:', error);
                res.status(500).json({ error: '获取配置失败' });
            }
        };
    }
}
exports.default = new QRManagementController();
