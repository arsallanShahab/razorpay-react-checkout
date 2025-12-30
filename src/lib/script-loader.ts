const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptLoaded = false;
let scriptLoadingPromise: Promise<boolean> | null = null;

const loadScript = (retries = 3, delay = 1000): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      if (retries > 0) {
        setTimeout(() => {
          loadScript(retries - 1, delay * 2)
            .then(resolve)
            .catch(reject);
        }, delay);
      } else {
        scriptLoaded = false;
        scriptLoadingPromise = null;
        reject(new Error('Failed to load Razorpay SDK'));
      }
    };
    document.body.appendChild(script);
  });
};

export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (scriptLoaded) {
    return Promise.resolve(true);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = loadScript();

  return scriptLoadingPromise;
};
