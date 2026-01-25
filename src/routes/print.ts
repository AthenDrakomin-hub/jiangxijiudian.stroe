import { Router } from 'express';
import PrintController from '../controllers/PrintController';

const router = Router();

// 打印订单
router.post('/orders/:id', PrintController.printOrder);

export default router;