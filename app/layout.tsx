import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boilerplate v2 - SWISS CODE L.L.C.",
  description: "Boilerplate for SWISS CODE L.L.C.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} antialiased`}>{children}</body>
    </html>
  );
}
