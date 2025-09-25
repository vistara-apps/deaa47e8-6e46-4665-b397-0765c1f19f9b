'use client';

import { useState } from 'react';
import { User, Award, TrendingUp, Coins, Settings2 } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { TokenBalanceDisplay } from './TokenBalanceDisplay';
import { MemeCard } from './MemeCard';
import { User as UserType, Meme } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface UserProfileProps {
  user: UserType;
  userMemes: Meme[];
  onThemeChange?: () => void;
}

export function UserProfile({ user, userMemes, onThemeChange }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'memes' | 'achievements' | 'stats'>('memes');

  const totalUpvotes = userMemes.reduce((sum, meme) => sum + meme.upvotes, 0);
  const totalShares = userMemes.reduce((sum, meme) => sum + meme.shares, 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-6 text-center">
        <Wallet>
          <ConnectWallet>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-20 h-20" />
              <div>
                <Name className="text-xl font-bold" />
                <p className="text-muted">@{user.userId.slice(0, 8)}</p>
              </div>
            </div>
          </ConnectWallet>
        </Wallet>
        
        <div className="mt-4">
          <TokenBalanceDisplay balance={user.memeCoinBalance} variant="large" />
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="text-center">
            <p className="text-lg font-bold">{formatNumber(userMemes.length)}</p>
            <p className="text-muted">Memes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">#{user.leaderboardRank}</p>
            <p className="text-muted">Rank</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{user.badges.length}</p>
            <p className="text-muted">Badges</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Settings
          </h3>
          <button
            onClick={onThemeChange}
            className="btn-secondary text-sm"
          >
            Change Theme
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'memes', label: 'My Memes', icon: TrendingUp },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'stats', label: 'Stats', icon: User }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-accent text-black'
                : 'bg-surface text-muted hover:text-fg'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'memes' && (
          <div className="space-y-4">
            {userMemes.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <TrendingUp className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted mb-2">No memes created yet</p>
                <p className="text-sm text-muted">Start creating to build your meme empire!</p>
              </div>
            ) : (
              userMemes.map((meme) => (
                <MemeCard key={meme.memeId} meme={meme} />
              ))
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3">
            {user.badges.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Award className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted mb-2">No badges earned yet</p>
                <p className="text-sm text-muted">Create viral memes to unlock achievements!</p>
              </div>
            ) : (
              user.badges.map((badge, index) => (
                <div key={index} className="glass-card p-4 flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="font-semibold">{badge}</p>
                    <p className="text-sm text-muted">Achievement unlocked</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold coin-glow">{formatNumber(totalUpvotes)}</p>
              <p className="text-sm text-muted">Total Upvotes</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold coin-glow">{formatNumber(totalShares)}</p>
              <p className="text-sm text-muted">Total Shares</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold coin-glow">{formatNumber(user.memeCoinBalance)}</p>
              <p className="text-sm text-muted">MemeCoins Earned</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold coin-glow">#{user.leaderboardRank}</p>
              <p className="text-sm text-muted">Global Rank</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
