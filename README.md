# Razorpay React Checkout

A TypeScript-first, SSR-safe React SDK for Razorpay with hooks and first-class Next.js support.

## Features

- 🔒 **TypeScript First**: Fully typed options and responses.
- ⚡ **SSR Safe**: Works seamlessly with Next.js and other SSR frameworks.
- 🎣 **Hooks**: `useRazorpay` hook for easy integration.
- 📦 **Lightweight**: Minimal dependencies.

## Installation

```bash
npm install razorpay-react-checkout
# or
yarn add razorpay-react-checkout
# or
pnpm add razorpay-react-checkout
```

## Usage

### Using Provider (Recommended)

Wrap your application with `RazorpayProvider` to load the script globally.

```tsx
import { RazorpayProvider } from 'razorpay-react-checkout';

const App = () => (
  <RazorpayProvider>
    <Checkout />
  </RazorpayProvider>
);
```

#### With Default Options (v1.1.0+)

Pass default Razorpay options to the provider. These options will be merged with options passed to `openRazorpay()`.

```tsx
import { RazorpayProvider } from 'razorpay-react-checkout';

const App = () => (
  <RazorpayProvider
    options={{
      key: 'rzp_test_xxxxxxxx',
      amount: 50000,
      currency: 'INR',
      name: 'Acme Corp',
    }}
  >
    <Checkout />
  </RazorpayProvider>
);
```

Then in your component, you only need to pass the handler:

```tsx
const { openRazorpay } = useRazorpay();

const handlePayment = () => {
  openRazorpay({
    handler: (response) => {
      console.log('Payment successful:', response);
    },
  });
};
```

### Using Hook

```tsx
import { useRazorpay, RazorpayOptions } from 'razorpay-react-checkout';

const Checkout = () => {
  const { isLoading, isLoaded, error, openRazorpay } = useRazorpay();

  const handlePayment = () => {
    const options: RazorpayOptions = {
      key: 'YOUR_KEY_ID',
      amount: 50000, // Amount in paise
      currency: 'INR',
      name: 'Acme Corp',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      order_id: 'order_9A33XWu170g81s', // Generate order_id on server
      handler: (response) => {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: 'John Doe',
        email: 'youremail@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = openRazorpay(options);

    if (rzp) {
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
    }
  };

  if (isLoading) {
    return <div>Loading Razorpay SDK...</div>;
  }

  if (error) {
    return <div>Error loading Razorpay SDK</div>;
  }

  return (
    <div>
      <h1>Razorpay React Checkout Example</h1>
      <button onClick={handlePayment} disabled={!isLoaded}>
        Pay Now
      </button>
    </div>
  );
};

export default App;
```

### Helper Components (v1.2.0+)

#### `<RazorpayButton />`

A simple button that handles the loading state and click handler for you.

```tsx
import { RazorpayButton } from 'razorpay-react-checkout';

const App = () => (
  <RazorpayButton
    options={{
      key: 'YOUR_KEY_ID',
      amount: 50000,
      currency: 'INR',
      name: 'Acme Corp',
    }}
    onSuccess={(data) => console.log('Success', data)}
    onFailure={(data) => console.error('Failure', data)}
    onClick={() => console.log('Button clicked!')}
  >
    Pay Now
  </RazorpayButton>
);
```

#### `<RazorpayListener />`

Listen to payment events globally from any component.

```tsx
import { RazorpayListener } from 'razorpay-react-checkout';

const AnalyticsTracker = () => (
  <RazorpayListener
    onPaymentSuccess={(data) => track('Payment Success', data)}
    onPaymentError={(data) => track('Payment Error', data)}
  />
);
```

### Global Event Handling & Debugging

You can now handle events globally at the Provider level and enable debug logs.

```tsx
<RazorpayProvider 
  debug={true}
  onPaymentSuccess={(data) => console.log('Global Success', data)}
  onPaymentError={(data) => console.error('Global Error', data)}
>
  <App />
</RazorpayProvider>
```

### Using React Suspense

Use `useRazorpaySuspense` to leverage React Suspense loading boundaries.

```tsx
import { useRazorpaySuspense } from 'razorpay-react-checkout';

const Checkout = () => {
  const { openRazorpay } = useRazorpaySuspense();
  return <button onClick={() => openRazorpay({...})}>Pay</button>;
};

// ...
<Suspense fallback={<Spinner />}>
  <Checkout />
</Suspense>
```

### Next.js Usage

The SDK is SSR-safe out of the box. You can use it in your Next.js pages or components without any special configuration. The script is loaded lazily on the client side when the hook is used.

## API

### `useRazorpay`

Returns an object with the following properties:

- `isLoaded`: `boolean` - Indicates if the Razorpay SDK script has loaded.
- `isLoading`: `boolean` - Indicates if the Razorpay SDK script is currently loading.
- `error`: `Error | null` - Error object if the script failed to load.
- `Razorpay`: `RazorpayConstructor | null` - The raw Razorpay constructor (available on `window`).
- `openRazorpay`: `(options: RazorpayOptions) => RazorpayInstance | null` - Helper function to initialize and open the checkout.

### Server-Side Utilities (New!)

Verify Razorpay signatures easily on your backend (Next.js API routes, Express, etc.).

```ts
import { verifySignature } from 'razorpay-react-checkout/server';

// In your API route
const isValid = verifySignature({
  order_id: 'order_123',
  payment_id: 'pay_123',
  signature: 'sig_123'
}, process.env.RAZORPAY_KEY_SECRET);

if (isValid) {
  // Signature verified
}
```

### Better Error Handling

Parse cryptic Razorpay error objects into user-friendly messages.

```tsx
import { getReadableErrorMessage, RazorpayEvents, RazorpayErrorCodes } from 'razorpay-react-checkout';

// ...
rzp.on(RazorpayEvents.PAYMENT_FAILED, (response) => {
  const message = getReadableErrorMessage(response.error);
  toast.error(message);
  
  if (response.error.code === RazorpayErrorCodes.BAD_REQUEST_ERROR) {
    // Handle specific error
  }
});
```

### Enhanced Button Component

Now supports variants and Tailwind classes!

```tsx
<RazorpayButton 
  options={...} 
  variant="primary" // primary, secondary, outline, ghost, danger
  className="w-full"
>
  Pae Now
</RazorpayButton>
```

## License

MIT
