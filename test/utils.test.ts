import { describe, it, expect } from 'vitest';
import { getReadableErrorMessage } from '../src/utils';
import { RazorpayErrorCodes } from '../src/enums';

describe('getReadableErrorMessage', () => {
  it('should return default error if error is undefined', () => {
    expect(getReadableErrorMessage(undefined)).toBe('An unknown error occurred.');
  });

  it('should return error string if input is string', () => {
    expect(getReadableErrorMessage('Network error')).toBe('Network error');
  });

  it('should return message property', () => {
    expect(getReadableErrorMessage({ message: 'Something went wrong' })).toBe(
      'Something went wrong'
    );
  });

  it('should handle BAD_REQUEST_ERROR with description', () => {
    const error = {
      code: RazorpayErrorCodes.BAD_REQUEST_ERROR,
      description: 'Invalid VPA',
    };
    expect(getReadableErrorMessage(error)).toBe('Invalid VPA');
  });

  it('should handle GATEWAY_ERROR', () => {
    const error = {
      code: RazorpayErrorCodes.GATEWAY_ERROR,
      description: 'Bank down',
    };
    expect(getReadableErrorMessage(error)).toBe(
      'Payment processing failed due to a gateway error. Please try again.'
    );
  });
});
