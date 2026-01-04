"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { loadRazorpayScript } from '../lib/script-loader';
import {
  RazorpayConstructor,
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from '../types';

interface RazorpayContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  Razorpay: RazorpayConstructor | null;
  defaultOptions?: Partial<RazorpayOptions>;
  // Event Emitters
  onPaymentSuccess: (response: RazorpaySuccessResponse) => void;
  onPaymentError: (error: RazorpayErrorResponse) => void;
  registerPaymentSuccess: (cb: (response: RazorpaySuccessResponse) => void) => () => void;
  registerPaymentError: (cb: (error: RazorpayErrorResponse) => void) => () => void;
  debug?: boolean;
}

const RazorpayContext = createContext<RazorpayContextType | undefined>(undefined);

interface RazorpayProviderProps {
  children: ReactNode;
  options?: Partial<RazorpayOptions>;
  onPaymentSuccess?: (response: RazorpaySuccessResponse) => void;
  onPaymentError?: (error: RazorpayErrorResponse) => void;
  debug?: boolean;
}

export const RazorpayProvider: React.FC<RazorpayProviderProps> = ({
  children,
  options,
  onPaymentSuccess: propOnSuccess,
  onPaymentError: propOnError,
  debug,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listeners refs to avoid dependency loops
  const successListeners = useRef<Set<(response: RazorpaySuccessResponse) => void>>(new Set());
  const errorListeners = useRef<Set<(error: RazorpayErrorResponse) => void>>(new Set());

  // Add prop listeners
  useEffect(() => {
    const listeners = successListeners.current;
    if (propOnSuccess) listeners.add(propOnSuccess);
    return () => {
      if (propOnSuccess) listeners.delete(propOnSuccess);
    };
  }, [propOnSuccess]);

  useEffect(() => {
    const listeners = errorListeners.current;
    if (propOnError) listeners.add(propOnError);
    return () => {
      if (propOnError) listeners.delete(propOnError);
    };
  }, [propOnError]);

  const registerPaymentSuccess = useCallback((cb: (response: RazorpaySuccessResponse) => void) => {
    successListeners.current.add(cb);
    return () => {
      successListeners.current.delete(cb);
    };
  }, []);

  const registerPaymentError = useCallback((cb: (error: RazorpayErrorResponse) => void) => {
    errorListeners.current.add(cb);
    return () => {
      errorListeners.current.delete(cb);
    };
  }, []);

  const onPaymentSuccess = useCallback((response: RazorpaySuccessResponse) => {
    successListeners.current.forEach((cb) => cb(response));
  }, []);

  const onPaymentError = useCallback((error: RazorpayErrorResponse) => {
    errorListeners.current.forEach((cb) => cb(error));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (debug) console.log('[Razorpay SDK] Loading script...');

    loadRazorpayScript()
      .then(() => {
        // eslint-disable-next-line no-console
        if (debug) console.log('[Razorpay SDK] Script Loaded');
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        if (debug) console.error('[Razorpay SDK] Script Load Failed', err);
        setError(err);
        setIsLoading(false);
      });
  }, [debug]);

  const Razorpay = typeof window !== 'undefined' ? window.Razorpay : null;

  const contextValue = React.useMemo(
    () => ({
      isLoaded,
      isLoading,
      error,
      Razorpay: Razorpay || null,
      defaultOptions: options,
      onPaymentSuccess,
      onPaymentError,
      registerPaymentSuccess,
      registerPaymentError,
      debug,
    }),
    [
      isLoaded,
      isLoading,
      error,
      Razorpay,
      options,
      onPaymentSuccess,
      onPaymentError,
      registerPaymentSuccess,
      registerPaymentError,
      debug,
    ]
  );

  return <RazorpayContext.Provider value={contextValue}>{children}</RazorpayContext.Provider>;
};

export const useRazorpayContext = () => {
  return useContext(RazorpayContext);
};
