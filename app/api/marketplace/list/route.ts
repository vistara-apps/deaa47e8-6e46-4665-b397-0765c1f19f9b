import { NextRequest, NextResponse } from 'next/server';
import { createMarketplaceItem, getListedItems, updateMarketplaceItem, deleteMarketplaceItem } from '@/lib/database';
import { MarketplaceItem } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const rarity = searchParams.get('rarity');
    const currency = searchParams.get('currency');
    const limit = parseInt(searchParams.get('limit') || '50');

    let items = await getListedItems();

    // Apply filters
    if (sellerId) {
      items = items.filter(item => item.sellerId === sellerId);
    }

    if (rarity) {
      items = items.filter(item => item.rarity === rarity);
    }

    if (currency) {
      items = items.filter(item => item.currency === currency);
    }

    // Sort by listing date (newest first) and limit
    items = items
      .sort((a, b) => b.listed - a.listed)
      .slice(0, limit);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memeId, sellerId, price, currency, isNft, rarity } = body;

    if (!memeId || !sellerId || !price) {
      return NextResponse.json({
        error: 'memeId, sellerId, and price required'
      }, { status: 400 });
    }

    const item: MarketplaceItem = {
      id: `marketplace_${memeId}_${Date.now()}`,
      memeId,
      sellerId,
      price: parseFloat(price),
      currency: currency || 'MEMECOIN',
      isNft: isNft || false,
      rarity: rarity || 'common',
      listed: Date.now(),
    };

    await createMarketplaceItem(item);

    return NextResponse.json({
      success: true,
      item,
      message: 'Item listed successfully'
    });
  } catch (error) {
    console.error('Error listing marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to list item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, price, listed } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'itemId required' }, { status: 400 });
    }

    const updates: Partial<MarketplaceItem> = {};
    if (price !== undefined) updates.price = parseFloat(price);
    if (listed !== undefined) updates.listed = listed;

    await updateMarketplaceItem(itemId, updates);

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'itemId parameter required' }, { status: 400 });
    }

    await deleteMarketplaceItem(itemId);

    return NextResponse.json({
      success: true,
      message: 'Item delisted successfully'
    });
  } catch (error) {
    console.error('Error delisting marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to delist item' },
      { status: 500 }
    );
  }
}

