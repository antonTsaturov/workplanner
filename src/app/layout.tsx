import type { Metadata } from "next";
import { SessionProvider } from './components/Providers';
import {NextIntlClientProvider} from 'next-intl';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workplanner",
  description: "Plan your work",
};

export const viewport: Viewport = {
  width: '1200',
  initialScale: 0.5,
  maximumScale: 1.0,
  userScalable: false,
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <NextIntlClientProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
          </NextIntlClientProvider>
        </body>
      </html>
  );
}
