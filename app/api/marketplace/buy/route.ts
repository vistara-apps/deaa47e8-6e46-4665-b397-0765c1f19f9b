import { NextRequest, NextResponse } from 'next/server';
import { getMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem } from '@/lib/database';
import { getUser, updateUser } from '@/lib/database';
import { burnForTransaction } from '@/lib/blockchain';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, buyerId } = body;

    if (!itemId || !buyerId) {
      return NextResponse.json({ error: 'itemId and buyerId required' }, { status: 400 });
    }

    // Get the marketplace item
    const item = await getMarketplaceItem(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (!item.listed) {
      return NextResponse.json({ error: 'Item is not listed for sale' }, { status: 400 });
    }

    // Get buyer and seller
    const buyer = await getUser(buyerId);
    const seller = await getUser(item.sellerId);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Check if buyer has enough balance
    if (buyer.memeCoinBalance < item.price) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Prevent buying own items
    if (buyerId === item.sellerId) {
      return NextResponse.json({ error: 'Cannot buy your own items' }, { status: 400 });
    }

    // Process the transaction
    const newBuyerBalance = buyer.memeCoinBalance - item.price;
    const newSellerBalance = seller.memeCoinBalance + item.price;

    // Update balances in database
    await updateUser(buyerId, { memeCoinBalance: newBuyerBalance });
    await updateUser(item.sellerId, { memeCoinBalance: newSellerBalance });

    // Try blockchain transaction if configured
    try {
      if (buyer.walletAddress && item.currency === 'MEMECOIN') {
        await burnForTransaction(buyer.walletAddress, item.price.toString());
      }
    } catch (blockchainError) {
      console.warn('Blockchain transaction failed, using database only:', blockchainError);
    }

    // Remove item from marketplace
    await deleteMarketplaceItem(itemId);

    return NextResponse.json({
      success: true,
      transaction: {
        itemId,
        buyerId,
        sellerId: item.sellerId,
        price: item.price,
        currency: item.currency,
        timestamp: Date.now(),
      },
      message: 'Purchase completed successfully'
    });
  } catch (error) {
    console.error('Error processing marketplace purchase:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}

