'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ShoppingCart, Coins, Trophy, Filter } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { TokenBalanceDisplay } from '@/components/TokenBalanceDisplay'

// Mock marketplace listings
const mockListings = [
  {
    id: '1',
    memeId: '1',
    title: 'AI Takeover Meme',
    imageUrl: '/api/placeholder/300/200',
    price: 50,
    currency: 'MEME',
    seller: 'alice',
    rarity: 'Rare',
    likes: 245,
  },
  {
    id: '2',
    title: 'Crypto Winter Classic',
    imageUrl: '/api/placeholder/300/200',
    price: 75,
    currency: 'MEME',
    seller: 'bob',
    rarity: 'Epic',
    likes: 189,
  },
  {
    id: '3',
    title: 'Meme Lord Supreme',
    imageUrl: '/api/placeholder/300/200',
    price: 200,
    currency: 'MEME',
    seller: 'charlie',
    rarity: 'Legendary',
    likes: 567,
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'MEME' | 'ETH'>('all')

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || listing.currency === filter
    return matchesSearch && matchesFilter
  })

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
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
                <h1 className="text-2xl font-bold text-gray-900">Meme Marketplace</h1>
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

        {/* Filters and Search */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search memes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'MEME', label: 'MEME' },
                  { key: 'ETH', label: 'ETH' },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filter === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(key as any)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Coins className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Volume (24h)</p>
                    <p className="text-2xl font-bold text-gray-900">12.5K MEME</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Floor Price</p>
                    <p className="text-2xl font-bold text-gray-900">25 MEME</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">👑</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Sale</p>
                    <p className="text-2xl font-bold text-gray-900">500 MEME</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-purple-500">
                    {listing.rarity}
                  </Badge>
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    NFT
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {listing.title}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-bold text-lg">{listing.price}</span>
                      <span className="text-sm text-gray-600">{listing.currency}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ❤️ {listing.likes}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">by @{listing.seller}</span>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button asChild>
                <Link href="/create">Create Your First Meme</Link>
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-8">
                <Trophy className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Sell Your Memes?
                </h3>
                <p className="text-gray-600 mb-6">
                  Turn your viral memes into NFTs and earn from the marketplace
                </p>
                <Button size="lg" asChild>
                  <Link href="/create">Create & Mint NFT</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AppShell>
  )
}

