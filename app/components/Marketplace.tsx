'use client';

import { useState } from 'react';
import { Store, Coins, Award, Filter } from 'lucide-react';
import { MemeCard } from './MemeCard';
import { Meme, MarketplaceItem } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { RARITY_COLORS } from '@/lib/constants';

interface MarketplaceProps {
  memes: Meme[];
  userBalance: number;
  onPurchase: (itemId: string, price: number) => void;
}

export function Marketplace({ memes, userBalance, onPurchase }: MarketplaceProps) {
  const [filter, setFilter] = useState<'all' | 'common' | 'rare' | 'legendary'>('all');
  
  // Mock marketplace items based on memes
  const marketplaceItems: MarketplaceItem[] = memes
    .filter(meme => meme.upvotes > 50) // Only popular memes
    .map(meme => ({
      id: `item_${meme.memeId}`,
      memeId: meme.memeId,
      sellerId: meme.creatorId,
      price: Math.floor(meme.upvotes / 10) + 50,
      currency: 'MEMECOIN' as const,
      isNft: meme.mintedAsNft,
      rarity: meme.upvotes >= 1000 ? 'legendary' : meme.upvotes >= 100 ? 'rare' : 'common',
      listed: true
    }));

  const filteredItems = filter === 'all' 
    ? marketplaceItems 
    : marketplaceItems.filter(item => item.rarity === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Store className="w-6 h-6" />
          Meme Marketplace
        </h2>
        <p className="text-muted">Trade exclusive meme assets and NFTs</p>
      </div>

      {/* Balance Display */}
      <div className="glass-card p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-5 h-5 coin-glow" />
          <span className="text-xl font-bold coin-glow">{formatNumber(userBalance)}</span>
          <span className="text-muted">MemeCoins</span>
        </div>
        <p className="text-xs text-muted">Available for purchases</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-muted flex-shrink-0" />
        {['all', 'common', 'rare', 'legendary'].map((rarity) => (
          <button
            key={rarity}
            onClick={() => setFilter(rarity as any)}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              filter === rarity
                ? 'bg-accent text-black'
                : 'bg-surface text-fg hover:bg-opacity-80'
            }`}
          >
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </button>
        ))}
      </div>

      {/* Marketplace Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Store className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted mb-2">No items available</p>
            <p className="text-sm text-muted">Check back later for new meme assets!</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const meme = memes.find(m => m.memeId === item.memeId);
            if (!meme) return null;

            return (
              <div key={item.id} className="glass-card p-4 space-y-4">
                {/* Item Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className={`w-5 h-5 ${RARITY_COLORS[item.rarity]}`} />
                    <span className={`text-sm font-medium ${RARITY_COLORS[item.rarity]}`}>
                      {item.rarity.toUpperCase()}
                    </span>
                    {item.isNft && (
                      <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                        NFT
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 coin-glow font-bold">
                      <Coins className="w-4 h-4" />
                      {formatNumber(item.price)}
                    </div>
                    <p className="text-xs text-muted">MemeCoins</p>
                  </div>
                </div>

                {/* Meme Preview */}
                <MemeCard meme={meme} variant="compact" />

                {/* Purchase Button */}
                <button
                  onClick={() => onPurchase(item.id, item.price)}
                  disabled={userBalance < item.price}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {userBalance < item.price ? 'Insufficient MemeCoins' : 'Purchase'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Marketplace Stats */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Marketplace Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold coin-glow">{formatNumber(marketplaceItems.length)}</p>
            <p className="text-muted">Items Listed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold coin-glow">
              {formatNumber(marketplaceItems.reduce((sum, item) => sum + item.price, 0))}
            </p>
            <p className="text-muted">Total Value</p>
          </div>
        </div>
      </div>
    </div>
  );
}
