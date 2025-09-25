import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { User } from '@/lib/types'

// GET /api/users - Get all users or search by wallet address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
        include: {
          memes: true,
          engagements: true,
        },
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }

      // Parse badges JSON
      const userWithParsedBadges = {
        ...user,
        badges: JSON.parse(user.badges || '[]'),
      }

      return NextResponse.json({ success: true, data: userWithParsedBadges })
    }

    const users = await prisma.user.findMany({
      include: {
        memes: true,
        engagements: true,
      },
      orderBy: { leaderboardRank: 'asc' },
    })

    // Parse badges for all users
    const usersWithParsedBadges = users.map(user => ({
      ...user,
      badges: JSON.parse(user.badges || '[]'),
    }))

    return NextResponse.json({ success: true, data: usersWithParsedBadges })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { farcasterId, walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        farcasterId,
        walletAddress,
        badges: JSON.stringify([]), // Start with empty badges array
      },
    })

    const userWithParsedBadges = {
      ...user,
      badges: [],
    }

    return NextResponse.json({ success: true, data: userWithParsedBadges }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

