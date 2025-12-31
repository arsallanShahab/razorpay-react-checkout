## Release Notes

### v1.2.0 - 2025-12-31

- **New Components**:
  - `<RazorpayButton />`: A pre-built button component that handles loading states and payment flow automatically.
  - `<RazorpayListener />`: A declarative component to listen for global payment events (success/error) anywhere in your component tree.

- **Enhanced Provider**:
  - `RazorpayProvider` now accepts `onPaymentSuccess` and `onPaymentError` props for global event handling.
  - Added `debug` prop to `RazorpayProvider` for logging SDK lifecycle events to the console.

- **New Hooks**:
  - `useRazorpaySuspense`: A new hook that works with React Suspense, throwing a promise while the SDK loads.

- **Utilities**:
  - Added `formatAmount` utility to helper convert currency to subunits (e.g., Rupees to Paise).

- **TypeScript Improvements**:
  - Added strict types for `RazorpaySuccessResponse`, `RazorpayErrorResponse`, and `RazorpayTheme`.
  - Added support for Razorpay Route (Split Payments) in `RazorpayOptions`.

### v1.1.2 - 2025-12-31

- **Changed**: Enhanced package description for better clarity.

### v1.1.1

- **Docs**: Updated README with examples for default options feature
- Improved documentation for better developer experience

### v1.1.0

- **New Feature**: Support for default options in `RazorpayProvider`
  - Pass `options` prop to `RazorpayProvider` to set default Razorpay options
  - Options can be overridden per checkout using the `useRazorpay` hook
  - Simplifies implementation when using same options across the app

### v1.0.0 (Initial Release)

- Initial release of `razorpay-react-checkout`.
- Added `useRazorpay` hook.
- Added `RazorpayProvider` for global context.
- Added TypeScript support.
- Added SSR support.
