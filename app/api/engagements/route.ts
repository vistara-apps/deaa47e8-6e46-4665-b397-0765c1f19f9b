import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Engagement } from '@/lib/types'

// GET /api/engagements - Get engagements with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memeId = searchParams.get('memeId')
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    const where: any = {}
    if (memeId) where.memeId = memeId
    if (userId) where.userId = userId
    if (type) where.type = type

    const engagements = await prisma.engagement.findMany({
      where,
      include: {
        user: true,
        meme: true,
      },
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({ success: true, data: engagements })
  } catch (error) {
    console.error('Error fetching engagements:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/engagements - Create a new engagement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, memeId, type, commentText } = body

    if (!userId || !memeId || !type) {
      return NextResponse.json({
        success: false,
        error: 'userId, memeId, and type are required'
      }, { status: 400 })
    }

    if (!['upvote', 'comment', 'share'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Type must be upvote, comment, or share'
      }, { status: 400 })
    }

    if (type === 'comment' && !commentText) {
      return NextResponse.json({
        success: false,
        error: 'commentText is required for comment type'
      }, { status: 400 })
    }

    // Verify user and meme exist
    const user = await prisma.user.findUnique({ where: { userId } })
    const meme = await prisma.meme.findUnique({ where: { memeId } })

    if (!user || !meme) {
      return NextResponse.json({
        success: false,
        error: 'User or meme not found'
      }, { status: 404 })
    }

    // Check if engagement already exists for upvote/share
    if (type !== 'comment') {
      const existingEngagement = await prisma.engagement.findFirst({
        where: { userId, memeId, type },
      })

      if (existingEngagement) {
        return NextResponse.json({
          success: false,
          error: 'Engagement already exists'
        }, { status: 409 })
      }
    }

    const engagement = await prisma.engagement.create({
      data: {
        userId,
        memeId,
        type,
        commentText: type === 'comment' ? commentText : null,
      },
      include: {
        user: true,
        meme: true,
      },
    })

    // Update meme stats
    if (type === 'upvote') {
      await prisma.meme.update({
        where: { memeId },
        data: { upvotes: { increment: 1 } },
      })
    } else if (type === 'share') {
      await prisma.meme.update({
        where: { memeId },
        data: { shares: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true, data: engagement }, { status: 201 })
  } catch (error) {
    console.error('Error creating engagement:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

