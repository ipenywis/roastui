import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { SandPackCSS } from '@/components/sandPackStyles';

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
    <html lang="en" className="w-full min-h-full scroll-smooth">
      <head>
        <SandPackCSS />
      </head>
      <body className={cn(inter.className, 'bg-black relative size-full')}>
        <ThemeProvider defaultTheme="dark">
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
