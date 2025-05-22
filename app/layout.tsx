import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Header from "./_components/header";
import Footer from "./_components/footer";
import SessionProvider from "./_components/session-provider";
import SuppressHydrationWarning from "./_components/suppress-hydration-warning";

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
      <body className={`${ubuntu.variable} antialiased`}>
        <SuppressHydrationWarning>
          <SessionProvider>
            <Header />
            <div className="flex min-h-screen flex-col">
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </SessionProvider>
        </SuppressHydrationWarning>
      </body>
    </html>
  );
}
