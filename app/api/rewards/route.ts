import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { RewardCalculation } from '@/lib/types'

// POST /api/rewards/calculate - Calculate rewards for a meme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memeId } = body

    if (!memeId) {
      return NextResponse.json({
        success: false,
        error: 'memeId is required'
      }, { status: 400 })
    }

    const meme = await prisma.meme.findUnique({
      where: { memeId },
      include: {
        engagements: true,
      },
    })

    if (!meme) {
      return NextResponse.json({
        success: false,
        error: 'Meme not found'
      }, { status: 404 })
    }

    // Calculate rewards based on engagements and time
    const upvotes = meme.engagements.filter(e => e.type === 'upvote').length
    const shares = meme.engagements.filter(e => e.type === 'share').length
    const comments = meme.engagements.filter(e => e.type === 'comment').length

    // Base reward calculation
    const baseReward = 1.0
    const upvoteMultiplier = Math.min(upvotes * 0.1, 2.0) // Max 2x for upvotes
    const shareMultiplier = shares * 0.5 // 0.5 per share
    const commentMultiplier = comments * 0.2 // 0.2 per comment

    // Time decay (newer memes get more)
    const hoursSinceCreation = (Date.now() - meme.creationTimestamp.getTime()) / (1000 * 60 * 60)
    const timeMultiplier = Math.max(0.1, 1 - (hoursSinceCreation / 24)) // Decay over 24 hours

    // Trend bonus (simplified - in real app would check trend data)
    const trendBonus = meme.topic ? 0.5 : 0 // Bonus if topic matches trending

    const totalReward = baseReward * (1 + upvoteMultiplier + shareMultiplier + commentMultiplier) * timeMultiplier + trendBonus

    const rewardCalculation: RewardCalculation = {
      memeId,
      baseReward,
      viralityMultiplier: upvoteMultiplier + shareMultiplier + commentMultiplier,
      trendBonus,
      totalReward: Math.round(totalReward * 100) / 100, // Round to 2 decimal places
    }

    // Update creator's balance
    await prisma.user.update({
      where: { userId: meme.creatorId },
      data: {
        memeCoinBalance: {
          increment: rewardCalculation.totalReward,
        },
      },
    })

    return NextResponse.json({ success: true, data: rewardCalculation })
  } catch (error) {
    console.error('Error calculating rewards:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

