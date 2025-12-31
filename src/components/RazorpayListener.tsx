import { useEffect, useRef } from 'react';
import { useRazorpayContext } from './RazorpayProvider';
import { RazorpaySuccessResponse, RazorpayErrorResponse } from '../types';

interface RazorpayListenerProps {
  onPaymentSuccess?: (response: RazorpaySuccessResponse) => void;
  onPaymentError?: (error: RazorpayErrorResponse) => void;
}

export const RazorpayListener: React.FC<RazorpayListenerProps> = ({
  onPaymentSuccess,
  onPaymentError,
}: RazorpayListenerProps) => {
  const context = useRazorpayContext();

  // We need refs to keep the latest callbacks without re-registering
  const successRef = useRef(onPaymentSuccess);
  const errorRef = useRef(onPaymentError);

  useEffect(() => {
    successRef.current = onPaymentSuccess;
  }, [onPaymentSuccess]);

  useEffect(() => {
    errorRef.current = onPaymentError;
  }, [onPaymentError]);

  useEffect(() => {
    if (!context) return;

    const unregisterSuccess = context.registerPaymentSuccess((response) => {
      if (successRef.current) successRef.current(response);
    });

    const unregisterError = context.registerPaymentError((error) => {
      if (errorRef.current) errorRef.current(error);
    });

    return () => {
      unregisterSuccess();
      unregisterError();
    };
  }, [context]);

  return null;
};
