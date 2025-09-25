# MemeCoin Mania

🎭 **Create, Share, Earn: The Trending Meme Marketplace on Base**

A decentralized platform built on Base where users can create viral memes, earn MemeCoins through engagement, and trade meme assets in a marketplace.

## 🚀 Features

### Core Functionality
- **Meme Creation**: AI-powered meme generator with trending topic suggestions
- **Social Feed**: Dynamic feed with upvoting, commenting, and sharing
- **MemeCoin Rewards**: Earn tokens for creating and engaging with content
- **NFT Marketplace**: Buy and sell unique meme assets
- **Analytics Dashboard**: Track performance and trending insights

### Technical Features
- **Base Mini App**: Optimized for Farcaster frames
- **Web3 Integration**: Wallet connection and on-chain transactions
- **Real-time Updates**: Live trending data and engagement metrics
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Web3**: Wagmi, Viem, Base SDK
- **Backend**: Next.js API routes
- **Database**: In-memory data store (production-ready for database integration)
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/vistara-apps/deaa47e8-6e46-4665-b397-0765c1f19f9b.git
cd memecoin-mania
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Web3 Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# API Keys (for production)
FARCASTER_HUB_API_KEY=your_farcaster_api_key
TREND_ANALYSIS_API_KEY=your_trend_api_key
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── frame/         # Farcaster frame endpoints
│   │   ├── og/           # Open Graph image generation
│   │   └── placeholder/   # Image placeholder API
│   ├── create/           # Meme creation page
│   ├── marketplace/      # NFT marketplace page
│   ├── analytics/        # Analytics dashboard
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # UI components (buttons, cards, etc.)
│   ├── AppShell.tsx     # Main app layout
│   ├── SocialFeed.tsx   # Social feed component
│   ├── MemeCard.tsx     # Meme display component
│   └── ErrorBoundary.tsx # Error handling
├── lib/                 # Utility libraries
│   ├── models.ts        # Data models and mock data
│   ├── types.ts         # TypeScript type definitions
│   ├── wallet.ts        # Web3 wallet utilities
│   ├── contracts.ts     # Smart contract interactions
│   ├── trends.ts        # Trend analysis utilities
│   ├── rewards.ts       # Reward system logic
│   ├── marketplace.ts   # Marketplace utilities
│   └── analytics.ts     # Analytics utilities
└── public/              # Static assets
```

## 🎯 Usage

### Creating Memes
1. Navigate to the Create page
2. Choose a trending topic or enter a custom keyword
3. Write your meme text/prompt
4. Click "Generate Meme" to create AI-powered content
5. Publish to earn MemeCoins

### Engaging with Content
1. Browse the social feed
2. Upvote, comment, or share memes you enjoy
3. Earn MemeCoins for engagement

### Trading in Marketplace
1. Visit the Marketplace page
2. Browse available meme NFTs
3. Purchase or list your own memes for sale

### Analytics
1. Access the Analytics dashboard
2. View your performance metrics
3. Track trending topics and engagement patterns

## 🔗 API Documentation

### Frame Integration
- `GET /api/frame` - Farcaster frame metadata
- `POST /api/frame` - Handle frame interactions

### OG Images
- `GET /api/og` - Generate Open Graph images

### Placeholder Images
- `GET /api/placeholder/[width]/[height]/[text]` - Generate placeholder images

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Web3 integration via [Wagmi](https://wagmi.sh/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Made with ❤️ for the Base ecosystem**

