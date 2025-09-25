import { NextRequest, NextResponse } from 'next/server';
import { rewardUser, rewardMultipleUsers, burnForTransaction, getMemeCoinBalance, canUserBeRewarded } from '@/lib/blockchain';
import { updateUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userAddress, amount, reason, userAddresses } = body;

    if (!action || !userAddress) {
      return NextResponse.json({ error: 'Action and userAddress required' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'reward':
        if (!reason) {
          return NextResponse.json({ error: 'Reason required for reward' }, { status: 400 });
        }

        // Check if user can be rewarded
        const canReward = await canUserBeRewarded(userAddress);
        if (!canReward) {
          return NextResponse.json({ error: 'User is on reward cooldown' }, { status: 429 });
        }

        result = await rewardUser(userAddress, reason);
        break;

      case 'reward_multiple':
        if (!userAddresses || !Array.isArray(userAddresses) || !reason) {
          return NextResponse.json({ error: 'userAddresses array and reason required' }, { status: 400 });
        }

        result = await rewardMultipleUsers(userAddresses, reason);
        break;

      case 'burn':
        if (!amount) {
          return NextResponse.json({ error: 'Amount required for burn' }, { status: 400 });
        }

        result = await burnForTransaction(userAddress, amount);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Update user's balance in our database
    if (action === 'reward' || action === 'burn') {
      const newBalance = await getMemeCoinBalance(userAddress);
      await updateUser(userAddress, { memeCoinBalance: parseFloat(newBalance) });
    }

    return NextResponse.json({
      success: true,
      transactionHash: result.hash,
      message: `${action} transaction completed successfully`
    });
  } catch (error) {
    console.error('Error processing blockchain transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter required' }, { status: 400 });
    }

    const balance = await getMemeCoinBalance(address);
    const canReward = await canUserBeRewarded(address);

    return NextResponse.json({
      address,
      balance,
      canBeRewarded: canReward,
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}

