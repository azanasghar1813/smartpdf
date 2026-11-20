import { Router } from 'express';
import {
  createCheckoutSession,
  confirmCheckout,
  getUserInvoices,
  handlePaymentWebhook,
} from '../controllers/payment.controller';

const router = Router();

router.post('/checkout', createCheckoutSession);
router.post('/confirm', confirmCheckout);
router.post('/webhook', handlePaymentWebhook);
router.get('/invoices/:userId', getUserInvoices);

export default router;
