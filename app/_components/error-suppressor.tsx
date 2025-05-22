"use client";

import { useEffect } from "react";

/**
 * Component that suppresses errors from browser extensions
 * This helps prevent extension errors from affecting the user experience
 */
export default function ErrorSuppressor() {
  useEffect(() => {
    // Store the original console functions
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Create a function to check if an error is from a browser extension
    const isExtensionError = (args: any[]) => {
      // Check the error message itself
      if (args[0] && typeof args[0] === 'string') {
        const errorMsg = args[0];
        if (
          errorMsg.includes('inpage.js') ||
          errorMsg.includes('chrome-extension') ||
          errorMsg.includes('extension://') ||
          errorMsg.includes('Cannot read properties of null') ||
          errorMsg.includes('egjidjbpglichdcondbcbdnbeeppgdph')
        ) {
          return true;
        }
      }

      // Check the error stack trace
      if (args[0] && args[0] instanceof Error) {
        const stack = args[0].stack || '';
        if (
          stack.includes('chrome-extension://') ||
          stack.includes('egjidjbpglichdcondbcbdnbeeppgdph') ||
          stack.includes('inpage.js')
        ) {
          return true;
        }
      }

      // Check for specific extension ID in any argument
      for (const arg of args) {
        if (arg && typeof arg === 'string' && arg.includes('egjidjbpglichdcondbcbdnbeeppgdph')) {
          return true;
        }
      }

      return false;
    };

    // Override console.error
    console.error = (...args) => {
      if (isExtensionError(args)) {
        // Silently ignore errors from extensions
        return;
      }
      originalError.apply(console, args);
    };

    // Also override console.warn for extension warnings
    console.warn = (...args) => {
      if (isExtensionError(args)) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // Also check console.log for extension errors that might be logged
    console.log = (...args) => {
      if (isExtensionError(args)) {
        return;
      }
      originalLog.apply(console, args);
    };

    // Add a global error handler for uncaught errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message.includes('Cannot read properties of null') ||
        (event.error && event.error.stack &&
         (event.error.stack.includes('chrome-extension://') ||
          event.error.stack.includes('egjidjbpglichdcondbcbdnbeeppgdph')))
      ) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      return false;
    };

    window.addEventListener('error', handleGlobalError, true);

    // Cleanup function to restore the original console functions
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      window.removeEventListener('error', handleGlobalError, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
