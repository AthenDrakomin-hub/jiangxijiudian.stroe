import { Request, Response } from 'express';

// 合作伙伴接口定义
interface Partner {
  _id?: string;
  name: string;
  type: string; // 合作伙伴类型：delivery, marketing, technology 等
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  status: 'active' | 'inactive' | 'pending';
  commissionRate?: number; // 佣金比例
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class PartnerController {
  public getAllPartners = async (req: Request, res: Response): Promise<void> => {
    try {
      // 在实际应用中，这里应该从数据库查询
      // 现在我们返回模拟数据
      const partners: Partner[] = [
        {
          _id: '1',
          name: '外卖配送公司A',
          type: 'delivery',
          contactPerson: '王五',
          email: 'wangwu@delivery.com',
          phone: '13700137000',
          website: 'https://delivery-a.com',
          agreementStartDate: new Date('2023-01-01'),
          agreementEndDate: new Date('2025-12-31'),
          status: 'active',
          commissionRate: 15,
          notes: '主要负责市区配送',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          name: '营销推广公司B',
          type: 'marketing',
          contactPerson: '赵六',
          email: 'zhaoliu@marketing.com',
          phone: '13600136000',
          website: 'https://marketing-b.com',
          agreementStartDate: new Date('2023-06-01'),
          agreementEndDate: new Date('2024-12-31'),
          status: 'active',
          commissionRate: 10,
          notes: '社交媒体推广',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      res.json(partners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({ error: 'Failed to fetch partners' });
    }
  };

  public getPartnerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      
      // 在实际应用中，这里应该从数据库查询特定合作伙伴
      // 现在我们返回模拟数据
      const partner: Partner = {
        _id: id,
        name: `合作伙伴${id}`,
        type: 'technology',
        contactPerson: '联系人',
        email: 'contact@partner.com',
        phone: '13800138000',
        website: 'https://partner.com',
        agreementStartDate: new Date('2023-01-01'),
        agreementEndDate: new Date('2025-12-31'),
        status: 'active',
        commissionRate: 12,
        notes: '合作伙伴备注',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json(partner);
    } catch (error) {
      console.error('Error fetching partner:', error);
      res.status(500).json({ error: 'Failed to fetch partner' });
    }
  };

  public createPartner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, type, contactPerson, email, phone, website, agreementStartDate, agreementEndDate, commissionRate, notes } = req.body;

      // 在实际应用中，这里应该创建新的合作伙伴记录
      const partner: Partner = {
        _id: Date.now().toString(), // 模拟ID生成
        name,
        type: type || 'other',
        contactPerson,
        email,
        phone,
        website,
        agreementStartDate: agreementStartDate ? new Date(agreementStartDate) : undefined,
        agreementEndDate: agreementEndDate ? new Date(agreementEndDate) : undefined,
        status: 'pending',
        commissionRate: commissionRate || 0,
        notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.status(201).json(partner);
    } catch (error) {
      console.error('Error creating partner:', error);
      res.status(500).json({ error: 'Failed to create partner' });
    }
  };

  public updatePartner = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { name, type, contactPerson, email, phone, website, agreementStartDate, agreementEndDate, status, commissionRate, notes } = req.body;

      // 在实际应用中，这里应该更新合作伙伴记录
      const partner: Partner = {
        _id: id,
        name: name || `合作伙伴${id}`,
        type: type || 'other',
        contactPerson: contactPerson || '联系人',
        email: email || 'contact@partner.com',
        phone: phone || '13800138000',
        website: website,
        agreementStartDate: agreementStartDate ? new Date(agreementStartDate) : undefined,
        agreementEndDate: agreementEndDate ? new Date(agreementEndDate) : undefined,
        status: status || 'active',
        commissionRate: commissionRate || 0,
        notes: notes || '',
        createdAt: new Date(Date.now() - 86400000), // 一天前
        updatedAt: new Date()
      };

      res.json(partner);
    } catch (error) {
      console.error('Error updating partner:', error);
      res.status(500).json({ error: 'Failed to update partner' });
    }
  };

  public deletePartner = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      // 在实际应用中，这里应该软删除或标记为非活跃
      res.json({ message: `Partner ${id} marked as inactive` });
    } catch (error) {
      console.error('Error deleting partner:', error);
      res.status(500).json({ error: 'Failed to delete partner' });
    }
  };
}

export default new PartnerController();