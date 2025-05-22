// This script runs before anything else and blocks specific extension errors
(function() {
  // Target the specific extension ID
  const TARGET_EXTENSION_ID = 'egjidjbpglichdcondbcbdnbeeppgdph';
  
  // Store original methods
  const originalDefineProperty = Object.defineProperty;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  // Block extension errors
  function blockExtensionErrors() {
    // Override console methods
    console.error = function() {
      // Convert arguments to array for easier checking
      const args = Array.from(arguments);
      const errorString = args.map(arg => String(arg)).join(' ');
      
      // Check if this is from our target extension
      if (errorString.includes(TARGET_EXTENSION_ID) || 
          errorString.includes('inpage.js') ||
          errorString.includes('Cannot read properties of null')) {
        // Silently drop the error
        return;
      }
      
      // Pass through other errors
      return originalConsoleError.apply(console, arguments);
    };
    
    console.warn = function() {
      const args = Array.from(arguments);
      const warnString = args.map(arg => String(arg)).join(' ');
      
      if (warnString.includes(TARGET_EXTENSION_ID) || 
          warnString.includes('inpage.js')) {
        return;
      }
      
      return originalConsoleWarn.apply(console, arguments);
    };
    
    console.log = function() {
      const args = Array.from(arguments);
      const logString = args.map(arg => String(arg)).join(' ');
      
      if (logString.includes(TARGET_EXTENSION_ID) || 
          logString.includes('inpage.js')) {
        return;
      }
      
      return originalConsoleLog.apply(console, arguments);
    };
    
    // Add global error handler
    window.addEventListener('error', function(event) {
      if (event.filename && event.filename.includes(TARGET_EXTENSION_ID)) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      
      if (event.message && event.message.includes('Cannot read properties of null')) {
        const errorStack = event.error && event.error.stack ? event.error.stack : '';
        if (errorStack.includes('chrome-extension') || errorStack.includes(TARGET_EXTENSION_ID)) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
      }
      
      return false;
    }, true);
    
    // Try to intercept the extension's script
    try {
      // This is a more aggressive approach - it tries to prevent the extension from
      // accessing certain properties that might be causing the error
      const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      Object.getOwnPropertyDescriptor = function(obj, prop) {
        // If we're checking a property that might cause the error, return null
        if (prop === 'type' && obj === null) {
          return { value: undefined, writable: true, enumerable: true, configurable: true };
        }
        return originalGetOwnPropertyDescriptor.apply(this, arguments);
      };
    } catch (e) {
      // Ignore errors from our protection code
    }
  }
  
  // Run immediately
  blockExtensionErrors();
  
  // Also run when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockExtensionErrors);
  }
  
  // And when the window loads
  window.addEventListener('load', blockExtensionErrors);
})();
