import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Header from "./_components/header";
import Footer from "./_components/footer";
import SessionProvider from "./_components/session-provider";
import { WebSocketProvider } from "@/hooks/useWebSocket.tsx";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SixStar Fitness",
  description: "Fitness App.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Try to disable the problematic extension */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob: data:; object-src 'none'; connect-src 'self' https: wss: ws: http: blob:; frame-src 'self' https: http: blob: data:; child-src 'self' https: http: blob: data:;"
        />
      </head>
      <body className={`${ubuntu.variable} antialiased`}>
        <SessionProvider>
          <WebSocketProvider>
            <Header />
            <div className="flex min-h-screen flex-col">
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </WebSocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
