import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { SandPackCSS } from '@/components/sandPackStyles';
import { SWRProvider } from '@/lib/providers/swrProvider';
import { ReactQueryProvider } from '@/lib/providers/reactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RoastUI',
  description: 'Roast your UI/UX design using AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="flex w-full h-full min-h-full overflow-auto scroll-smooth"
    >
      <head>
        <SandPackCSS />
      </head>
      <body
        className={cn(
          inter.className,
          'bg-black size-full min-h-full dark scroll-smooth',
        )}
      >
        <ThemeProvider defaultTheme="dark">
          <SWRProvider>
            <ReactQueryProvider>
              <SessionProvider>{children}</SessionProvider>
            </ReactQueryProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
