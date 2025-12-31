export interface RazorpayTheme {
  /**
   * Hex code for the color of the checkout form.
   */
  color?: string;
  /**
   * Hex code for the backdrop color of the checkout modal.
   */
  backdrop_color?: string;
  /**
   * Hide the top bar of the checkout form.
   */
  hide_topbar?: boolean;
  /**
   * Image URL for the logo in the top bar.
   */
  image_padding?: string;
}

export interface RazorpayModalOptions {
  backdropclose?: boolean;
  escape?: boolean;
  handleback?: boolean;
  confirm_close?: boolean;
  ondismiss?: () => void;
  animation?: boolean;
}

export interface RazorpayPrefillOptions {
  name?: string;
  email?: string;
  contact?: string;
  method?: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
}

export interface RazorpayTransfer {
  /**
   * The account ID of the linked account to which the transfer is to be made.
   */
  account: string;
  /**
   * The amount to be transferred to the linked account in currency subunits.
   */
  amount: number;
  /**
   * The currency in which the transfer is to be made.
   */
  currency: string;
  /**
   * A set of key-value pairs that you can attach to the transfer.
   */
  notes?: Record<string, string>;
  /**
   * Indicates whether the transfer should be put on hold.
   */
  on_hold?: boolean;
  /**
   * The timestamp at which the transfer should be settled.
   */
  on_hold_until?: number;
}

// Success response payload
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  razorpay_subscription_id?: string;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id?: string;
  };
}

export interface RazorpayErrorResponse {
  error: RazorpayError;
}

export interface RazorpayOptions {
  key: string;
  amount: number | string;
  currency: string;
  name?: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler?: (response: RazorpaySuccessResponse) => void;
  prefill?: RazorpayPrefillOptions;
  notes?: Record<string, string>;
  theme?: RazorpayTheme;
  modal?: RazorpayModalOptions;
  subscription_id?: string;
  subscription_card_change?: boolean;
  recurring?: boolean;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  remember_customer?: boolean;
  timeout?: number;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: number; // Changed from boolean to number as max_count implies a number
  };
  config?: {
    display?: {
      language?: 'en' | 'ben' | 'hi' | 'mar' | 'guj' | 'tam' | 'tel';
    };
  };
  /**
   * Transfers for Razorpay Route (Split Payments)
   */
  transfers?: RazorpayTransfer[];
}

export interface RazorpayInstance {
  open: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, callback: (response: RazorpayErrorResponse | any) => void) => void;
  close: () => void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
  open: (options: RazorpayOptions) => void;
  configure: (options: RazorpayOptions) => void;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}
