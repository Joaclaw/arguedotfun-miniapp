import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import MiniKitInit from '@/components/MiniKitInit';
import '@coinbase/onchainkit/styles.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1B1A1A',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'),
  ),
  title: 'argue.fun — Debate Prediction Markets',
  description:
    'Bet USDC on debate outcomes. Write compelling arguments. AI picks the winner.',
  openGraph: {
    title: 'argue.fun',
    description: 'Debate prediction markets on Base',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1B1A1A] text-white`}
      >
        <Providers>
          <MiniKitInit />
          {children}
        </Providers>
      </body>
    </html>
  );
}
