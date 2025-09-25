import { NextRequest, NextResponse } from 'next/server';
import { publishCast, searchCasts } from '@/lib/farcaster';
import { createMeme } from '@/lib/database';
import { Meme } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    const casts = await searchCasts(query, limit);
    return NextResponse.json({ casts });
  } catch (error) {
    console.error('Error searching casts:', error);
    return NextResponse.json(
      { error: 'Failed to search casts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signerUuid, text, embeds, userId, memeData } = body;

    if (!signerUuid || !text) {
      return NextResponse.json({ error: 'Signer UUID and text required' }, { status: 400 });
    }

    // Publish cast to Farcaster
    const castHash = await publishCast(signerUuid, text, embeds);

    if (!castHash) {
      return NextResponse.json({ error: 'Failed to publish cast' }, { status: 500 });
    }

    // If this is a meme creation, save to our database
    if (memeData && userId) {
      const meme: Meme = {
        memeId: castHash,
        creatorId: userId,
        imageUrl: memeData.imageUrl || '',
        textPrompt: text,
        topic: memeData.topic || 'general',
        upvotes: 0,
        shares: 0,
        comments: 0,
        creationTimestamp: Date.now(),
        mintedAsNft: memeData.mintedAsNft || false,
        trending: false,
      };

      await createMeme(meme);
    }

    return NextResponse.json({
      success: true,
      castHash,
      message: 'Cast published successfully'
    });
  } catch (error) {
    console.error('Error publishing cast:', error);
    return NextResponse.json(
      { error: 'Failed to publish cast' },
      { status: 500 }
    );
  }
}

