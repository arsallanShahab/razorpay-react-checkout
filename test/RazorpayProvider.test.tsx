import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import { RazorpayProvider, useRazorpayContext } from '../src/components/RazorpayProvider';

// Mock the script loader
vi.mock('../src/lib/script-loader', () => ({
  loadRazorpayScript: vi.fn().mockResolvedValue(true),
}));

const TestComponent = () => {
  const context = useRazorpayContext();
  if (!context) return <div>No Context</div>;
  return (
    <div>
      <div data-testid="is-loaded">{context.isLoaded.toString()}</div>
      <div data-testid="is-loading">{context.isLoading.toString()}</div>
    </div>
  );
};

describe('RazorpayProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide context values', async () => {
    render(
      <RazorpayProvider>
        <TestComponent />
      </RazorpayProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-loaded').textContent).toBe('true');
      expect(screen.getByTestId('is-loading').textContent).toBe('false');
    });
  });
});
