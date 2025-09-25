import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function generateMemeId(): string {
  return `meme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateTrendingScore(meme: any): number {
  const ageHours = (Date.now() - meme.creationTimestamp) / (1000 * 60 * 60);
  const engagementScore = meme.upvotes * 3 + meme.shares * 5 + meme.comments * 2;
  
  // Decay score over time
  const timeDecay = Math.max(0.1, 1 - (ageHours / 24));
  
  return engagementScore * timeDecay;
}

export function getMemeRarity(upvotes: number): 'common' | 'rare' | 'legendary' {
  if (upvotes >= 1000) return 'legendary';
  if (upvotes >= 100) return 'rare';
  return 'common';
}
