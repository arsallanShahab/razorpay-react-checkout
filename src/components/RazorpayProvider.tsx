import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadRazorpayScript } from '../lib/script-loader';
import { RazorpayConstructor, RazorpayOptions } from '../types';

interface RazorpayContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  Razorpay: RazorpayConstructor | null;
  defaultOptions?: Partial<RazorpayOptions>;
}

const RazorpayContext = createContext<RazorpayContextType | undefined>(undefined);

interface RazorpayProviderProps {
  children: ReactNode;
  options?: Partial<RazorpayOptions>;
}

export const RazorpayProvider: React.FC<RazorpayProviderProps> = ({ children, options }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadRazorpayScript()
      .then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const Razorpay = typeof window !== 'undefined' ? window.Razorpay : null;

  return (
    <RazorpayContext.Provider
      value={{ isLoaded, isLoading, error, Razorpay: Razorpay || null, defaultOptions: options }}
    >
      {children}
    </RazorpayContext.Provider>
  );
};

export const useRazorpayContext = () => {
  return useContext(RazorpayContext);
};
