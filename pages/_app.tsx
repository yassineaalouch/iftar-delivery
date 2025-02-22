import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes('Warning: Did not expect server HTML to contain')) {
        return;
      }
      originalError.apply(console, args);
    };
  }, []);

  return <Component {...pageProps} />;
}
