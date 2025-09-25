'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, TrendingUp, Upload } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { DataService } from '@/lib/models'
import { CreateMemeForm } from '@/lib/types'

export default function CreateMemePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateMemeForm>({
    topic: '',
    textPrompt: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null)

  const currentTrends = DataService.getCurrentTrends(8)

  const handleInputChange = (field: keyof CreateMemeForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTrendSelect = (trend: string) => {
    setFormData(prev => ({ ...prev, topic: trend }))
  }

  const handleGenerateMeme = async () => {
    if (!formData.topic || !formData.textPrompt) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const mockMemeUrl = `/api/placeholder/400/300?text=${encodeURIComponent(formData.textPrompt)}`
      setGeneratedMeme(mockMemeUrl)
      setIsGenerating(false)
    }, 2000)
  }

  const handlePublishMeme = () => {
    if (!generatedMeme) return

    // Create the meme in our data store
    const newMeme = DataService.createMeme({
      creatorId: 'current-user', // In real app, get from auth
      imageUrl: generatedMeme,
      textPrompt: formData.textPrompt,
      topic: formData.topic,
      upvotes: 0,
      shares: 0,
      mintedAsNft: false,
      isTrending: false,
    })

    // Award initial MemeCoins for creation
    DataService.updateUserBalance('current-user', 10)

    // Redirect to feed
    router.push('/')
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feed
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Create Meme</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    Trending Topics
                  </CardTitle>
                  <CardDescription>
                    Choose a trending topic to maximize your meme's reach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentTrends.map((trend) => (
                      <Badge
                        key={trend.trendId}
                        variant={formData.topic === trend.keyword ? "default" : "outline"}
                        className="cursor-pointer hover:bg-orange-100"
                        onClick={() => handleTrendSelect(trend.keyword)}
                      >
                        #{trend.keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meme Creation Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                    Create Your Meme
                  </CardTitle>
                  <CardDescription>
                    Craft a viral meme and earn MemeCoins for engagement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic/Keyword
                    </label>
                    <Input
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      placeholder="e.g., AI, Crypto, Memes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meme Text/Prompt
                    </label>
                    <Textarea
                      value={formData.textPrompt}
                      onChange={(e) => handleInputChange('textPrompt', e.target.value)}
                      placeholder="Describe your meme idea..."
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleGenerateMeme}
                      disabled={!formData.topic || !formData.textPrompt || isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Meme
                        </>
                      )}
                    </Button>

                    <Button variant="outline" disabled>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards Info */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">💰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Earn MemeCoins</h3>
                      <p className="text-sm text-gray-600">
                        Get 10 MEME for creating + earn more from upvotes and shares!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your meme will look before publishing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedMeme ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={generatedMeme}
                          alt="Generated meme"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button onClick={handlePublishMeme} className="flex-1">
                          🚀 Publish Meme
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setGeneratedMeme(null)}
                        >
                          Regenerate
                        </Button>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>📊 Potential earnings: ~50-200 MEME</p>
                        <p>🎯 Target audience: {formData.topic} enthusiasts</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Your meme preview will appear here</p>
                        <p className="text-sm mt-2">Fill out the form and click Generate</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Use trending topics for maximum visibility</p>
                  <p>• Keep text concise and punchy</p>
                  <p>• Add emojis to increase engagement</p>
                  <p>• Time your posts during peak hours</p>
                  <p>• Engage with comments to boost virality</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  )
}

