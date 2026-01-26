import QRCode from 'qrcode';

interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

class QRGenerator {
  /**
   * 生成房间点餐二维码
   * @param roomNumber 房间号
   * @param baseUrl 基础URL
   * @param options QR码选项
   */
  public async generateRoomQRCode(
    roomNumber: string, 
    baseUrl: string,
    options?: QRCodeOptions
  ): Promise<string> {
    try {
      // 构造点餐页面URL
      const orderUrl = `${baseUrl}/order/${roomNumber}`;
      
      // 生成QR码
      const qrCodeDataUrl = await QRCode.toDataURL(orderUrl, {
        width: options?.width || 300,
        margin: options?.margin || 2,
        color: options?.color || {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('生成QR码失败:', error);
      throw new Error('QR码生成失败');
    }
  }

  /**
   * 批量生成所有房间的二维码
   * @param roomNumbers 房间号数组
   * @param baseUrl 基础URL
   */
  public async generateBatchQRCode(
    roomNumbers: string[],
    baseUrl: string
  ): Promise<Array<{ roomNumber: string; qrCode: string }>> {
    const results: Array<{ roomNumber: string; qrCode: string }> = [];
    
    for (const roomNumber of roomNumbers) {
      try {
        const qrCode = await this.generateRoomQRCode(roomNumber, baseUrl);
        results.push({
          roomNumber,
          qrCode
        });
      } catch (error) {
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
  public async generateQRCodeSVG(
    roomNumber: string,
    baseUrl: string
  ): Promise<string> {
    try {
      const orderUrl = `${baseUrl}/order/${roomNumber}`;
      const svgString = await QRCode.toString(orderUrl, { type: 'svg' });
      return svgString;
    } catch (error) {
      console.error('生成SVG QR码失败:', error);
      throw new Error('SVG QR码生成失败');
    }
  }
}

export default new QRGenerator();