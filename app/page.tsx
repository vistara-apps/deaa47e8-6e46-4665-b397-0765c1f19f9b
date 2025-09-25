'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Meme, User } from '@/lib/types'
import AppShell from '@/components/AppShell'
import MemeCard from '@/components/MemeCard'
import TokenBalanceDisplay from '@/components/TokenBalanceDisplay'

interface MemeWithCreator extends Meme {
  creator: User
  engagements: any[]
}

export default function HomePage() {
  const [memes, setMemes] = useState<MemeWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchMemes()
    // Mock user for demo - in real app would connect wallet
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

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/memes?limit=10')
      const data = await response.json()
      if (data.success) {
        setMemes(data.data)
      }
    } catch (error) {
      console.error('Error fetching memes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async (memeId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          memeId,
          type: 'upvote',
        }),
      })

      if (response.ok) {
        // Refresh memes to show updated counts
        fetchMemes()
      }
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  const handleComment = async (memeId: string, commentText: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          memeId,
          type: 'comment',
          commentText,
        }),
      })

      if (response.ok) {
        fetchMemes()
      }
    } catch (error) {
      console.error('Error commenting:', error)
    }
  }

  const handleShare = async (memeId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          memeId,
          type: 'share',
        }),
      })

      if (response.ok) {
        fetchMemes()
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <AppShell>
      <div className="space-y-lg">
        {/* Hero Section */}
        <div className="text-center py-xl">
          <h1 className="text-display text-cardinal mb-md">
            Welcome to MemeCoin Mania
          </h1>
          <p className="text-body text-cardinal/80 mb-lg max-w-2xl mx-auto">
            Create, Share, Earn: The Trending Meme Marketplace. Turn your viral memes into MemeCoins on Base blockchain.
          </p>
          <div className="flex gap-md justify-center">
            <Link
              href="/create"
              className="bg-cardinal text-surface px-lg py-md rounded-lg hover:bg-cardinal/90 transition-colors font-bold"
            >
              Create Meme
            </Link>
            <Link
              href="/feed"
              className="bg-accent text-surface px-lg py-md rounded-lg hover:bg-accent/90 transition-colors font-bold"
            >
              View Feed
            </Link>
          </div>
        </div>

        {/* User Balance */}
        {user && (
          <div className="bg-surface rounded-lg p-md shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body font-bold text-cardinal mb-xs">Your Balance</h3>
                <TokenBalanceDisplay balance={user.memeCoinBalance} />
              </div>
              <div className="text-right">
                <p className="text-sm text-cardinal/70">Rank #{user.leaderboardRank}</p>
                <div className="flex gap-xs mt-xs">
                  {user.badges.map((badge, index) => (
                    <span key={index} className="bg-cardinal text-surface px-xs py-xs rounded text-xs">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Memes */}
        <div>
          <h2 className="text-2xl font-bold text-cardinal mb-md">Trending Memes</h2>
          {loading ? (
            <div className="text-center py-xl">
              <p className="text-body text-cardinal/70">Loading memes...</p>
            </div>
          ) : memes.length === 0 ? (
            <div className="text-center py-xl">
              <p className="text-body text-cardinal/70 mb-md">No memes yet!</p>
              <Link
                href="/create"
                className="bg-cardinal text-surface px-lg py-md rounded-lg hover:bg-cardinal/90 transition-colors font-bold"
              >
                Create the first meme
              </Link>
            </div>
          ) : (
            <div className="grid-content">
              {memes.map((meme) => (
                <MemeCard
                  key={meme.memeId}
                  meme={meme}
                  creator={meme.creator}
                  onUpvote={handleUpvote}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

