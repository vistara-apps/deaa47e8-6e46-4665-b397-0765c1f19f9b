'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { CreateMemeForm, User } from '@/lib/types'

export default function CreateMemePage() {
  const [form, setForm] = useState<CreateMemeForm>({
    textPrompt: '',
    topic: '',
  })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
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

    // Mock trending topics
    setTrendingTopics([
      'AI Memes',
      'Crypto Winter',
      'Base Network',
      'Meme Coins',
      'Web3 Gaming',
      'NFT Art',
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.textPrompt.trim() || !form.topic.trim()) return

    setLoading(true)
    try {
      // Mock image generation - in real app would call AI service
      const mockImageUrl = `https://picsum.photos/400/400?random=${Date.now()}`

      const response = await fetch('/api/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: user.userId,
          imageUrl: mockImageUrl,
          textPrompt: form.textPrompt,
          topic: form.topic,
        }),
      })

      if (response.ok) {
        // Calculate rewards for the new meme
        const data = await response.json()
        await fetch('/api/rewards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memeId: data.data.memeId }),
        })

        router.push('/feed')
      }
    } catch (error) {
      console.error('Error creating meme:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectTopic = (topic: string) => {
    setForm(prev => ({ ...prev, topic }))
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-lg">
        <div className="text-center">
          <h1 className="text-display text-cardinal mb-md">Create Meme</h1>
          <p className="text-body text-cardinal/80">
            Turn trending topics into viral memes and earn MemeCoins
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Topic Selection */}
          <div>
            <label className="block text-body font-bold text-cardinal mb-md">
              Choose a Trending Topic
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
              {trendingTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => selectTopic(topic)}
                  className={`p-md rounded-lg border-2 transition-all ${
                    form.topic === topic
                      ? 'border-cardinal bg-cardinal text-surface'
                      : 'border-cardinal/20 bg-surface text-cardinal hover:border-cardinal/50'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Text Prompt */}
          <div>
            <label htmlFor="textPrompt" className="block text-body font-bold text-cardinal mb-sm">
              Meme Text
            </label>
            <textarea
              id="textPrompt"
              value={form.textPrompt}
              onChange={(e) => setForm(prev => ({ ...prev, textPrompt: e.target.value }))}
              placeholder="Enter your meme text..."
              className="w-full px-md py-sm border border-cardinal/20 rounded-md bg-surface text-cardinal placeholder-cardinal/50 focus:outline-none focus:border-cardinal min-h-32 resize-none"
              required
            />
          </div>

          {/* Preview */}
          {form.textPrompt && form.topic && (
            <div className="bg-surface rounded-lg p-md shadow-card">
              <h3 className="text-body font-bold text-cardinal mb-sm">Preview</h3>
              <div className="bg-bg rounded-md p-md">
                <p className="text-cardinal mb-sm">#{form.topic}</p>
                <p className="text-cardinal/80">{form.textPrompt}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading || !form.textPrompt.trim() || !form.topic.trim()}
              className="bg-cardinal text-surface px-xl py-md rounded-lg hover:bg-cardinal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-body"
            >
              {loading ? 'Creating Meme...' : 'Create Meme & Earn Coins'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="bg-surface rounded-lg p-md shadow-card">
          <h3 className="text-body font-bold text-cardinal mb-sm">💡 Tips for Viral Memes</h3>
          <ul className="text-sm text-cardinal/70 space-y-xs">
            <li>• Keep it short and punchy</li>
            <li>• Use trending topics for maximum reach</li>
            <li>• Add humor and relatability</li>
            <li>• Engage with current events</li>
          </ul>
        </div>
      </div>
    </AppShell>
  )
}

