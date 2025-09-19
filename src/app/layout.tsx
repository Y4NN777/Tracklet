import type {Metadata} from 'next';
import './globals.css';
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import ErrorBoundary from '@/components/error-boundary';
import { NotificationProvider } from '@/contexts/notification-context';
import { PreferencesProvider } from '@/contexts/preferences-context';
import { PreferencesThemeBridge } from '@/components/preferences-theme-bridge';

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Smart personal finance management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}  suppressHydrationWarning={true}>
        <ThemeProvider>
          <PreferencesProvider>
            <PreferencesThemeBridge />
            <NotificationProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </NotificationProvider>
            <Toaster />
          </PreferencesProvider>
        </ThemeProvider>
        <>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-EEB7ENZ8ZY"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EEB7ENZ8ZY');
            `}
          </Script>
        </>
      </body>
    </html>
  );
}
