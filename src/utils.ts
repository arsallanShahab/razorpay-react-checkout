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
