// src/app/layout.tsx (Updated with AuthProvider & OrderProvider)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../contexts';
import { OrderProvider } from '../contexts/OrderContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ducali - Bespoke Marketplace",
  description: "Connect with skilled artisans and creators to get custom-made products that are uniquely yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}