import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MemeCoin Mania - Create, Share, Earn',
  description: 'The trending meme marketplace on Base. Create memes, earn MemeCoins, and trade in the ultimate meme economy.',
  keywords: ['memes', 'cryptocurrency', 'Base', 'blockchain', 'social', 'marketplace'],
  authors: [{ name: 'MemeCoin Mania Team' }],
  openGraph: {
    title: 'MemeCoin Mania',
    description: 'Create, Share, Earn: The Trending Meme Marketplace',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
              {children}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
