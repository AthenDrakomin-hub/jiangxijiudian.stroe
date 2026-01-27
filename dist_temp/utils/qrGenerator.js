"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = __importDefault(require("qrcode"));
class QRGenerator {
    /**
     * 生成房间点餐二维码
     * @param roomNumber 房间号
     * @param baseUrl 基础URL
     * @param options QR码选项
     */
    async generateRoomQRCode(roomNumber, baseUrl, options) {
        try {
            // 构造点餐页面URL
            const orderUrl = `${baseUrl}/order/${roomNumber}`;
            // 生成QR码
            const qrCodeDataUrl = await qrcode_1.default.toDataURL(orderUrl, {
                width: options?.width || 300,
                margin: options?.margin || 2,
                color: options?.color || {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            return qrCodeDataUrl;
        }
        catch (error) {
            console.error('生成QR码失败:', error);
            throw new Error('QR码生成失败');
        }
    }
    /**
     * 批量生成所有房间的二维码
     * @param roomNumbers 房间号数组
     * @param baseUrl 基础URL
     */
    async generateBatchQRCode(roomNumbers, baseUrl) {
        const results = [];
        for (const roomNumber of roomNumbers) {
            try {
                const qrCode = await this.generateRoomQRCode(roomNumber, baseUrl);
                results.push({
                    roomNumber,
                    qrCode
                });
            }
            catch (error) {
                console.error(`生成房间 ${roomNumber} 的QR码失败:`, error);
            }
        }
        return results;
    }
    /**
     * 生成二维码SVG
     * @param roomNumber 房间号
     * @param baseUrl 基础URL
     */
    async generateQRCodeSVG(roomNumber, baseUrl) {
        try {
            const orderUrl = `${baseUrl}/order/${roomNumber}`;
            const svgString = await qrcode_1.default.toString(orderUrl, { type: 'svg' });
            return svgString;
        }
        catch (error) {
            console.error('生成SVG QR码失败:', error);
            throw new Error('SVG QR码生成失败');
        }
    }
}
exports.default = new QRGenerator();
