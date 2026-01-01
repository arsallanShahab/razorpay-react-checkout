import { describe, it, expect } from 'vitest';
import { verifySignature } from '../src/server';
import crypto from 'crypto';

describe('verifySignature', () => {
  const secret = 'test_secret';

  it('should verify valid order signature', () => {
    const orderId = 'order_123';
    const paymentId = 'pay_123';

    const text = `${orderId}|${paymentId}`;
    const signature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    const isValid = verifySignature(
      { order_id: orderId, payment_id: paymentId, signature },
      secret
    );

    expect(isValid).toBe(true);
  });

  it('should fail invalid signature', () => {
    const orderId = 'order_123';
    const paymentId = 'pay_123';
    const signature = 'invalid_signature';

    const isValid = verifySignature(
      { order_id: orderId, payment_id: paymentId, signature },
      secret
    );

    expect(isValid).toBe(false);
  });

  it('should verify valid subscription signature', () => {
    const subId = 'sub_123';
    const paymentId = 'pay_123';
    const text = `${paymentId}|${subId}`;
    const signature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    const isValid = verifySignature(
      { subscription_id: subId, payment_id: paymentId, signature },
      secret
    );
    expect(isValid).toBe(true);
  });
});
