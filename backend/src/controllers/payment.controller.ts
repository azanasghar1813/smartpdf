import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService';
import { authService } from '../services/authService';

export function createCheckoutSession(req: Request, res: Response) {
  const { userId, tier = 'premium' } = req.body;

  const targetUserId = userId || 'usr_admin_root';
  const amount = tier === 'business' ? 9.99 : 4.99;
  const sessionId = `cs_test_${uuidv4().replace(/-/g, '')}`;

  res.json({
    success: true,
    sessionId,
    userId: targetUserId,
    amount,
    currency: 'USD',
    tier,
    checkoutUrl: `/checkout/${sessionId}`,
  });
}

export function confirmCheckout(req: Request, res: Response) {
  const { sessionId, userId, tier = 'premium' } = req.body;

  const targetUserId = userId || 'usr_admin_root';
  const amount = tier === 'business' ? 9.99 : 4.99;

  const sub = db.createSubscription(targetUserId, tier, amount);

  res.json({
    success: true,
    message: `Account successfully upgraded to ${tier.toUpperCase()}!`,
    subscription: sub,
    user: db.getUserById(targetUserId) || db.getUserByEmail('admin@simplepdf.com'),
  });
}

export function handlePaymentWebhook(req: Request, res: Response) {
  const signature = (req.headers['stripe-signature'] as string) || (req.headers['x-signature'] as string);
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);

  if (!signature) {
    return res.status(400).json({ error: 'Missing webhook signature header.' });
  }

  const isValid = authService.verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[PaymentWebhook] Unauthorized webhook attempt: invalid signature');
    return res.status(401).json({ error: 'Signature verification failed.' });
  }

  const event = req.body;
  console.log(`[PaymentWebhook] Verified incoming event: ${event?.type || 'payment.event'}`);

  if (event?.type === 'checkout.session.completed' || event?.event === 'order_created') {
    const data = event.data?.object || event.data;
    const userId = data?.customer_id || data?.metadata?.userId || 'usr_admin_root';
    const tier = data?.metadata?.tier || 'premium';
    const amount = (data?.amount_total || 499) / 100;

    db.createSubscription(userId, tier, amount);
  }

  return res.json({ received: true });
}

export function getUserInvoices(req: Request, res: Response) {
  const { userId } = req.params;
  const sub = db.getUserSubscription(userId);

  if (!sub) {
    return res.json({ invoices: [] });
  }

  res.json({
    invoices: [
      {
        id: `inv_${sub.id}`,
        amount: sub.amount,
        currency: sub.currency,
        status: 'paid',
        date: sub.createdAt,
        plan: sub.tier === 'business' ? 'Business Team' : 'Premium Pro',
        pdfReceiptUrl: `/api/v1/payment/receipt/${sub.id}`,
      },
    ],
  });
}
