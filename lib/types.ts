export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  memeCoinBalance: number;
  badges: string[];
  leaderboardRank: number;
  displayName?: string;
  avatar?: string;
}

export interface Meme {
  memeId: string;
  creatorId: string;
  imageUrl: string;
  textPrompt: string;
  topic: string;
  upvotes: number;
  shares: number;
  comments: number;
  creationTimestamp: number;
  mintedAsNft: boolean;
  trending?: boolean;
}

export interface Engagement {
  engagementId: string;
  userId: string;
  memeId: string;
  type: 'upvote' | 'comment' | 'share';
  timestamp: number;
  content?: string; // For comments
}

export interface Trend {
  trendId: string;
  keyword: string;
  frequency: number;
  lastUpdated: number;
  category: 'crypto' | 'tech' | 'culture' | 'finance' | 'general';
}

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  textAreas: {
    x: number;
    y: number;
    width: number;
    height: number;
    placeholder: string;
  }[];
}

export interface MarketplaceItem {
  id: string;
  memeId: string;
  sellerId: string;
  price: number;
  currency: 'MEMECOIN' | 'ETH';
  isNft: boolean;
  rarity: 'common' | 'rare' | 'legendary';
  listed: boolean;
}
