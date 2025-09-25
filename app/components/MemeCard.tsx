'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Award } from 'lucide-react';
import { Meme } from '@/lib/types';
import { formatNumber, formatTimeAgo, getMemeRarity } from '@/lib/utils';
import { RARITY_COLORS } from '@/lib/constants';

interface MemeCardProps {
  meme: Meme;
  variant?: 'display' | 'compact';
  onUpvote?: (memeId: string) => void;
  onComment?: (memeId: string) => void;
  onShare?: (memeId: string) => void;
}

export function MemeCard({ 
  meme, 
  variant = 'display', 
  onUpvote, 
  onComment, 
  onShare 
}: MemeCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const rarity = getMemeRarity(meme.upvotes);

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    onUpvote?.(meme.memeId);
  };

  if (variant === 'compact') {
    return (
      <div className="meme-card flex gap-3">
        <img 
          src={meme.imageUrl || '/api/placeholder/80/80'} 
          alt="Meme"
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-2">{meme.textPrompt}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(meme.upvotes)}
            </span>
            <span>{formatTimeAgo(meme.creationTimestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meme-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {meme.creatorId.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">@{meme.creatorId.slice(0, 8)}</p>
            <p className="text-xs text-muted">{formatTimeAgo(meme.creationTimestamp)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {meme.trending && (
            <div className="trend-badge">
              <TrendingUp className="w-3 h-3" />
            </div>
          )}
          {meme.mintedAsNft && (
            <Award className={`w-4 h-4 ${RARITY_COLORS[rarity]}`} />
          )}
        </div>
      </div>

      {/* Topic Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-surface px-2 py-1 rounded-full text-xs font-medium">
          #{meme.topic}
        </span>
      </div>

      {/* Meme Content */}
      <div className="space-y-3">
        <img 
          src={meme.imageUrl || '/api/placeholder/400/300'} 
          alt="Meme"
          className="w-full rounded-lg object-cover max-h-80"
        />
        <p className="text-sm leading-relaxed">{meme.textPrompt}</p>
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <button
          onClick={handleUpvote}
          className={`engagement-btn ${
            isUpvoted ? 'text-red-400' : 'text-muted hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
          <span>{formatNumber(meme.upvotes + (isUpvoted ? 1 : 0))}</span>
        </button>

        <button
          onClick={() => onComment?.(meme.memeId)}
          className="engagement-btn text-muted hover:text-blue-400"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(meme.comments)}</span>
        </button>

        <button
          onClick={() => onShare?.(meme.memeId)}
          className="engagement-btn text-muted hover:text-green-400"
        >
          <Share2 className="w-4 h-4" />
          <span>{formatNumber(meme.shares)}</span>
        </button>
      </div>
    </div>
  );
}
