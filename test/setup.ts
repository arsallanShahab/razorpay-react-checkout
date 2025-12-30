import { vi } from 'vitest';
import crypto from 'crypto';
import type { RazorpayConstructor } from '../src/types';

// Polyfill crypto for JSDOM
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: <T extends ArrayBufferView | null>(buffer: T): T => {
      if (buffer) {
        // @ts-expect-error - randomFillSync accepts ArrayBufferView
        crypto.randomFillSync(buffer);
      }
      return buffer;
    },
  },
});

// Mock Razorpay on window
const RazorpayMock = vi.fn().mockImplementation(() => ({
  open: vi.fn(),
  on: vi.fn(),
  close: vi.fn(),
})) as unknown as RazorpayConstructor;

window.Razorpay = RazorpayMock;
