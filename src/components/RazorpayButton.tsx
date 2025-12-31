import React from 'react';
import { useRazorpay } from '../hooks/useRazorpay';
import { RazorpayOptions, RazorpaySuccessResponse, RazorpayErrorResponse } from '../types';

interface RazorpayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: RazorpayOptions;
  onSuccess?: (response: RazorpaySuccessResponse) => void;
  onFailure?: (response: RazorpayErrorResponse) => void;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  options,
  onSuccess,
  onFailure,
  onClick,
  disabled,
  children,
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

  return (
    <button onClick={handlePayment} disabled={isLoading || disabled} {...props}>
      {isLoading ? 'Loading...' : children || 'Pay Now'}
    </button>
  );
};
