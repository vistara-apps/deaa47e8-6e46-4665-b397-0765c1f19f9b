import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const neynar = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY!,
});

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  bio: string;
  followerCount: number;
  followingCount: number;
}

export interface FarcasterCast {
  hash: string;
  text: string;
  author: FarcasterUser;
  timestamp: string;
  replies: number;
  likes: number;
  recasts: number;
  embeds: any[];
}

// Convert Neynar user to our format
export const convertNeynarUser = (user: any): FarcasterUser => ({
  fid: user.fid,
  username: user.username,
  displayName: user.display_name,
  pfp: user.pfp_url,
  bio: user.profile?.bio?.text || '',
  followerCount: user.follower_count,
  followingCount: user.following_count,
});

// Convert Neynar cast to our format
export const convertNeynarCast = (cast: any): FarcasterCast => ({
  hash: cast.hash,
  text: cast.text,
  author: convertNeynarUser(cast.author),
  timestamp: cast.timestamp,
  replies: cast.replies?.count || 0,
  likes: cast.reactions?.likes_count || 0,
  recasts: cast.reactions?.recasts_count || 0,
  embeds: cast.embeds || [],
});

// Get user profile from Farcaster
export const getFarcasterUser = async (fid: number): Promise<FarcasterUser | null> => {
  try {
    const response = await neynar.fetchBulkUsers({ fids: [fid] });
    if (response.users && response.users.length > 0) {
      return convertNeynarUser(response.users[0]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    return null;
  }
};

// Get user's recent casts
export const getUserCasts = async (fid: number, limit: number = 10): Promise<FarcasterCast[]> => {
  try {
    const response = await neynar.fetchCastsForUser({ fid, limit });
    return response.result.casts.map(convertNeynarCast);
  } catch (error) {
    console.error('Error fetching user casts:', error);
    return [];
  }
};

// Search for casts by keyword
export const searchCasts = async (query: string, limit: number = 20): Promise<FarcasterCast[]> => {
  try {
    const response = await neynar.searchCasts({ q: query, limit });
    return response.result.casts.map(convertNeynarCast);
  } catch (error) {
    console.error('Error searching casts:', error);
    return [];
  }
};

// Get trending topics from Farcaster
export const getTrendingTopics = async (): Promise<string[]> => {
  try {
    // This is a simplified implementation
    // In a real app, you'd analyze cast content for trending keywords
    const recentCasts = await neynar.fetchAllCastsInThread({ threadHash: '0x' }); // Get recent casts
    const keywords = new Map<string, number>();

    // Simple keyword extraction (in production, use NLP)
    recentCasts.result.casts.forEach((cast: any) => {
      const words = cast.text.toLowerCase().split(/\s+/);
      words.forEach((word: string) => {
        if (word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'has', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)) {
          keywords.set(word, (keywords.get(word) || 0) + 1);
        }
      });
    });

    return Array.from(keywords.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  } catch (error) {
    console.error('Error getting trending topics:', error);
    return [];
  }
};

// Publish a cast
export const publishCast = async (signerUuid: string, text: string, embeds?: any[]): Promise<string | null> => {
  try {
    const response = await neynar.publishCast({
      signerUuid,
      text,
      embeds,
    });
    return response.cast.hash;
  } catch (error) {
    console.error('Error publishing cast:', error);
    return null;
  }
};

// Get cast by hash
export const getCast = async (hash: string): Promise<FarcasterCast | null> => {
  try {
    const response = await neynar.fetchCast({ identifier: hash, type: 'hash' });
    return convertNeynarCast(response.cast);
  } catch (error) {
    console.error('Error fetching cast:', error);
    return null;
  }
};

