'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, TrendingUp, Users, BarChart3, Target, Calendar, Award } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { TokenBalanceDisplay } from '@/components/TokenBalanceDisplay'
import { DataService } from '@/lib/models'

// Mock analytics data
const mockAnalytics = {
  userStats: {
    memesCreated: 12,
    totalEarnings: 1250,
    engagementReceived: 1847,
    rank: 15,
    badges: ['Creator', 'Engager', 'Trendsetter'],
  },
  trendingData: [
    { topic: 'AI', mentions: 1250, growth: '+15%', engagement: 89 },
    { topic: 'Crypto', mentions: 980, growth: '+8%', engagement: 76 },
    { topic: 'MemeCoin', mentions: 750, growth: '+22%', engagement: 92 },
    { topic: 'Web3', mentions: 620, growth: '+12%', engagement: 68 },
    { topic: 'NFT', mentions: 540, growth: '+5%', engagement: 71 },
  ],
  performanceData: [
    { date: '2024-01-01', memes: 2, earnings: 150, engagement: 234 },
    { date: '2024-01-02', memes: 1, earnings: 75, engagement: 156 },
    { date: '2024-01-03', memes: 3, earnings: 225, engagement: 345 },
    { date: '2024-01-04', memes: 2, earnings: 180, engagement: 267 },
    { date: '2024-01-05', memes: 4, earnings: 320, engagement: 423 },
  ],
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  const leaderboard = DataService.getLeaderboard(10)

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feed
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
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

        {/* Time Range Selector */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex space-x-2">
              {[
                { key: '7d', label: '7 Days' },
                { key: '30d', label: '30 Days' },
                { key: '90d', label: '90 Days' },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={timeRange === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(key as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Personal Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Memes Created</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockAnalytics.userStats.memesCreated}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockAnalytics.userStats.totalEarnings} MEME
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Engagement</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockAnalytics.userStats.engagementReceived}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Global Rank</p>
                        <p className="text-2xl font-bold text-gray-900">
                          #{mockAnalytics.userStats.rank}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your earned badges and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {mockAnalytics.userStats.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="px-3 py-1">
                        <Award className="w-4 h-4 mr-2" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 Insights</CardTitle>
                  <CardDescription>AI-powered recommendations to boost your performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Trending Opportunity:</strong> AI memes are up 15% this week.
                      Consider creating content around this topic.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Engagement Tip:</strong> Your memes perform 40% better when posted
                      between 2-4 PM EST.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Monetization:</strong> Convert your top-performing memes to NFTs
                      for additional revenue streams.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>🔥 Trending Topics</CardTitle>
                  <CardDescription>Real-time trend analysis and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.trendingData.map((trend, index) => (
                      <div key={trend.topic} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">#{trend.topic}</h3>
                            <p className="text-sm text-gray-600">{trend.mentions} mentions</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-green-600">
                            {trend.growth}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">Engagement</p>
                            <p className="text-lg font-bold">{trend.engagement}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Performance Over Time</CardTitle>
                  <CardDescription>Your meme creation and earnings history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.performanceData.map((day) => (
                      <div key={day.date} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-6 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">Memes</p>
                            <p className="font-bold">{day.memes}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Earnings</p>
                            <p className="font-bold text-green-600">{day.earnings} MEME</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Engagement</p>
                            <p className="font-bold text-blue-600">{day.engagement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>🏆 Global Leaderboard</CardTitle>
                  <CardDescription>Top meme creators this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">@{user.farcasterId}</h3>
                            <p className="text-sm text-gray-600">Rank #{user.leaderboardRank}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Balance</p>
                          <p className="text-lg font-bold text-yellow-600">
                            {user.memeCoinBalance.toLocaleString()} MEME
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppShell>
  )
}

