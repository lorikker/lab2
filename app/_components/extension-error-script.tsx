"use client";

export default function ExtensionErrorScript() {
  // This script will be injected into the head and run before React
  const scriptContent = `
    (function() {
      // Store original console methods
      var originalConsoleError = console.error;
      var originalConsoleWarn = console.warn;
      var originalConsoleLog = console.log;
      
      // Function to check if an error is from the problematic extension
      function isExtensionError(args) {
        // Check if any argument contains the extension ID or error message
        for (var i = 0; i < args.length; i++) {
          var arg = args[i];
          if (arg && typeof arg === 'string') {
            if (
              arg.indexOf('egjidjbpglichdcondbcbdnbeeppgdph') !== -1 ||
              arg.indexOf('inpage.js') !== -1 ||
              arg.indexOf('chrome-extension') !== -1 ||
              arg.indexOf('Cannot read properties of null') !== -1
            ) {
              return true;
            }
          }
          
          // Check error objects
          if (arg && arg.stack && typeof arg.stack === 'string') {
            if (
              arg.stack.indexOf('egjidjbpglichdcondbcbdnbeeppgdph') !== -1 ||
              arg.stack.indexOf('inpage.js') !== -1 ||
              arg.stack.indexOf('chrome-extension') !== -1
            ) {
              return true;
            }
          }
        }
        return false;
      }
      
      // Override console.error
      console.error = function() {
        if (!isExtensionError(arguments)) {
          originalConsoleError.apply(console, arguments);
        }
      };
      
      // Override console.warn
      console.warn = function() {
        if (!isExtensionError(arguments)) {
          originalConsoleWarn.apply(console, arguments);
        }
      };
      
      // Override console.log
      console.log = function() {
        if (!isExtensionError(arguments)) {
          originalConsoleLog.apply(console, arguments);
        }
      };
      
      // Add global error handler
      window.addEventListener('error', function(event) {
        if (
          (event.message && event.message.indexOf('Cannot read properties of null') !== -1) ||
          (event.filename && event.filename.indexOf('chrome-extension') !== -1) ||
          (event.filename && event.filename.indexOf('egjidjbpglichdcondbcbdnbeeppgdph') !== -1)
        ) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
        return false;
      }, true);
    })();
  `;

  return (
    <script 
      dangerouslySetInnerHTML={{ __html: scriptContent }} 
      id="extension-error-suppressor"
    />
  );
}
