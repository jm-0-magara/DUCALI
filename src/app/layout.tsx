// src/app/layout.tsx (Updated with AuthProvider, OrderProvider & CurrencyProvider)
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider, CurrencyProvider, ComparisonProvider } from '../contexts';
import { OrderProvider } from '../contexts/OrderContext';
import { MessagingProvider } from '../contexts/MessagingContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair-display',
})

export const metadata: Metadata = {
  title: 'Ducali - Bespoke Marketplace',
  description: 'Connect with skilled artisans for custom projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            <CurrencyProvider>
              <OrderProvider>
                <ComparisonProvider>
                  <MessagingProvider>
                    {children}
                    <Toaster 
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#1e293b',
                          color: '#f8fafc',
                          border: '1px solid #475569',
                        },
                        success: {
                          style: {
                            background: '#065f46',
                            color: '#f0fdf4',
                            border: '1px solid #10b981',
                          },
                        },
                        error: {
                          style: {
                            background: '#7f1d1d',
                            color: '#fef2f2',
                            border: '1px solid #ef4444',
                          },
                        },
                      }}
                    />
                  </MessagingProvider>
                </ComparisonProvider>
              </OrderProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}