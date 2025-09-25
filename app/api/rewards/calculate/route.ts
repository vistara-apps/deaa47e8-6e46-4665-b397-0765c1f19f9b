import { NextRequest, NextResponse } from 'next/server';
import {
  rewardMemeCreation,
  rewardEngagement,
  rewardTrendingBonus,
  rewardDailyLogin,
  rewardFirstMeme,
  getUserEarnings
} from '@/lib/rewards';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, memeId, engagementType, content, creatorId } = body;

    if (!type || !userId) {
      return NextResponse.json({ error: 'Type and userId required' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'meme_creation':
        if (!memeId) {
          return NextResponse.json({ error: 'memeId required for meme creation reward' }, { status: 400 });
        }
        result = await rewardMemeCreation(userId, memeId);
        break;

      case 'engagement':
        if (!memeId || !engagementType || !creatorId) {
          return NextResponse.json({
            error: 'memeId, engagementType, and creatorId required for engagement reward'
          }, { status: 400 });
        }
        result = await rewardEngagement(userId, creatorId, memeId, engagementType, content);
        break;

      case 'trending_bonus':
        if (!memeId) {
          return NextResponse.json({ error: 'memeId required for trending bonus' }, { status: 400 });
        }
        result = await rewardTrendingBonus(userId, memeId);
        break;

      case 'daily_login':
        result = await rewardDailyLogin(userId);
        break;

      case 'first_meme':
        result = await rewardFirstMeme(userId);
        break;

      default:
        return NextResponse.json({ error: 'Invalid reward type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing reward:', error);
    return NextResponse.json(
      { error: 'Failed to process reward' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
    }

    const earnings = await getUserEarnings(userId);
    return NextResponse.json(earnings);
  } catch (error) {
    console.error('Error fetching user earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}

