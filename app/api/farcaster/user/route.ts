import { NextRequest, NextResponse } from 'next/server';
import { getFarcasterUser, getUserCasts } from '@/lib/farcaster';
import { getUser, createUser, updateUser } from '@/lib/database';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json({ error: 'FID parameter required' }, { status: 400 });
    }

    const fidNum = parseInt(fid);
    if (isNaN(fidNum)) {
      return NextResponse.json({ error: 'Invalid FID' }, { status: 400 });
    }

    // Get Farcaster user data
    const farcasterUser = await getFarcasterUser(fidNum);
    if (!farcasterUser) {
      return NextResponse.json({ error: 'User not found on Farcaster' }, { status: 404 });
    }

    // Check if user exists in our database
    let user = await getUser(fid.toString());

    if (!user) {
      // Create new user
      user = {
        userId: fid,
        farcasterId: farcasterUser.username,
        displayName: farcasterUser.displayName,
        avatar: farcasterUser.pfp,
        memeCoinBalance: 0,
        badges: [],
        leaderboardRank: 0,
      };
      await createUser(user);
    }

    // Get user's recent casts
    const casts = await getUserCasts(fidNum, 5);

    return NextResponse.json({
      user,
      farcasterUser,
      recentCasts: casts,
    });
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, displayName, avatar } = body;

    if (!fid) {
      return NextResponse.json({ error: 'FID required' }, { status: 400 });
    }

    // Get existing user or create new one
    let user = await getUser(fid.toString());

    if (!user) {
      user = {
        userId: fid,
        farcasterId: body.farcasterId,
        displayName: displayName || 'Anonymous',
        avatar: avatar || '/api/placeholder/80/80',
        memeCoinBalance: 0,
        badges: [],
        leaderboardRank: 0,
      };
      await createUser(user);
    } else {
      // Update user info
      const updates: Partial<User> = {};
      if (displayName) updates.displayName = displayName;
      if (avatar) updates.avatar = avatar;
      await updateUser(fid.toString(), updates);
      user = { ...user, ...updates };
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

