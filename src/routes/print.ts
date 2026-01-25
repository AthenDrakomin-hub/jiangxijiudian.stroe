import { Router } from 'express';
import { printOrder } from '../controllers/PrintController';

const router = Router();

// 打印订单
router.post('/orders/:id', printOrder);

export default router;