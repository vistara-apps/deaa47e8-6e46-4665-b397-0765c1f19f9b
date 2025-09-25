'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { SocialFeed } from './components/SocialFeed';
import { MemeCreator } from './components/MemeCreator';
import { Marketplace } from './components/Marketplace';
import { UserProfile } from './components/UserProfile';
import { Meme, User } from '@/lib/types';
import { getTrendingMemes, getUser, getUserMemes } from '@/lib/database';
import { logger } from '@/lib/logger';
  {
    memeId: 'meme_3',
    creatorId: 'user_101',
    imageUrl: '/api/placeholder/400/300',
    textPrompt: 'NFT holders in 2021 vs NFT holders in 2024',
    topic: 'NFTs',
    upvotes: 89,
    shares: 15,
    comments: 8,
    creationTimestamp: Date.now() - 10800000,
    mintedAsNft: false,
    trending: false
  }
];

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'feed' | 'create' | 'marketplace' | 'profile'>('feed');
  const [user, setUser] = useState<User | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [userMemes, setUserMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // For demo purposes, use a mock user ID
        // In production, this would come from Farcaster authentication
        const mockUserId = 'demo_user_123';

        // Load user data
        let userData = await getUser(mockUserId);
        if (!userData) {
          userData = {
            userId: mockUserId,
            farcasterId: 'memecreator',
            displayName: 'MemeCreator',
            avatar: '/api/placeholder/80/80',
            memeCoinBalance: 100,
            badges: [],
            leaderboardRank: 0,
          };
        }
        setUser(userData);

        // Load trending memes
        const trendingMemes = await getTrendingMemes(20);
        setMemes(trendingMemes);

        // Load user's memes
        const userMemeData = await getUserMemes(mockUserId);
        setUserMemes(userMemeData);

        logger.info('Data loaded successfully', { userId: mockUserId, memeCount: trendingMemes.length });
      } catch (error) {
        logger.error('Failed to load data', {}, error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMemeCreated = async (newMeme: Meme) => {
    try {
      // Add to local state immediately for UI responsiveness
      setMemes(prev => [newMeme, ...prev]);
      setUserMemes(prev => [newMeme, ...prev]);

      // Call rewards API
      const response = await fetch('/api/rewards/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'meme_creation',
          userId: newMeme.creatorId,
          memeId: newMeme.memeId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        logger.rewardEvent(newMeme.creatorId, result.amount, result.reason);
      }

      setCurrentView('feed');
    } catch (error) {
      logger.error('Failed to create meme', { memeId: newMeme.memeId }, error as Error);
    }
  };

  const handleMemeEngagement = async (memeId: string, type: 'upvote' | 'comment' | 'share') => {
    try {
      // Update local state immediately
      setMemes(prev => prev.map(meme => {
        if (meme.memeId === memeId) {
          const updated = { ...meme };
          switch (type) {
            case 'upvote':
              updated.upvotes += 1;
              break;
            case 'comment':
              updated.comments += 1;
              break;
            case 'share':
              updated.shares += 1;
              break;
          }
          return updated;
        }
        return meme;
      }));

      // Call rewards API
      const response = await fetch('/api/rewards/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'engagement',
          userId: user?.userId || 'anonymous',
          memeId,
          engagementType: type,
          creatorId: memes.find(m => m.memeId === memeId)?.creatorId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.amount > 0) {
          setUser(prev => prev ? {
            ...prev,
            memeCoinBalance: prev.memeCoinBalance + result.amount
          } : null);
        }
      }
    } catch (error) {
      logger.error('Failed to process engagement', { memeId, type }, error as Error);
    }
  };

  const handlePurchase = async (itemId: string, price: number) => {
    if (!user || user.memeCoinBalance < price) {
      alert('Insufficient balance!');
      return;
    }

    try {
      const response = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          buyerId: user.userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(prev => prev ? {
          ...prev,
          memeCoinBalance: prev.memeCoinBalance - price
        } : null);
        alert('Purchase successful!');
        logger.info('Marketplace purchase completed', { itemId, buyerId: user.userId, price });
      } else {
        const error = await response.json();
        alert(`Purchase failed: ${error.error}`);
      }
    } catch (error) {
      logger.error('Failed to process purchase', { itemId }, error as Error);
      alert('Purchase failed!');
    }
  };

  const handleThemeChange = () => {
    window.location.href = '/theme-preview';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Loading MemeCoin Mania...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted mb-4">Failed to load user data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-black rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'feed':
        return (
          <SocialFeed 
            memes={memes} 
            onMemeEngagement={handleMemeEngagement}
          />
        );
      case 'create':
        return (
          <MemeCreator onMemeCreated={handleMemeCreated} />
        );
      case 'marketplace':
        return (
          <Marketplace 
            memes={memes}
            userBalance={user.memeCoinBalance}
            onPurchase={handlePurchase}
          />
        );
      case 'profile':
        return (
          <UserProfile 
            user={user}
            userMemes={userMemes}
            onThemeChange={handleThemeChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell
      currentView={currentView}
      onViewChange={setCurrentView}
      userBalance={user.memeCoinBalance}
    >
      {renderCurrentView()}
    </AppShell>
  );
}
