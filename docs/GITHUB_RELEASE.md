# Release Notes

## v1.1.2 - 2025-12-31

- **Changed**: Enhanced package description for better clarity.
- **Added**: Contributors field in `package.json`.

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
