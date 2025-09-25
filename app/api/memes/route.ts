import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Meme } from '@/lib/types'

// GET /api/memes - Get all memes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creatorId')
    const topic = searchParams.get('topic')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (creatorId) where.creatorId = creatorId
    if (topic) where.topic = topic

    const memes = await prisma.meme.findMany({
      where,
      include: {
        creator: true,
        engagements: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { creationTimestamp: 'desc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ success: true, data: memes })
  } catch (error) {
    console.error('Error fetching memes:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/memes - Create a new meme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creatorId, imageUrl, textPrompt, topic } = body

    if (!creatorId || !imageUrl || !textPrompt || !topic) {
      return NextResponse.json({
        success: false,
        error: 'creatorId, imageUrl, textPrompt, and topic are required'
      }, { status: 400 })
    }

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { userId: creatorId },
    })

    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 })
    }

    const meme = await prisma.meme.create({
      data: {
        creatorId,
        imageUrl,
        textPrompt,
        topic,
      },
      include: {
        creator: true,
      },
    })

    return NextResponse.json({ success: true, data: meme }, { status: 201 })
  } catch (error) {
    console.error('Error creating meme:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

