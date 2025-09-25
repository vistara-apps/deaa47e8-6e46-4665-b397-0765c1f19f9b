import { NextRequest, NextResponse } from 'next/server';
import { generateMemeText, analyzeMemeVirality, generateTopicSuggestions } from '@/lib/ai';
import { getAllTrends } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, style, humor, length } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic required' }, { status: 400 });
    }

    const prompt = {
      topic,
      style: style || 'modern',
      humor: humor || 'light',
      length: length || 'medium',
    };

    const generatedMeme = await generateMemeText(prompt);

    if (!generatedMeme) {
      return NextResponse.json({ error: 'Failed to generate meme' }, { status: 500 });
    }

    // Analyze virality
    const viralityScore = await analyzeMemeVirality(generatedMeme.text);

    return NextResponse.json({
      success: true,
      meme: {
        ...generatedMeme,
        virality_score: viralityScore,
      },
    });
  } catch (error) {
    console.error('Error generating meme:', error);
    return NextResponse.json(
      { error: 'Failed to generate meme' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'suggestions') {
      // Get current trends for suggestions
      const trends = await getAllTrends();
      const currentTopics = trends.slice(0, 5).map(t => t.keyword);

      const suggestions = await generateTopicSuggestions(currentTopics);

      return NextResponse.json({
        suggestions,
        currentTrends: currentTopics,
      });
    }

    if (action === 'analyze') {
      const text = searchParams.get('text');
      if (!text) {
        return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
      }

      const score = await analyzeMemeVirality(text);
      return NextResponse.json({ viralityScore: score });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing meme request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

