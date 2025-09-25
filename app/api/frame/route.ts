import { NextRequest, NextResponse } from 'next/server'

// Frame metadata for Farcaster
export async function GET() {
  const frameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL || 'https://memecoin-mania.com'}/api/og`,
    'fc:frame:button:1': 'Create Meme',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': 'View Feed',
    'fc:frame:button:2:action': 'post',
    'fc:frame:button:3': 'Marketplace',
    'fc:frame:button:3:action': 'post',
    'fc:frame:button:4': 'Analytics',
    'fc:frame:button:4:action': 'post',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_APP_URL || 'https://memecoin-mania.com'}/api/frame`,
  }

  return new NextResponse(null, {
    status: 200,
    headers: frameMetadata,
  })
}

// Handle frame interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { untrustedData } = body

    if (!untrustedData) {
      return NextResponse.json({ error: 'Invalid frame data' }, { status: 400 })
    }

    const { buttonIndex, fid, messageHash } = untrustedData

    // Handle different button actions
    let redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://memecoin-mania.com'

    switch (buttonIndex) {
      case 1: // Create Meme
        redirectUrl += '/create'
        break
      case 2: // View Feed
        redirectUrl += '/'
        break
      case 3: // Marketplace
        redirectUrl += '/marketplace'
        break
      case 4: // Analytics
        redirectUrl += '/analytics'
        break
      default:
        redirectUrl += '/'
    }

    // Return frame response with redirect
    const frameResponse = {
      'fc:frame': 'vNext',
      'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL || 'https://memecoin-mania.com'}/api/og?action=${buttonIndex}`,
      'fc:frame:button:1': 'Open App',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': redirectUrl,
      'fc:frame:button:2': 'Back to Menu',
      'fc:frame:button:2:action': 'post',
    }

    return new NextResponse(null, {
      status: 200,
      headers: frameResponse,
    })
  } catch (error) {
    console.error('Frame interaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

