import React from 'react';
import { useRazorpay } from '../hooks/useRazorpay';
import { RazorpayOptions, RazorpaySuccessResponse, RazorpayErrorResponse } from '../types';
import { cn } from '../lib/utils';

export interface RazorpayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: RazorpayOptions;
  onSuccess?: (response: RazorpaySuccessResponse) => void;
  onFailure?: (response: RazorpayErrorResponse) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  options,
  onSuccess,
  onFailure,
  onClick,
  disabled,
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const { isLoading, openRazorpay, isLoaded } = useRazorpay();

  const handlePayment = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (!isLoaded) return;

    const finalOptions = { ...options };

    if (onSuccess) {
      const originalHandler = finalOptions.handler;
      finalOptions.handler = (response: RazorpaySuccessResponse) => {
        if (originalHandler) originalHandler(response);
        onSuccess(response);
      };
    }

    const rzp = openRazorpay(finalOptions);

    if (rzp && onFailure) {
      rzp.on('payment.failed', onFailure);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border border-slate-200 hover:bg-slate-100 hover:text-slate-900',
    ghost: 'hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || disabled}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {isLoading ? 'Loading...' : children || 'Pay Now'}
    </button>
  );
};
