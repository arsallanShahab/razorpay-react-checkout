import { RazorpayErrorCodes } from './enums';

/**
 * Formats a currency amount.
 *
 * If the amount is passing in rupees (e.g. 500), it converts it to paise (50000) for Razorpay.
 * It assumes the amount is in the base unit (e.g. Rupees) and converts to the smallest unit (e.g. Paise).
 *
 * @param amount - The amount in the base unit (e.g. 500 Rupees)
 * @returns The amount in the smallest unit (e.g. 50000 Paise)
 */
export const formatAmount = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Checks if the amount is already in paise (heuristic).
 * This is just a helper, use with caution.
 */
export const isPaise = (amount: number): boolean => {
  return Number.isInteger(amount);
};

/**
 * Parses a Razorpay error object and returns a human-readable message.
 *
 * @param error - The error object returned by Razorpay payment.failed event.
 * @returns A user-friendly error message string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getReadableErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred.';

  // Handle standard Razorpay error structure
  if (error.code && error.description) {
    // Prioritize description if it's user-friendly enough, or map based on code.
    // Usually description is like "Payment failed due to..."
    switch (error.code) {
      case RazorpayErrorCodes.BAD_REQUEST_ERROR:
        return error.description || 'Invalid request. Please check your payment details.';
      case RazorpayErrorCodes.GATEWAY_ERROR:
        return 'Payment processing failed due to a gateway error. Please try again.';
      case 'PAYMENT_CANCELLED': // Common scenario
        return 'Payment was cancelled by the user.';
      default:
        return error.description || 'Payment failed. Please try again.';
    }
  }

  // Handle if it's just a string or minimal object
  if (typeof error === 'string') return error;
  if (error.message) return error.message;

  return 'Payment could not be completed. Please try again.';
};
