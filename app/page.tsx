'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { SocialFeed } from './components/SocialFeed';
import { MemeCreator } from './components/MemeCreator';
import { Marketplace } from './components/Marketplace';
import { UserProfile } from './components/UserProfile';
import { Meme, User } from '@/lib/types';
import { MEMECOIN_REWARDS } from '@/lib/constants';

// Mock data
const mockUser: User = {
  userId: 'user_123',
  farcasterId: 'memecreator',
  walletAddress: '0x1234...5678',
  memeCoinBalance: 1250,
  badges: ['First Meme', 'Viral Creator'],
  leaderboardRank: 42,
  displayName: 'MemeCreator',
  avatar: '/api/placeholder/80/80'
};

const mockMemes: Meme[] = [
  {
    memeId: 'meme_1',
    creatorId: 'user_456',
    imageUrl: '/api/placeholder/400/300',
    textPrompt: 'When you finally understand DeFi but gas fees are $200',
    topic: 'DeFi',
    upvotes: 234,
    shares: 45,
    comments: 23,
    creationTimestamp: Date.now() - 3600000,
    mintedAsNft: true,
    trending: true
  },
  {
    memeId: 'meme_2',
    creatorId: 'user_789',
    imageUrl: '/api/placeholder/400/300',
    textPrompt: 'Me explaining Base to my friends vs Me actually using Base',
    topic: 'Base Chain',
    upvotes: 156,
    shares: 28,
    comments: 12,
    creationTimestamp: Date.now() - 7200000,
    mintedAsNft: false,
    trending: false
  },
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
  const [user, setUser] = useState<User>(mockUser);
  const [memes, setMemes] = useState<Meme[]>(mockMemes);

  const handleMemeCreated = (newMeme: Meme) => {
    setMemes(prev => [newMeme, ...prev]);
    setUser(prev => ({
      ...prev,
      memeCoinBalance: prev.memeCoinBalance + MEMECOIN_REWARDS.CREATE_MEME
    }));
    setCurrentView('feed');
  };

  const handleMemeEngagement = (memeId: string, type: 'upvote' | 'comment' | 'share') => {
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

    // Award MemeCoins for engagement
    const reward = MEMECOIN_REWARDS[`${type.toUpperCase()}_RECEIVED` as keyof typeof MEMECOIN_REWARDS] || 0;
    if (reward > 0) {
      setUser(prev => ({
        ...prev,
        memeCoinBalance: prev.memeCoinBalance + reward
      }));
    }
  };

  const handlePurchase = (itemId: string, price: number) => {
    if (user.memeCoinBalance >= price) {
      setUser(prev => ({
        ...prev,
        memeCoinBalance: prev.memeCoinBalance - price
      }));
      // Handle purchase logic here
      alert('Purchase successful!');
    }
  };

  const handleThemeChange = () => {
    window.location.href = '/theme-preview';
  };

  const userMemes = memes.filter(meme => meme.creatorId === user.userId);

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
