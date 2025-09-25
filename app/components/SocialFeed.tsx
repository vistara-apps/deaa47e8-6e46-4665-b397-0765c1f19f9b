'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Flame } from 'lucide-react';
import { MemeCard } from './MemeCard';
import { Meme } from '@/lib/types';
import { calculateTrendingScore } from '@/lib/utils';

interface SocialFeedProps {
  memes: Meme[];
  onMemeEngagement: (memeId: string, type: 'upvote' | 'comment' | 'share') => void;
}

export function SocialFeed({ memes, onMemeEngagement }: SocialFeedProps) {
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'hot'>('trending');
  const [sortedMemes, setSortedMemes] = useState<Meme[]>([]);

  useEffect(() => {
    let sorted = [...memes];
    
    switch (sortBy) {
      case 'trending':
        sorted.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
        break;
      case 'recent':
        sorted.sort((a, b) => b.creationTimestamp - a.creationTimestamp);
        break;
      case 'hot':
        sorted.sort((a, b) => (b.upvotes + b.shares * 2) - (a.upvotes + a.shares * 2));
        break;
    }
    
    setSortedMemes(sorted);
  }, [memes, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meme Feed</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('trending')}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'trending' 
                ? 'bg-accent text-black' 
                : 'bg-surface text-muted hover:text-fg'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
          <button
            onClick={() => setSortBy('hot')}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'hot' 
                ? 'bg-accent text-black' 
                : 'bg-surface text-muted hover:text-fg'
            }`}
          >
            <Flame className="w-4 h-4" />
            Hot
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'recent' 
                ? 'bg-accent text-black' 
                : 'bg-surface text-muted hover:text-fg'
            }`}
          >
            <Clock className="w-4 h-4" />
            Recent
          </button>
        </div>
      </div>

      {/* Memes List */}
      <div className="space-y-4">
        {sortedMemes.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-muted mb-4">No memes yet!</p>
            <p className="text-sm text-muted">Be the first to create a viral meme and earn MemeCoins</p>
          </div>
        ) : (
          sortedMemes.map((meme) => (
            <MemeCard
              key={meme.memeId}
              meme={meme}
              onUpvote={(id) => onMemeEngagement(id, 'upvote')}
              onComment={(id) => onMemeEngagement(id, 'comment')}
              onShare={(id) => onMemeEngagement(id, 'share')}
            />
          ))
        )}
      </div>
    </div>
  );
}
