import redis, { KEYS, getUserKey, getMemeKey, getEngagementKey, getTrendKey, getMarketplaceKey, getUserMemesKey, getUserEngagementsKey } from './redis';
import { User, Meme, Engagement, Trend, MarketplaceItem } from './types';

// User operations
export const createUser = async (user: User): Promise<void> => {
  const key = getUserKey(user.userId);
  await redis.hset(key, user);
  await redis.expire(key, 60 * 60 * 24 * 30); // 30 days
};

export const getUser = async (userId: string): Promise<User | null> => {
  const key = getUserKey(userId);
  const user = await redis.hgetall(key);
  return Object.keys(user).length > 0 ? user as User : null;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  const key = getUserKey(userId);
  await redis.hset(key, updates);
};

export const getTopUsers = async (limit: number = 10): Promise<User[]> => {
  const pattern = `${KEYS.USER}*`;
  const keys = await redis.keys(pattern);
  const users: User[] = [];

  for (const key of keys) {
    const user = await redis.hgetall(key);
    if (user && user.memeCoinBalance) {
      users.push(user as User);
    }
  }

  return users
    .sort((a, b) => b.memeCoinBalance - a.memeCoinBalance)
    .slice(0, limit);
};

// Meme operations
export const createMeme = async (meme: Meme): Promise<void> => {
  const key = getMemeKey(meme.memeId);
  await redis.hset(key, meme);
  await redis.expire(key, 60 * 60 * 24 * 7); // 7 days

  // Add to user's memes list
  const userMemesKey = getUserMemesKey(meme.creatorId);
  await redis.sadd(userMemesKey, meme.memeId);
  await redis.expire(userMemesKey, 60 * 60 * 24 * 30); // 30 days

  // Add to trending memes sorted set
  await redis.zadd(KEYS.TRENDING_MEMES, meme.upvotes + meme.shares + meme.comments, meme.memeId);
};

export const getMeme = async (memeId: string): Promise<Meme | null> => {
  const key = getMemeKey(memeId);
  const meme = await redis.hgetall(key);
  return Object.keys(meme).length > 0 ? meme as Meme : null;
};

export const updateMeme = async (memeId: string, updates: Partial<Meme>): Promise<void> => {
  const key = getMemeKey(memeId);
  await redis.hset(key, updates);

  // Update trending score if engagement changed
  if (updates.upvotes !== undefined || updates.shares !== undefined || updates.comments !== undefined) {
    const meme = await getMeme(memeId);
    if (meme) {
      const score = meme.upvotes + meme.shares + meme.comments;
      await redis.zadd(KEYS.TRENDING_MEMES, score, memeId);
    }
  }
};

export const getTrendingMemes = async (limit: number = 20): Promise<Meme[]> => {
  const memeIds = await redis.zrevrange(KEYS.TRENDING_MEMES, 0, limit - 1);
  const memes: Meme[] = [];

  for (const memeId of memeIds) {
    const meme = await getMeme(memeId);
    if (meme) {
      memes.push(meme);
    }
  }

  return memes;
};

export const getUserMemes = async (userId: string): Promise<Meme[]> => {
  const userMemesKey = getUserMemesKey(userId);
  const memeIds = await redis.smembers(userMemesKey);
  const memes: Meme[] = [];

  for (const memeId of memeIds) {
    const meme = await getMeme(memeId);
    if (meme) {
      memes.push(meme);
    }
  }

  return memes.sort((a, b) => b.creationTimestamp - a.creationTimestamp);
};

// Engagement operations
export const createEngagement = async (engagement: Engagement): Promise<void> => {
  const key = getEngagementKey(engagement.engagementId);
  await redis.hset(key, engagement);
  await redis.expire(key, 60 * 60 * 24 * 7); // 7 days

  // Add to user's engagements
  const userEngagementsKey = getUserEngagementsKey(engagement.userId);
  await redis.sadd(userEngagementsKey, engagement.engagementId);
  await redis.expire(userEngagementsKey, 60 * 60 * 24 * 30); // 30 days

  // Update meme engagement count
  const meme = await getMeme(engagement.memeId);
  if (meme) {
    const updates: Partial<Meme> = {};
    switch (engagement.type) {
      case 'upvote':
        updates.upvotes = meme.upvotes + 1;
        break;
      case 'comment':
        updates.comments = meme.comments + 1;
        break;
      case 'share':
        updates.shares = meme.shares + 1;
        break;
    }
    await updateMeme(engagement.memeId, updates);
  }
};

export const getEngagement = async (engagementId: string): Promise<Engagement | null> => {
  const key = getEngagementKey(engagementId);
  const engagement = await redis.hgetall(key);
  return Object.keys(engagement).length > 0 ? engagement as Engagement : null;
};

export const getUserEngagements = async (userId: string): Promise<Engagement[]> => {
  const userEngagementsKey = getUserEngagementsKey(userId);
  const engagementIds = await redis.smembers(userEngagementsKey);
  const engagements: Engagement[] = [];

  for (const engagementId of engagementIds) {
    const engagement = await getEngagement(engagementId);
    if (engagement) {
      engagements.push(engagement);
    }
  }

  return engagements.sort((a, b) => b.timestamp - a.timestamp);
};

// Trend operations
export const createTrend = async (trend: Trend): Promise<void> => {
  const key = getTrendKey(trend.trendId);
  await redis.hset(key, trend);
  await redis.expire(key, 60 * 60 * 24); // 24 hours
};

export const getTrend = async (trendId: string): Promise<Trend | null> => {
  const key = getTrendKey(trendId);
  const trend = await redis.hgetall(key);
  return Object.keys(trend).length > 0 ? trend as Trend : null;
};

export const updateTrend = async (trendId: string, updates: Partial<Trend>): Promise<void> => {
  const key = getTrendKey(trendId);
  await redis.hset(key, updates);
};

export const getAllTrends = async (): Promise<Trend[]> => {
  const pattern = `${KEYS.TREND}*`;
  const keys = await redis.keys(pattern);
  const trends: Trend[] = [];

  for (const key of keys) {
    const trend = await redis.hgetall(key);
    if (trend) {
      trends.push(trend as Trend);
    }
  }

  return trends.sort((a, b) => b.frequency - a.frequency);
};

// Marketplace operations
export const createMarketplaceItem = async (item: MarketplaceItem): Promise<void> => {
  const key = getMarketplaceKey(item.id);
  await redis.hset(key, item);
  await redis.expire(key, 60 * 60 * 24 * 7); // 7 days
};

export const getMarketplaceItem = async (itemId: string): Promise<MarketplaceItem | null> => {
  const key = getMarketplaceKey(itemId);
  const item = await redis.hgetall(key);
  return Object.keys(item).length > 0 ? item as MarketplaceItem : null;
};

export const updateMarketplaceItem = async (itemId: string, updates: Partial<MarketplaceItem>): Promise<void> => {
  const key = getMarketplaceKey(itemId);
  await redis.hset(key, updates);
};

export const getListedItems = async (): Promise<MarketplaceItem[]> => {
  const pattern = `${KEYS.MARKETPLACE}*`;
  const keys = await redis.keys(pattern);
  const items: MarketplaceItem[] = [];

  for (const key of keys) {
    const item = await redis.hgetall(key);
    if (item && (item as MarketplaceItem).listed) {
      items.push(item as MarketplaceItem);
    }
  }

  return items;
};

export const deleteMarketplaceItem = async (itemId: string): Promise<void> => {
  const key = getMarketplaceKey(itemId);
  await redis.del(key);
};

