import { useState, useEffect, useCallback } from 'react';
import { loadRazorpayScript } from '../lib/script-loader';
import { RazorpayOptions, RazorpayInstance } from '../types';
import { useRazorpayContext } from '../components/RazorpayProvider';

export const useRazorpay = () => {
  const context = useRazorpayContext();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (context) return;

    loadRazorpayScript()
      .then((loaded) => {
        setIsLoaded(loaded);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [context]);

  const state = context || {
    isLoaded,
    isLoading,
    error,
    Razorpay: typeof window !== 'undefined' ? window.Razorpay : null,
    defaultOptions: undefined,
  };

  const openRazorpay = useCallback(
    (options: RazorpayOptions): RazorpayInstance | null => {
      if (!state.Razorpay) {
        console.error('Razorpay SDK not loaded yet');
        return null;
      }

      // Merge default options with provided options
      const mergedOptions = {
        ...state.defaultOptions,
        ...options,
      } as RazorpayOptions;

      const rzp = new state.Razorpay(mergedOptions);
      rzp.open();
      return rzp;
    },
    [state.Razorpay, state.defaultOptions]
  );

  return { ...state, openRazorpay };
};
