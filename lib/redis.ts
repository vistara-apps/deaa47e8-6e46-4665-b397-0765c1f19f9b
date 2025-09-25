import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;

// Key prefixes for different data types
export const KEYS = {
  USER: 'user:',
  MEME: 'meme:',
  ENGAGEMENT: 'engagement:',
  TREND: 'trend:',
  MARKETPLACE: 'marketplace:',
  LEADERBOARD: 'leaderboard:',
  USER_MEMES: 'user:memes:',
  TRENDING_MEMES: 'trending:memes',
  USER_ENGAGEMENTS: 'user:engagements:',
} as const;

// Helper functions for key generation
export const getUserKey = (userId: string) => `${KEYS.USER}${userId}`;
export const getMemeKey = (memeId: string) => `${KEYS.MEME}${memeId}`;
export const getEngagementKey = (engagementId: string) => `${KEYS.ENGAGEMENT}${engagementId}`;
export const getTrendKey = (trendId: string) => `${KEYS.TREND}${trendId}`;
export const getMarketplaceKey = (itemId: string) => `${KEYS.MARKETPLACE}${itemId}`;
export const getUserMemesKey = (userId: string) => `${KEYS.USER_MEMES}${userId}`;
export const getUserEngagementsKey = (userId: string) => `${KEYS.USER_ENGAGEMENTS}${userId}`;

