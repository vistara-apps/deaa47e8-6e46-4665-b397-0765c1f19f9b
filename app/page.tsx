'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Coins, Zap } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { TokenBalanceDisplay } from '@/components/TokenBalanceDisplay'
import { SocialFeed } from '@/components/SocialFeed'
import { DataService } from '@/lib/models'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'marketplace' | 'analytics'>('feed')

  const trendingMemes = DataService.getTrendingMemes(3)
  const currentTrends = DataService.getCurrentTrends(5)

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">MemeCoin Mania</h1>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                  Base Mini App
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <TokenBalanceDisplay balance={1500} />
                <Button asChild>
                  <Link href="/create">Create Meme</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'feed', label: 'Feed', icon: Users },
                { id: 'create', label: 'Create', icon: Zap },
                { id: 'marketplace', label: 'Marketplace', icon: Coins },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'feed' && (
            <div className="space-y-8">
              {/* Trending Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🔥 Trending Now</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingMemes.map((meme) => (
                    <Card key={meme.memeId} className="overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Meme Image</span>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-2">{meme.textPrompt}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span>👍 {meme.upvotes}</span>
                            <span>🔗 {meme.shares}</span>
                          </div>
                          <Badge variant="outline">+{DataService.calculateReward(meme, 'upvote')} MEME</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Social Feed */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📱 Social Feed</h2>
                <SocialFeed />
              </section>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Create Your Meme</h2>
              <p className="text-gray-600 mb-8">Turn trending topics into viral memes and earn MemeCoins!</p>
              <Button size="lg" asChild>
                <Link href="/create">Start Creating</Link>
              </Button>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🛒 Meme Marketplace</h2>
              <p className="text-gray-600 mb-8">Buy and sell unique meme NFTs and exclusive content.</p>
              <Button size="lg" asChild>
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-900">📊 Trend Analytics</h2>

              {/* Current Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>🔥 Current Trending Topics</CardTitle>
                  <CardDescription>Topics with highest engagement right now</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentTrends.map((trend) => (
                      <div key={trend.trendId} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">#{trend.keyword}</span>
                          <span className="text-sm text-gray-500 ml-2">{trend.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{trend.frequency} mentions</span>
                          <Badge variant="secondary">Trending</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Coins className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">MemeCoins Minted</p>
                        <p className="text-2xl font-bold text-gray-900">45,892</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Memes</p>
                        <p className="text-2xl font-bold text-gray-900">3,421</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  )
}

