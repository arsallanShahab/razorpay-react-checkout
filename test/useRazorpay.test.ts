import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRazorpay } from '../src/hooks/useRazorpay';

// Mock the script loader
vi.mock('../src/lib/script-loader', () => ({
  loadRazorpayScript: vi.fn().mockResolvedValue(true),
}));

describe('useRazorpay', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return isLoaded as true when script is loaded', async () => {
    const { result } = renderHook(() => useRazorpay());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isLoaded).toBe(true);
    });
  });

  it('should expose Razorpay constructor', async () => {
    const { result } = renderHook(() => useRazorpay());

    await waitFor(() => {
      expect(result.current.Razorpay).toBeDefined();
    });
  });

  it('should allow opening checkout', async () => {
    const { result } = renderHook(() => useRazorpay());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    const options = {
      key: 'test_key',
      amount: 1000,
      currency: 'INR',
    };

    result.current.openRazorpay(options);

    expect(window.Razorpay).toHaveBeenCalledWith(expect.objectContaining(options));
  });
});
