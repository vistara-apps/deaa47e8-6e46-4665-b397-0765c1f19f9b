'use client';

import { Coins } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface TokenBalanceDisplayProps {
  balance: number;
  variant?: 'default' | 'large';
}

export function TokenBalanceDisplay({ balance, variant = 'default' }: TokenBalanceDisplayProps) {
  if (variant === 'large') {
    return (
      <div className="glass-card p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-8 h-8 coin-glow" />
          <span className="text-3xl font-bold coin-glow">{formatNumber(balance)}</span>
        </div>
        <p className="text-muted">MemeCoins</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg">
      <Coins className="w-4 h-4 coin-glow" />
      <span className="font-semibold coin-glow">{formatNumber(balance)}</span>
    </div>
  );
}
