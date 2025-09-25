import { NextRequest, NextResponse } from 'next/server';
import { getTrendingTopics, searchCasts } from '@/lib/farcaster';
import { getAllTrends, createTrend, updateTrend } from '@/lib/database';
import { Trend } from '@/lib/types';

const TREND_CATEGORIES = ['crypto', 'tech', 'culture', 'finance', 'general'] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get trends from database
    let trends = await getAllTrends();

    // Filter by category if specified
    if (category && TREND_CATEGORIES.includes(category as any)) {
      trends = trends.filter(trend => trend.category === category);
    }

    // Sort by frequency and limit
    trends = trends
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);

    // If we have few trends, try to get fresh ones from Farcaster
    if (trends.length < 5) {
      try {
        const farcasterTopics = await getTrendingTopics();

        // Create trend objects for new topics
        const now = Date.now();
        for (const topic of farcasterTopics.slice(0, 10)) {
          const existingTrend = trends.find(t => t.keyword.toLowerCase() === topic.toLowerCase());
          if (!existingTrend) {
            const newTrend: Trend = {
              trendId: `trend_${topic}_${now}`,
              keyword: topic,
              frequency: Math.floor(Math.random() * 50) + 10, // Mock frequency
              lastUpdated: now,
              category: 'general', // Could be improved with categorization
            };

            await createTrend(newTrend);
            trends.push(newTrend);
          }
        }
      } catch (error) {
        console.error('Error fetching Farcaster trends:', error);
      }
    }

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, category, frequency } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
    }

    // Validate category
    if (category && !TREND_CATEGORIES.includes(category as any)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const trendId = `trend_${keyword}_${Date.now()}`;
    const trend: Trend = {
      trendId,
      keyword,
      frequency: frequency || 1,
      lastUpdated: Date.now(),
      category: category || 'general',
    };

    await createTrend(trend);

    return NextResponse.json({
      success: true,
      trend,
      message: 'Trend created successfully'
    });
  } catch (error) {
    console.error('Error creating trend:', error);
    return NextResponse.json(
      { error: 'Failed to create trend' },
      { status: 500 }
    );
  }
}

// Update trend frequencies based on real-time data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { trendId, frequency } = body;

    if (!trendId || frequency === undefined) {
      return NextResponse.json({ error: 'trendId and frequency required' }, { status: 400 });
    }

    await updateTrend(trendId, {
      frequency,
      lastUpdated: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Trend updated successfully'
    });
  } catch (error) {
    console.error('Error updating trend:', error);
    return NextResponse.json(
      { error: 'Failed to update trend' },
      { status: 500 }
    );
  }
}

