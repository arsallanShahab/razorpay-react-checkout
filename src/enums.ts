/**
 * Standardized Razorpay events.
 * Use these to avoid magic strings when listening to events.
 */
export enum RazorpayEvents {
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_AUTHORIZED = 'payment.authorized',
  PAYMENT_CAPTURED = 'payment.captured',
  EXTERNAL_WALLET_SELECTED = 'external_wallet.selected',
}

/**
 * Standardized Razorpay error codes.
 * Use these to handle specific error scenarios.
 */
export enum RazorpayErrorCodes {
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
  GATEWAY_ERROR = 'GATEWAY_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}
