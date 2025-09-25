'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AppShell from '@/components/AppShell'
import TokenBalanceDisplay from '@/components/TokenBalanceDisplay'
import { Meme, User } from '@/lib/types'

interface MarketplaceItem {
  itemId: string
  memeId: string
  sellerId: string
  price: number
  currency: 'MemeCoin' | 'ETH'
  status: 'listed' | 'sold' | 'cancelled'
  listedAt: Date
  meme: Meme & { creator: User }
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchMarketplaceItems()
    // Mock user for demo
    setUser({
      userId: 'demo-user',
      walletAddress: '0x1234567890123456789012345678901234567890',
      memeCoinBalance: 150.50,
      badges: ['Creator', 'Early Adopter'],
      leaderboardRank: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }, [])

  const fetchMarketplaceItems = async () => {
    // Mock marketplace items - in real app would fetch from API
    const mockItems: MarketplaceItem[] = [
      {
        itemId: '1',
        memeId: 'meme-1',
        sellerId: 'user-1',
        price: 25.5,
        currency: 'MemeCoin',
        status: 'listed',
        listedAt: new Date(),
        meme: {
          memeId: 'meme-1',
          creatorId: 'user-1',
          imageUrl: 'https://picsum.photos/300/300?random=1',
          textPrompt: 'When you realize AI is taking over memes',
          topic: 'AI Memes',
          upvotes: 150,
          shares: 45,
          creationTimestamp: new Date(),
          mintedAsNft: true,
          creator: {
            userId: 'user-1',
            walletAddress: '0xabc123...',
            memeCoinBalance: 500.0,
            badges: ['Top Creator'],
            leaderboardRank: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      {
        itemId: '2',
        memeId: 'meme-2',
        sellerId: 'user-2',
        price: 0.05,
        currency: 'ETH',
        status: 'listed',
        listedAt: new Date(),
        meme: {
          memeId: 'meme-2',
          creatorId: 'user-2',
          imageUrl: 'https://picsum.photos/300/300?random=2',
          textPrompt: 'Crypto winter be like...',
          topic: 'Crypto Winter',
          upvotes: 89,
          shares: 23,
          creationTimestamp: new Date(),
          mintedAsNft: false,
          creator: {
            userId: 'user-2',
            walletAddress: '0xdef456...',
            memeCoinBalance: 200.0,
            badges: ['Rising Star'],
            leaderboardRank: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    ]

    setItems(mockItems)
    setLoading(false)
  }

  const handlePurchase = async (itemId: string) => {
    if (!user) return

    // Mock purchase - in real app would handle blockchain transaction
    alert(`Purchase functionality would be implemented here for item ${itemId}`)
  }

  return (
    <AppShell>
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display text-cardinal">Meme Marketplace</h1>
            <p className="text-body text-cardinal/80 mt-xs">
              Buy and sell unique meme assets
            </p>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-sm text-cardinal/70">Your Balance</p>
              <TokenBalanceDisplay balance={user.memeCoinBalance} />
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-xl">
            <p className="text-body text-cardinal/70">Loading marketplace...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-xl">
            <p className="text-body text-cardinal/70 mb-md">No items in marketplace yet!</p>
            <p className="text-sm text-cardinal/50">Create viral memes to list them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {items.map((item) => (
              <div key={item.itemId} className="bg-surface rounded-lg shadow-card overflow-hidden">
                {/* Meme Image */}
                <div className="relative aspect-square">
                  <Image
                    src={item.meme.imageUrl}
                    alt={item.meme.textPrompt}
                    fill
                    className="object-cover"
                  />
                  {item.meme.mintedAsNft && (
                    <div className="absolute top-sm right-sm bg-cardinal text-surface px-xs py-xs rounded text-xs font-bold">
                      NFT
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-md">
                  <p className="text-body font-bold text-cardinal mb-xs">
                    {item.meme.textPrompt}
                  </p>
                  <p className="text-sm text-cardinal/70 mb-sm">#{item.meme.topic}</p>

                  {/* Creator */}
                  <div className="flex items-center gap-sm mb-md">
                    <div className="w-6 h-6 bg-cardinal rounded-full flex items-center justify-center">
                      <span className="text-xs text-surface font-bold">C</span>
                    </div>
                    <span className="text-sm text-cardinal/70">
                      {item.meme.creator.farcasterId || `Creator ${item.meme.creator.userId.slice(0, 6)}...`}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-md mb-md text-sm text-cardinal/70">
                    <span>❤️ {item.meme.upvotes}</span>
                    <span>🔗 {item.meme.shares}</span>
                  </div>

                  {/* Price and Buy Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-body font-bold text-cardinal">
                      {item.price} {item.currency}
                    </div>
                    <button
                      onClick={() => handlePurchase(item.itemId)}
                      className="bg-accent text-surface px-md py-sm rounded-md hover:bg-accent/90 transition-colors font-bold text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="bg-surface rounded-lg p-md shadow-card">
          <h3 className="text-body font-bold text-cardinal mb-sm">How the Marketplace Works</h3>
          <div className="grid md:grid-cols-3 gap-md text-sm text-cardinal/70">
            <div>
              <h4 className="font-bold text-cardinal mb-xs">1. Create Viral Memes</h4>
              <p>Earn MemeCoins by creating content that gets upvotes and shares.</p>
            </div>
            <div>
              <h4 className="font-bold text-cardinal mb-xs">2. Mint as NFT</h4>
              <p>Turn your most successful memes into unique NFTs on Base.</p>
            </div>
            <div>
              <h4 className="font-bold text-cardinal mb-xs">3. Sell & Trade</h4>
              <p>List your meme assets for sale and earn from your creativity.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

