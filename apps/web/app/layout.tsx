import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LangProvider } from '@/context/LangContext';
import { AuthProvider } from '@/context/AuthContext';
import { CityProvider } from '@/context/CityContext';
import { ToastProvider } from '@/components/common/Toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import PWABanner from '@/components/common/PWABanner';
import { CitySelector } from '@/components/city/CitySelector';
import { CityBottomSheet } from '@/components/city/CityBottomSheet';

export const metadata: Metadata = {
  title: 'ChalSaath — Har safar mein ek saathi',
  description: 'Har safar mein ek saathi. Hyperlocal ride-sharing across India\'s cities.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'ChalSaath',
    description: 'Har safar mein ek saathi.',
    url: 'https://chalsaath.vercel.app',
    siteName: 'ChalSaath',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Noto+Sans+Devanagari:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
        <ThemeProvider>
          <LangProvider>
            <AuthProvider>
              <CityProvider>
                <ToastProvider>
                  <CitySelector />
                  <CityBottomSheet />
                  <Header />
                  <main className="max-w-5xl mx-auto px-4 pt-6 pb-24 md:pb-6 min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <MobileNav />
                  <PWABanner />
                </ToastProvider>
              </CityProvider>
            </AuthProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
