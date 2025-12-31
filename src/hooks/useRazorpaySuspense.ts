import { useRazorpayContext } from '../components/RazorpayProvider';
import { loadRazorpayScript } from '../lib/script-loader';
import {
  RazorpayOptions,
  RazorpayInstance,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from '../types';
import { useCallback, useMemo } from 'react';

// Simple cache for promise to avoid infinite loops if not careful
let scriptLoadPromise: Promise<boolean> | null = null;
let scriptLoaded = false;
let scriptError: Error | null = null;

const getScriptPromise = () => {
  if (scriptLoaded) return true;
  if (scriptError) throw scriptError;
  if (!scriptLoadPromise) {
    scriptLoadPromise = loadRazorpayScript()
      .then((res) => {
        scriptLoaded = res;
        return res;
      })
      .catch((err) => {
        scriptError = err;
        throw err;
      });
  }
  return scriptLoadPromise;
};

export const useRazorpaySuspense = () => {
  const context = useRazorpayContext();

  if (context) {
    if (context.error) throw context.error;
    if (context.isLoading && !context.isLoaded) {
      throw getScriptPromise();
    }
  } else {
    // No provider, stand alone usage
    const result = getScriptPromise();
    if (result instanceof Promise) throw result;
  }

  const state = useMemo(
    () =>
      context || {
        isLoaded: true,
        isLoading: false,
        error: null,
        Razorpay: typeof window !== 'undefined' ? window.Razorpay : null,
        defaultOptions: undefined,
        onPaymentSuccess: () => {},
        onPaymentError: () => {},
        debug: false,
      },
    [context]
  );

  const openRazorpay = useCallback(
    (options: RazorpayOptions): RazorpayInstance | null => {
      if (!state.Razorpay) {
        // eslint-disable-next-line no-console
        if (state.debug) console.error('[Razorpay SDK] Razorpay SDK not loaded yet');
        return null;
      }

      const mergedOptions = {
        ...state.defaultOptions,
        ...options,
      } as RazorpayOptions;

      const originalHandler = mergedOptions.handler;
      mergedOptions.handler = (response: RazorpaySuccessResponse) => {
        // eslint-disable-next-line no-console
        if (state.debug) console.log('[Razorpay SDK] Payment Successful', response);
        if (originalHandler) originalHandler(response);
        state.onPaymentSuccess(response);
      };

      // eslint-disable-next-line no-console
      if (state.debug) console.log('[Razorpay SDK] Opening Checkout', mergedOptions);
      const rzp = new state.Razorpay(mergedOptions);

      rzp.on('payment.failed', (response: RazorpayErrorResponse) => {
        // eslint-disable-next-line no-console
        if (state.debug) console.error('[Razorpay SDK] Payment Failed', response);
        state.onPaymentError(response);
      });

      rzp.open();
      return rzp;
    },
    [state]
  );

  return { openRazorpay, Razorpay: state.Razorpay };
};
