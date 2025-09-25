import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { ErrorBoundary } from '../components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'MemeCoin Mania',
  description: 'Create, Share, Earn: The Trending Meme Marketplace on Base',
  keywords: ['memes', 'crypto', 'Base', 'MemeCoin', 'NFT', 'blockchain'],
  authors: [{ name: 'MemeCoin Mania Team' }],
  openGraph: {
    title: 'MemeCoin Mania',
    description: 'Create, Share, Earn: The Trending Meme Marketplace on Base',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemeCoin Mania',
    description: 'Create, Share, Earn: The Trending Meme Marketplace on Base',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={`${process.env.NEXT_PUBLIC_APP_URL || 'https://memecoin-mania.com'}/api/og`} />
        <meta name="fc:frame:button:1" content="Create Meme" />
        <meta name="fc:frame:button:1:action" content="post" />
        <meta name="fc:frame:button:2" content="View Feed" />
        <meta name="fc:frame:button:2:action" content="post" />
        <meta name="fc:frame:button:3" content="Marketplace" />
        <meta name="fc:frame:button:3:action" content="post" />
        <meta name="fc:frame:button:4" content="Analytics" />
        <meta name="fc:frame:button:4:action" content="post" />
        <meta name="fc:frame:post_url" content={`${process.env.NEXT_PUBLIC_APP_URL || 'https://memecoin-mania.com'}/api/frame`} />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="default">
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
