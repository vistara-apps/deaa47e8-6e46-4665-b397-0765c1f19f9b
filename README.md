# MemeCoin Mania 🚀

**Create, Share, Earn: The Trending Meme Marketplace**

A Next.js Base Mini App that lets users create viral memes, earn MemeCoins, and trade in the ultimate meme economy.

## Features

### 🎨 Trending Meme Generator
- Quick meme creation with trending topics
- Professional meme templates
- Real-time trend analysis
- AI-powered suggestions

### 💰 MemeCoin Reward System
- Earn MemeCoins for creating memes (+10 MC)
- Get rewarded for engagement (+2 MC per upvote)
- Trending bonus (+50 MC)
- Daily login rewards (+5 MC)

### 🏪 Meme Marketplace
- Trade unique meme assets
- NFT minting for viral memes
- Rarity system (Common, Rare, Legendary)
- MemeCoins as native currency

### 📱 Social Feed & Engagement
- Dynamic trending feed
- Upvote, comment, and share system
- Real-time engagement tracking
- Leaderboard rankings

### 📊 Analytics Dashboard
- Trend insights and performance metrics
- Creator statistics
- Earning potential calculator
- Market analysis

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: OnchainKit integration
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **State Management**: React hooks

## Design System

### Colors
- **Cardinal**: `hsl(324, 93%, 48%)` - Primary brand color
- **Accent**: `hsl(204, 96%, 65%)` - Interactive elements
- **Background**: `hsl(204, 100%, 97%)` - Main background
- **Surface**: `hsl(0, 0%, 100%)` - Card backgrounds

### Typography
- **Display**: `text-4xl font-bold` - Headlines
- **Body**: `text-base font-normal leading-6` - Content

### Components
- **AppShell**: Main app container with navigation
- **MemeCard**: Display and compact variants
- **TokenBalanceDisplay**: MemeCoins balance
- **ActionButtons**: Engagement interactions

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Theme Support

MemeCoin Mania supports multiple blockchain themes:

- **Default**: Professional finance with meme energy
- **CELO**: Bold black and yellow
- **SOLANA**: Purple gradient vibes  
- **BASE**: Classic Base blue
- **COINBASE**: Navy corporate style

Access theme preview at `/theme-preview` or use URL parameter `?theme=celo`

## API Integration

### Farcaster Hub API
- Timeline data and user profiles
- Cast creation and social interactions
- Rate-limited read operations

### Base Chain Integration
- Low-fee MemeCoins transactions
- NFT minting for viral memes
- Wallet connection via OnchainKit

### Trend Analysis
- Real-time trending topic detection
- Keyword frequency analysis
- Category-based trend sorting

## User Flows

### Meme Creation
1. Select trending topic or keyword
2. Choose from professional templates
3. Customize text and styling
4. Submit and earn MemeCoins
5. Share on Farcaster network

### Marketplace Trading
1. Browse available meme assets
2. Filter by rarity and price
3. Purchase with MemeCoins
4. Mint as NFT (optional)
5. Trade with other users

## Rewards System

| Action | Reward |
|--------|--------|
| Create Meme | +10 MC |
| Receive Upvote | +2 MC |
| Receive Comment | +3 MC |
| Receive Share | +5 MC |
| Trending Bonus | +50 MC |
| Daily Login | +5 MC |
| First Meme | +25 MC |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Base ecosystem**
