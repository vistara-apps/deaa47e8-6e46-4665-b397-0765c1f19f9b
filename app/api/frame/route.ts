import { NextRequest, NextResponse } from 'next/server';
import { getTrendingMemes, getUser } from '@/lib/database';
import { getFarcasterUser } from '@/lib/farcaster';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const action = searchParams.get('action') || 'home';

    // Frame metadata for different views
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const frames = {
      home: {
        version: 'next',
        image: `${baseUrl}/api/frame/image?action=home`,
        buttons: [
          {
            label: 'View Feed',
            action: 'post',
            target: `${baseUrl}/api/frame?action=feed`,
          },
          {
            label: 'Create Meme',
            action: 'post',
            target: `${baseUrl}/api/frame?action=create`,
          },
          {
            label: 'Marketplace',
            action: 'post',
            target: `${baseUrl}/api/frame?action=marketplace`,
          },
          {
            label: 'My Profile',
            action: 'post',
            target: `${baseUrl}/api/frame?action=profile&fid=${fid}`,
          },
        ],
      },
      feed: {
        version: 'next',
        image: `${baseUrl}/api/frame/image?action=feed`,
        buttons: [
          {
            label: '🔄 Refresh',
            action: 'post',
            target: `${baseUrl}/api/frame?action=feed`,
          },
          {
            label: 'Create Meme',
            action: 'post',
            target: `${baseUrl}/api/frame?action=create`,
          },
          {
            label: 'Top Memes',
            action: 'post',
            target: `${baseUrl}/api/frame?action=top`,
          },
          {
            label: 'Back',
            action: 'post',
            target: `${baseUrl}/api/frame`,
          },
        ],
      },
      create: {
        version: 'next',
        image: `${baseUrl}/api/frame/image?action=create`,
        input: {
          text: 'Enter a trending topic...',
        },
        buttons: [
          {
            label: 'Generate Meme',
            action: 'post',
            target: `${baseUrl}/api/frame?action=generate`,
          },
          {
            label: 'Back',
            action: 'post',
            target: `${baseUrl}/api/frame`,
          },
        ],
      },
      marketplace: {
        version: 'next',
        image: `${baseUrl}/api/frame/image?action=marketplace`,
        buttons: [
          {
            label: 'Browse Items',
            action: 'post',
            target: `${baseUrl}/api/frame?action=browse`,
          },
          {
            label: 'List Item',
            action: 'post',
            target: `${baseUrl}/api/frame?action=list`,
          },
          {
            label: 'Back',
            action: 'post',
            target: `${baseUrl}/api/frame`,
          },
        ],
      },
      profile: {
        version: 'next',
        image: `${baseUrl}/api/frame/image?action=profile&fid=${fid}`,
        buttons: [
          {
            label: 'My Memes',
            action: 'post',
            target: `${baseUrl}/api/frame?action=mymemes&fid=${fid}`,
          },
          {
            label: 'Earnings',
            action: 'post',
            target: `${baseUrl}/api/frame?action=earnings&fid=${fid}`,
          },
          {
            label: 'Back',
            action: 'post',
            target: `${baseUrl}/api/frame`,
          },
        ],
      },
    };

    const frameData = frames[action as keyof typeof frames] || frames.home;

    return NextResponse.json(frameData);
  } catch (error) {
    console.error('Error generating frame:', error);
    return NextResponse.json(
      { error: 'Failed to generate frame' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    if (!untrustedData) {
      return NextResponse.json({ error: 'Invalid frame data' }, { status: 400 });
    }

    const { fid, buttonIndex, inputText } = untrustedData;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Handle different button actions
    let redirectUrl = `${baseUrl}`;

    switch (buttonIndex) {
      case 1: // View Feed
        redirectUrl = `${baseUrl}/api/frame?action=feed`;
        break;
      case 2: // Create Meme
        redirectUrl = `${baseUrl}/api/frame?action=create`;
        break;
      case 3: // Marketplace
        redirectUrl = `${baseUrl}/api/frame?action=marketplace`;
        break;
      case 4: // Profile
        redirectUrl = `${baseUrl}/api/frame?action=profile&fid=${fid}`;
        break;
      default:
        redirectUrl = `${baseUrl}/api/frame`;
    }

    // Handle input text for meme generation
    if (inputText && buttonIndex === 1) { // Generate Meme button
      // Store the input for the next frame
      // In a real implementation, you'd use a temporary store
      redirectUrl = `${baseUrl}/api/frame?action=generate&topic=${encodeURIComponent(inputText)}&fid=${fid}`;
    }

    return NextResponse.json({
      type: 'redirect',
      location: redirectUrl,
    });
  } catch (error) {
    console.error('Error processing frame action:', error);
    return NextResponse.json(
      { error: 'Failed to process frame action' },
      { status: 500 }
    );
  }
}

