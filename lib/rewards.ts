import { MEMECOIN_REWARDS } from './constants';
import { updateUser, getUser, createEngagement } from './database';
import { rewardUser } from './blockchain';
import { User, Engagement } from './types';

export interface RewardResult {
  success: boolean;
  amount: number;
  reason: string;
  error?: string;
}

// Calculate reward for meme creation
export const rewardMemeCreation = async (userId: string, memeId: string): Promise<RewardResult> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return { success: false, amount: 0, reason: 'User not found', error: 'User not found' };
    }

    const rewardAmount = MEMECOIN_REWARDS.CREATE_MEME;

    // Update user balance in database
    await updateUser(userId, {
      memeCoinBalance: user.memeCoinBalance + rewardAmount
    });

    // Try to reward on blockchain (if configured)
    try {
      // Note: In a real implementation, you'd need the user's wallet address
      // For now, we'll just update the database
      // await rewardUser(user.walletAddress!, 'Meme creation');
    } catch (blockchainError) {
      console.warn('Blockchain reward failed, using database only:', blockchainError);
    }

    return {
      success: true,
      amount: rewardAmount,
      reason: 'Meme creation reward'
    };
  } catch (error) {
    console.error('Error rewarding meme creation:', error);
    return {
      success: false,
      amount: 0,
      reason: 'Meme creation reward',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Calculate reward for engagement (upvote, comment, share)
export const rewardEngagement = async (
  engagerId: string,
  creatorId: string,
  memeId: string,
  type: 'upvote' | 'comment' | 'share',
  content?: string
): Promise<RewardResult> => {
  try {
    // Don't reward self-engagement
    if (engagerId === creatorId) {
      return { success: true, amount: 0, reason: 'Self-engagement not rewarded' };
    }

    const rewardKey = `${type.toUpperCase()}_RECEIVED` as keyof typeof MEMECOIN_REWARDS;
    const rewardAmount = MEMECOIN_REWARDS[rewardKey] || 0;

    if (rewardAmount === 0) {
      return { success: false, amount: 0, reason: 'Invalid engagement type' };
    }

    // Get creator
    const creator = await getUser(creatorId);
    if (!creator) {
      return { success: false, amount: 0, reason: 'Creator not found', error: 'Creator not found' };
    }

    // Create engagement record
    const engagement: Engagement = {
      engagementId: `${type}_${engagerId}_${memeId}_${Date.now()}`,
      userId: engagerId,
      memeId,
      type,
      timestamp: Date.now(),
      content: type === 'comment' ? content : undefined,
    };

    await createEngagement(engagement);

    // Update creator's balance
    await updateUser(creatorId, {
      memeCoinBalance: creator.memeCoinBalance + rewardAmount
    });

    return {
      success: true,
      amount: rewardAmount,
      reason: `${type} reward`
    };
  } catch (error) {
    console.error('Error rewarding engagement:', error);
    return {
      success: false,
      amount: 0,
      reason: `${type} reward`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Calculate trending bonus
export const rewardTrendingBonus = async (userId: string, memeId: string): Promise<RewardResult> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return { success: false, amount: 0, reason: 'User not found', error: 'User not found' };
    }

    const rewardAmount = MEMECOIN_REWARDS.TRENDING_BONUS;

    // Update user balance
    await updateUser(userId, {
      memeCoinBalance: user.memeCoinBalance + rewardAmount
    });

    return {
      success: true,
      amount: rewardAmount,
      reason: 'Trending meme bonus'
    };
  } catch (error) {
    console.error('Error rewarding trending bonus:', error);
    return {
      success: false,
      amount: 0,
      reason: 'Trending meme bonus',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Calculate daily login reward
export const rewardDailyLogin = async (userId: string): Promise<RewardResult> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return { success: false, amount: 0, reason: 'User not found', error: 'User not found' };
    }

    const rewardAmount = MEMECOIN_REWARDS.DAILY_LOGIN;

    // Update user balance
    await updateUser(userId, {
      memeCoinBalance: user.memeCoinBalance + rewardAmount
    });

    return {
      success: true,
      amount: rewardAmount,
      reason: 'Daily login reward'
    };
  } catch (error) {
    console.error('Error rewarding daily login:', error);
    return {
      success: false,
      amount: 0,
      reason: 'Daily login reward',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Calculate first meme bonus
export const rewardFirstMeme = async (userId: string): Promise<RewardResult> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return { success: false, amount: 0, reason: 'User not found', error: 'User not found' };
    }

    // Check if user already has the first meme badge
    if (user.badges.includes('First Meme')) {
      return { success: true, amount: 0, reason: 'First meme bonus already claimed' };
    }

    const rewardAmount = MEMECOIN_REWARDS.FIRST_MEME;

    // Update user balance and add badge
    await updateUser(userId, {
      memeCoinBalance: user.memeCoinBalance + rewardAmount,
      badges: [...user.badges, 'First Meme']
    });

    return {
      success: true,
      amount: rewardAmount,
      reason: 'First meme bonus'
    };
  } catch (error) {
    console.error('Error rewarding first meme:', error);
    return {
      success: false,
      amount: 0,
      reason: 'First meme bonus',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Calculate leaderboard rewards (weekly)
export const calculateLeaderboardRewards = async (): Promise<RewardResult[]> => {
  try {
    // This would be called weekly to reward top users
    // For now, return empty array as this would be implemented with a cron job
    return [];
  } catch (error) {
    console.error('Error calculating leaderboard rewards:', error);
    return [];
  }
};

// Get user's total earnings
export const getUserEarnings = async (userId: string): Promise<{
  totalEarned: number;
  breakdown: Record<string, number>;
  recentRewards: Array<{
    amount: number;
    reason: string;
    timestamp: number;
  }>;
}> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return {
        totalEarned: 0,
        breakdown: {},
        recentRewards: []
      };
    }

    // In a real implementation, you'd track reward history
    // For now, return basic info
    return {
      totalEarned: user.memeCoinBalance,
      breakdown: {
        memes: user.memeCoinBalance * 0.6, // Estimate
        engagement: user.memeCoinBalance * 0.3,
        bonuses: user.memeCoinBalance * 0.1,
      },
      recentRewards: [] // Would be populated from reward history
    };
  } catch (error) {
    console.error('Error getting user earnings:', error);
    return {
      totalEarned: 0,
      breakdown: {},
      recentRewards: []
    };
  }
};

