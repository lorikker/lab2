import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load extension blocker script as early as possible */}
        <script
          src="/extension-blocker.js"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Inline version of extension blocker for immediate execution
              (function() {
                // Target the specific extension ID
                const TARGET_EXTENSION_ID = 'egjidjbpglichdcondbcbdnbeeppgdph';
                
                // Override error handling
                const originalConsoleError = console.error;
                console.error = function() {
                  const args = Array.from(arguments);
                  const errorString = args.map(arg => String(arg)).join(' ');
                  
                  if (errorString.includes(TARGET_EXTENSION_ID) || 
                      errorString.includes('inpage.js') ||
                      errorString.includes('Cannot read properties of null')) {
                    return;
                  }
                  
                  return originalConsoleError.apply(console, arguments);
                };
                
                // Add global error handler
                window.addEventListener('error', function(event) {
                  if ((event.filename && event.filename.includes('chrome-extension')) ||
                      (event.message && event.message.includes('Cannot read properties of null'))) {
                    event.preventDefault();
                    event.stopPropagation();
                    return true;
                  }
                  return false;
                }, true);
              })();
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
