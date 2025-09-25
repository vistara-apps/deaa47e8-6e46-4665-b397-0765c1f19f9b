'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'
import TokenBalanceDisplay from '@/components/TokenBalanceDisplay'
import { User, TrendData } from '@/lib/types'
import { TrendingUp, Users, Coins, Award } from 'lucide-react'

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [trends, setTrends] = useState<TrendData[]>([])
  const [userStats, setUserStats] = useState({
    totalMemes: 0,
    totalUpvotes: 0,
    totalShares: 0,
    totalEarnings: 0,
  })

  useEffect(() => {
    // Mock user data
    setUser({
      userId: 'demo-user',
      walletAddress: '0x1234567890123456789012345678901234567890',
      memeCoinBalance: 150.50,
      badges: ['Creator', 'Early Adopter'],
      leaderboardRank: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Mock trends data
    setTrends([
      { keyword: 'AI Memes', frequency: 1250, growth: 15.5, last24h: 89 },
      { keyword: 'Crypto Winter', frequency: 980, growth: 8.2, last24h: 67 },
      { keyword: 'Base Network', frequency: 750, growth: 22.1, last24h: 45 },
      { keyword: 'Meme Coins', frequency: 680, growth: 12.8, last24h: 38 },
      { keyword: 'Web3 Gaming', frequency: 520, growth: 18.9, last24h: 29 },
    ])

    // Mock user stats
    setUserStats({
      totalMemes: 12,
      totalUpvotes: 245,
      totalShares: 89,
      totalEarnings: 150.50,
    })
  }, [])

  return (
    <AppShell>
      <div className="space-y-lg">
        <div>
          <h1 className="text-display text-cardinal mb-xs">Analytics Dashboard</h1>
          <p className="text-body text-cardinal/80">
            Track trending topics and your meme performance
          </p>
        </div>

        {/* User Stats */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <div className="bg-surface rounded-lg p-md shadow-card text-center">
              <div className="flex items-center justify-center mb-sm">
                <Award className="text-cardinal" size={24} />
              </div>
              <p className="text-2xl font-bold text-cardinal">{user.leaderboardRank}</p>
              <p className="text-sm text-cardinal/70">Your Rank</p>
            </div>

            <div className="bg-surface rounded-lg p-md shadow-card text-center">
              <div className="flex items-center justify-center mb-sm">
                <Coins className="text-cardinal" size={24} />
              </div>
              <p className="text-2xl font-bold text-cardinal">{userStats.totalEarnings.toFixed(1)}</p>
              <p className="text-sm text-cardinal/70">Total Earnings</p>
            </div>

            <div className="bg-surface rounded-lg p-md shadow-card text-center">
              <div className="flex items-center justify-center mb-sm">
                <TrendingUp className="text-cardinal" size={24} />
              </div>
              <p className="text-2xl font-bold text-cardinal">{userStats.totalUpvotes}</p>
              <p className="text-sm text-cardinal/70">Total Upvotes</p>
            </div>

            <div className="bg-surface rounded-lg p-md shadow-card text-center">
              <div className="flex items-center justify-center mb-sm">
                <Users className="text-cardinal" size={24} />
              </div>
              <p className="text-2xl font-bold text-cardinal">{userStats.totalShares}</p>
              <p className="text-sm text-cardinal/70">Total Shares</p>
            </div>
          </div>
        )}

        {/* Trending Topics */}
        <div className="bg-surface rounded-lg p-md shadow-card">
          <h2 className="text-body font-bold text-cardinal mb-md">Trending Topics</h2>
          <div className="space-y-sm">
            {trends.map((trend, index) => (
              <div key={trend.keyword} className="flex items-center justify-between p-sm rounded-md bg-bg">
                <div className="flex items-center gap-sm">
                  <span className="text-cardinal font-bold">#{index + 1}</span>
                  <span className="text-cardinal">{trend.keyword}</span>
                </div>
                <div className="flex items-center gap-md text-sm">
                  <span className="text-cardinal/70">{trend.frequency} posts</span>
                  <span className={`font-bold ${trend.growth > 0 ? 'text-accent' : 'text-cardinal/50'}`}>
                    {trend.growth > 0 ? '+' : ''}{trend.growth}%
                  </span>
                  <span className="text-cardinal/70">+{trend.last24h} today</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-surface rounded-lg p-md shadow-card">
          <h2 className="text-body font-bold text-cardinal mb-md">Performance Insights</h2>
          <div className="grid md:grid-cols-2 gap-lg">
            <div>
              <h3 className="text-cardinal font-bold mb-sm">Your Best Performing Memes</h3>
              <div className="space-y-xs text-sm text-cardinal/70">
                <p>• "When you realize AI is taking over memes" - 150 upvotes</p>
                <p>• "Crypto winter be like..." - 89 upvotes</p>
                <p>• "Base Network memes" - 67 upvotes</p>
              </div>
            </div>

            <div>
              <h3 className="text-cardinal font-bold mb-sm">Top Earning Topics</h3>
              <div className="space-y-xs text-sm text-cardinal/70">
                <p>• AI Memes: 45.5 MemeCoins</p>
                <p>• Crypto Winter: 32.2 MemeCoins</p>
                <p>• Web3 Gaming: 28.8 MemeCoins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Success */}
        <div className="bg-surface rounded-lg p-md shadow-card">
          <h2 className="text-body font-bold text-cardinal mb-md">Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-lg text-sm text-cardinal/70">
            <div>
              <h3 className="font-bold text-cardinal mb-xs">Timing Matters</h3>
              <p>Post when trending topics are peaking for maximum visibility and engagement.</p>
            </div>
            <div>
              <h3 className="font-bold text-cardinal mb-xs">Quality Over Quantity</h3>
              <p>Focus on creating high-quality, original memes rather than spamming content.</p>
            </div>
            <div>
              <h3 className="font-bold text-cardinal mb-xs">Engage Actively</h3>
              <p>Respond to comments and engage with other creators to build community.</p>
            </div>
            <div>
              <h3 className="font-bold text-cardinal mb-xs">Track Performance</h3>
              <p>Use this dashboard to understand what works and optimize your strategy.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

