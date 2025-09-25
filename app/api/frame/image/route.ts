import { NextRequest, NextResponse } from 'next/server';
import { getTrendingMemes, getUser, getUserMemes } from '@/lib/database';
import { getFarcasterUser } from '@/lib/farcaster';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'home';
    const fid = searchParams.get('fid');
    const topic = searchParams.get('topic');

    // Generate SVG image based on action
    let svgContent = '';

    switch (action) {
      case 'home':
        svgContent = generateHomeImage();
        break;
      case 'feed':
        svgContent = await generateFeedImage();
        break;
      case 'create':
        svgContent = generateCreateImage();
        break;
      case 'generate':
        svgContent = await generateMemePreviewImage(topic);
        break;
      case 'marketplace':
        svgContent = generateMarketplaceImage();
        break;
      case 'profile':
        svgContent = await generateProfileImage(fid);
        break;
      case 'mymemes':
        svgContent = await generateMyMemesImage(fid);
        break;
      case 'earnings':
        svgContent = await generateEarningsImage(fid);
        break;
      case 'top':
        svgContent = await generateTopMemesImage();
        break;
      default:
        svgContent = generateHomeImage();
    }

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error generating frame image:', error);
    return new NextResponse(generateErrorImage(), {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}

function generateHomeImage(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="600" cy="200" r="80" fill="#F59E0B"/>
      <text x="600" y="210" text-anchor="middle" fill="black" font-size="48" font-weight="bold">💎</text>
      <text x="600" y="320" text-anchor="middle" fill="white" font-size="48" font-weight="bold">MemeCoin Mania</text>
      <text x="600" y="370" text-anchor="middle" fill="white" font-size="24">Create • Share • Earn</text>
      <text x="600" y="420" text-anchor="middle" fill="#FEF3C7" font-size="18">The Trending Meme Marketplace on Base</text>
      <rect x="450" y="480" width="300" height="60" rx="30" fill="rgba(255,255,255,0.2)"/>
      <text x="600" y="520" text-anchor="middle" fill="white" font-size="20" font-weight="bold">Choose your action below</text>
    </svg>
  `;
}

async function generateFeedImage(): Promise<string> {
  try {
    const memes = await getTrendingMemes(3);

    let memeContent = '';
    memes.forEach((meme, index) => {
      const y = 200 + index * 120;
      memeContent += `
        <rect x="100" y="${y - 30}" width="1000" height="80" rx="10" fill="rgba(255,255,255,0.1)"/>
        <text x="120" y="${y}" fill="white" font-size="16" font-weight="bold">${meme.textPrompt.substring(0, 60)}${meme.textPrompt.length > 60 ? '...' : ''}</text>
        <text x="120" y="${y + 25}" fill="#CBD5E1" font-size="14">👍 ${meme.upvotes} • 🔄 ${meme.shares} • 💬 ${meme.comments}</text>
      `;
    });

    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1E293B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <text x="600" y="80" text-anchor="middle" fill="white" font-size="36" font-weight="bold">🔥 Trending Memes</text>
        <text x="600" y="120" text-anchor="middle" fill="#CBD5E1" font-size="18">Latest viral content from the community</text>
        ${memeContent}
        <text x="600" y="580" text-anchor="middle" fill="#94A3B8" font-size="16">Refresh to see new memes</text>
      </svg>
    `;
  } catch (error) {
    return generateErrorImage();
  }
}

function generateCreateImage(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EA580C;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="600" cy="200" r="80" fill="#FCD34D"/>
      <text x="600" y="210" text-anchor="middle" fill="black" font-size="48" font-weight="bold">🎨</text>
      <text x="600" y="320" text-anchor="middle" fill="white" font-size="42" font-weight="bold">Create Your Meme</text>
      <text x="600" y="370" text-anchor="middle" fill="white" font-size="24">Turn trending topics into viral content</text>
      <rect x="400" y="420" width="400" height="50" rx="25" fill="rgba(255,255,255,0.9)"/>
      <text x="600" y="450" text-anchor="middle" fill="#374151" font-size="18">Enter a trending topic below...</text>
      <text x="600" y="520" text-anchor="middle" fill="#FEF3C7" font-size="16">💎 Earn MemeCoins for every creation!</text>
    </svg>
  `;
}

async function generateMemePreviewImage(topic?: string | null): Promise<string> {
  const previewText = topic ? `Generated meme about: ${topic}` : 'Your meme preview will appear here';

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect x="200" y="150" width="800" height="330" rx="20" fill="rgba(255,255,255,0.95)"/>
      <text x="600" y="200" text-anchor="middle" fill="#1F2937" font-size="24" font-weight="bold">🎭 AI Generated Meme</text>
      <text x="600" y="250" text-anchor="middle" fill="#374151" font-size="20">${previewText}</text>
      <text x="600" y="320" text-anchor="middle" fill="#6B7280" font-size="16">Virality Score: Calculating...</text>
      <text x="600" y="360" text-anchor="middle" fill="#059669" font-size="18">✅ Ready to post!</text>
      <text x="600" y="420" text-anchor="middle" fill="#FEF3C7" font-size="16">Share on Farcaster to earn rewards</text>
    </svg>
  `;
}

function generateMarketplaceImage(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0D9488;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="600" cy="180" r="70" fill="#F59E0B"/>
      <text x="600" y="195" text-anchor="middle" fill="black" font-size="40" font-weight="bold">🏪</text>
      <text x="600" y="290" text-anchor="middle" fill="white" font-size="40" font-weight="bold">Meme Marketplace</text>
      <text x="600" y="340" text-anchor="middle" fill="white" font-size="22">Buy & Sell Unique Meme Assets</text>

      <rect x="300" y="400" width="180" height="120" rx="15" fill="rgba(255,255,255,0.2)"/>
      <text x="390" y="430" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Rare NFT</text>
      <text x="390" y="455" text-anchor="middle" fill="#FEF3C7" font-size="14">500 MEME</text>

      <rect x="510" y="400" width="180" height="120" rx="15" fill="rgba(255,255,255,0.2)"/>
      <text x="600" y="430" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Viral Meme</text>
      <text x="600" y="455" text-anchor="middle" fill="#FEF3C7" font-size="14">250 MEME</text>

      <rect x="720" y="400" width="180" height="120" rx="15" fill="rgba(255,255,255,0.2)"/>
      <text x="810" y="430" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Legendary</text>
      <text x="810" y="455" text-anchor="middle" fill="#FEF3C7" font-size="14">1000 MEME</text>

      <text x="600" y="570" text-anchor="middle" fill="#ECFEFF" font-size="16">Trade memes and earn from your creativity!</text>
    </svg>
  `;
}

async function generateProfileImage(fid?: string | null): Promise<string> {
  if (!fid) {
    return generateErrorImage();
  }

  try {
    const user = await getUser(fid);
    const farcasterUser = await getFarcasterUser(parseInt(fid));

    const displayName = farcasterUser?.displayName || user?.displayName || 'Anonymous';
    const balance = user?.memeCoinBalance || 0;
    const badges = user?.badges?.length || 0;

    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <circle cx="600" cy="180" r="80" fill="#E5E7EB"/>
        <text x="600" y="195" text-anchor="middle" fill="#374151" font-size="48" font-weight="bold">👤</text>
        <text x="600" y="290" text-anchor="middle" fill="white" font-size="36" font-weight="bold">${displayName}</text>
        <text x="600" y="340" text-anchor="middle" fill="#BFDBFE" font-size="20">FID: ${fid}</text>

        <rect x="450" y="380" width="300" height="80" rx="15" fill="rgba(255,255,255,0.2)"/>
        <text x="600" y="410" text-anchor="middle" fill="white" font-size="18" font-weight="bold">💎 ${balance} MemeCoins</text>
        <text x="600" y="435" text-anchor="middle" fill="#DBEAFE" font-size="14">${badges} Badges Earned</text>

        <text x="600" y="520" text-anchor="middle" fill="#EFF6FF" font-size="16">View your memes and earnings</text>
      </svg>
    `;
  } catch (error) {
    return generateErrorImage();
  }
}

async function generateMyMemesImage(fid?: string | null): Promise<string> {
  if (!fid) {
    return generateErrorImage();
  }

  try {
    const memes = await getUserMemes(fid);
    const count = memes.length;

    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#A855F7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <circle cx="600" cy="180" r="70" fill="#FCD34D"/>
        <text x="600" y="195" text-anchor="middle" fill="black" font-size="40" font-weight="bold">🎭</text>
        <text x="600" y="290" text-anchor="middle" fill="white" font-size="36" font-weight="bold">My Memes</text>
        <text x="600" y="340" text-anchor="middle" fill="#E9D5FF" font-size="24">${count} Memes Created</text>

        <rect x="400" y="400" width="400" height="60" rx="30" fill="rgba(255,255,255,0.2)"/>
        <text x="600" y="440" text-anchor="middle" fill="white" font-size="18">Total Engagement: ${memes.reduce((sum, m) => sum + m.upvotes + m.shares + m.comments, 0)}</text>

        <text x="600" y="520" text-anchor="middle" fill="#F3E8FF" font-size="16">Keep creating to earn more rewards!</text>
      </svg>
    `;
  } catch (error) {
    return generateErrorImage();
  }
}

async function generateEarningsImage(fid?: string | null): Promise<string> {
  if (!fid) {
    return generateErrorImage();
  }

  try {
    const user = await getUser(fid);
    const balance = user?.memeCoinBalance || 0;

    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <circle cx="600" cy="180" r="80" fill="#F59E0B"/>
        <text x="600" y="195" text-anchor="middle" fill="black" font-size="48" font-weight="bold">💰</text>
        <text x="600" y="290" text-anchor="middle" fill="white" font-size="36" font-weight="bold">Your Earnings</text>

        <rect x="450" y="340" width="300" height="100" rx="20" fill="rgba(255,255,255,0.2)"/>
        <text x="600" y="375" text-anchor="middle" fill="white" font-size="24" font-weight="bold">💎 ${balance} MemeCoins</text>
        <text x="600" y="405" text-anchor="middle" fill="#A7F3D0" font-size="16">Keep engaging to earn more!</text>

        <text x="600" y="480" text-anchor="middle" fill="#D1FAE5" font-size="16">• Create memes: +10 coins</text>
        <text x="600" y="510" text-anchor="middle" fill="#D1FAE5" font-size="16">• Get upvotes: +2 coins each</text>
        <text x="600" y="540" text-anchor="middle" fill="#D1FAE5" font-size="16">• Viral bonuses available!</text>
      </svg>
    `;
  } catch (error) {
    return generateErrorImage();
  }
}

async function generateTopMemesImage(): Promise<string> {
  try {
    const memes = await getTrendingMemes(5);

    let content = '';
    memes.forEach((meme, index) => {
      const y = 180 + index * 70;
      const medal = ['🥇', '🥈', '🥉'][index] || '🏅';
      content += `
        <text x="150" y="${y + 10}" fill="white" font-size="24">${medal}</text>
        <text x="200" y="${y}" fill="white" font-size="16" font-weight="bold">${meme.textPrompt.substring(0, 50)}${meme.textPrompt.length > 50 ? '...' : ''}</text>
        <text x="200" y="${y + 20}" fill="#CBD5E1" font-size="14">Score: ${meme.upvotes + meme.shares + meme.comments}</text>
      `;
    });

    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#B91C1C;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <text x="600" y="80" text-anchor="middle" fill="white" font-size="36" font-weight="bold">🏆 Top Trending Memes</text>
        <text x="600" y="120" text-anchor="middle" fill="#FCA5A5" font-size="18">The most viral content this week</text>
        ${content}
      </svg>
    `;
  } catch (error) {
    return generateErrorImage();
  }
}

function generateErrorImage(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#1F2937"/>
      <circle cx="600" cy="250" r="80" fill="#EF4444"/>
      <text x="600" y="265" text-anchor="middle" fill="white" font-size="48" font-weight="bold">⚠️</text>
      <text x="600" y="360" text-anchor="middle" fill="white" font-size="32" font-weight="bold">Something went wrong</text>
      <text x="600" y="400" text-anchor="middle" fill="#9CA3AF" font-size="18">Please try again later</text>
    </svg>
  `;
}

