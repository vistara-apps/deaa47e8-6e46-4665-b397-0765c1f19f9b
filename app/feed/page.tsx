'use client'

import { useEffect, useState } from 'react'
import { Meme, User } from '@/lib/types'
import AppShell from '@/components/AppShell'
import MemeCard from '@/components/MemeCard'

interface MemeWithCreator extends Meme {
  creator: User
  engagements: any[]
}

export default function FeedPage() {
  const [memes, setMemes] = useState<MemeWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchMemes()
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

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/memes?limit=20')
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
        <div className="flex items-center justify-between">
          <h1 className="text-display text-cardinal">Meme Feed</h1>
          <div className="text-body text-cardinal/70">
            Discover trending memes and earn MemeCoins
          </div>
        </div>

        {loading ? (
          <div className="text-center py-xl">
            <p className="text-body text-cardinal/70">Loading feed...</p>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-xl">
            <p className="text-body text-cardinal/70 mb-md">No memes in the feed yet!</p>
            <p className="text-sm text-cardinal/50">Be the first to create and share a meme.</p>
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
    </AppShell>
  )
}

