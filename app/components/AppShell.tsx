'use client';

import { useState } from 'react';
import { Coins, TrendingUp, Store, Plus, User } from 'lucide-react';
import { TokenBalanceDisplay } from './TokenBalanceDisplay';

interface AppShellProps {
  children: React.ReactNode;
  currentView: 'feed' | 'create' | 'marketplace' | 'profile';
  onViewChange: (view: 'feed' | 'create' | 'marketplace' | 'profile') => void;
  userBalance: number;
}

export function AppShell({ children, currentView, onViewChange, userBalance }: AppShellProps) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="glass-card p-4 m-4 mb-0 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MemeCoin Mania</h1>
              <p className="text-sm text-muted">Create • Share • Earn</p>
            </div>
          </div>
          <TokenBalanceDisplay balance={userBalance} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-2">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-card m-4 mt-0 p-2 rounded-b-lg">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onViewChange('feed')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
              currentView === 'feed' 
                ? 'bg-accent text-black' 
                : 'text-muted hover:text-fg'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Feed</span>
          </button>
          
          <button
            onClick={() => onViewChange('create')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
              currentView === 'create' 
                ? 'bg-accent text-black' 
                : 'text-muted hover:text-fg'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Create</span>
          </button>
          
          <button
            onClick={() => onViewChange('marketplace')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
              currentView === 'marketplace' 
                ? 'bg-accent text-black' 
                : 'text-muted hover:text-fg'
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-xs font-medium">Market</span>
          </button>
          
          <button
            onClick={() => onViewChange('profile')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
              currentView === 'profile' 
                ? 'bg-accent text-black' 
                : 'text-muted hover:text-fg'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
