import crypto from 'crypto';

interface SubscriptionVerificationData {
  subscription_id: string;
  payment_id: string;
  signature: string;
}

interface OrderVerificationData {
  order_id: string;
  payment_id: string;
  signature: string;
}

interface PaymentLinkIdVerificationData {
  payment_link_id: string;
  payment_link_reference_id: string;
  payment_link_status: string;
  payment_id: string;
  signature: string;
}

/**
 * Verifies the validity of the Razorpay signature.
 *
 * Supports verification for Orders, Subscriptions, and Payment Links.
 *
 * @param data - The data received from the checkout (order_id/subscription_id, payment_id, signature).
 * @param secret - Your Razorpay Key Secret.
 * @returns boolean - Returns true if the signature is valid, otherwise false.
 */
export const verifySignature = (
  data: OrderVerificationData | SubscriptionVerificationData | PaymentLinkIdVerificationData,
  secret: string
): boolean => {
  if (!secret) {
    throw new Error('Razorpay Key Secret is required for signature verification');
  }

  let text = '';
  const { signature } = data as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  if ('subscription_id' in data) {
    // Subscription flow
    text = `${data.payment_id}|${data.subscription_id}`;
  } else if ('order_id' in data) {
    // Standard Order flow
    text = `${data.order_id}|${data.payment_id}`;
  } else if ('payment_link_id' in data) {
    // Payment Link flow
    const { payment_link_id, payment_link_reference_id, payment_link_status, payment_id } =
      data as PaymentLinkIdVerificationData;
    text = `${payment_link_id}|${payment_link_reference_id}|${payment_link_status}|${payment_id}`;
  } else {
    throw new Error(
      'Invalid data provided for signature verification. Must contain order_id or subscription_id.'
    );
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

  return expectedSignature === signature;
};
