import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  const title = action
    ? `MemeCoin Mania - ${action === '1' ? 'Create' : action === '2' ? 'Feed' : action === '3' ? 'Marketplace' : 'Analytics'}`
    : 'MemeCoin Mania - Create, Share, Earn'

  const description = action
    ? `Navigate to ${action === '1' ? 'meme creation' : action === '2' ? 'social feed' : action === '3' ? 'NFT marketplace' : 'analytics dashboard'}`
    : 'The trending meme marketplace on Base. Create viral memes, earn MemeCoins, and trade NFTs.'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 16,
            padding: 40,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: 16,
            }}
          >
            🎭 MemeCoin Mania
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#6b7280',
              marginBottom: 24,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#4b5563',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 24,
              fontSize: 16,
              color: '#7c3aed',
            }}
          >
            <span style={{ marginRight: 8 }}>💰</span>
            Create • Share • Earn
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

