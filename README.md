# MemeCoin Mania

Create, Share, Earn: The Trending Meme Marketplace on Base

## Overview

MemeCoin Mania is a decentralized platform built on Base where users can create, share, and trade memes while earning MemeCoins through community engagement. The platform leverages Farcaster for social features and Base blockchain for token transactions.

## Features

### Core Features
- **Trending Meme Generator**: Create memes around trending topics with AI-powered prompts
- **MemeCoin Reward System**: Earn tokens based on virality and community engagement
- **Meme Marketplace**: Buy and sell unique meme assets and NFTs
- **Social Feed & Engagement**: Dynamic feed with upvoting, commenting, and sharing
- **Trend Analytics Dashboard**: Insights into trending topics and performance metrics

### Technical Features
- Base Mini App compatible with Farcaster frames
- Wallet integration for Base network
- Real-time engagement tracking
- Automated reward distribution
- NFT minting for premium memes

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Blockchain**: Base (Ethereum L2), ethers.js, wagmi
- **Styling**: Custom design system with Tailwind CSS
- **Icons**: Lucide React

## Design System

### Colors
- **Cardinal**: `hsl(324, 93%, 48%)` - Primary brand color
- **Accent**: `hsl(204, 96%, 65%)` - Secondary actions
- **Bg**: `hsl(204, 100%, 97%)` - Background
- **Surface**: `hsl(0, 0%, 100%)` - Cards and surfaces

### Typography
- **Display**: `text-4xl font-bold` - Headlines
- **Body**: `text-base font-normal leading-6` - Body text

### Spacing
- **Sm**: `4px`
- **Md**: `8px`
- **Lg**: `16px`

### Border Radius
- **Sm**: `4px`
- **Md**: `8px`
- **Lg**: `12px`

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd memecoin-mania
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── users/         # User management
│   │   ├── memes/         # Meme CRUD operations
│   │   ├── engagements/   # Upvotes, comments, shares
│   │   └── rewards/       # Reward calculations
│   ├── components/        # Reusable UI components
│   ├── create/           # Meme creation page
│   ├── feed/             # Social feed page
│   ├── marketplace/      # NFT marketplace page
│   ├── analytics/        # Analytics dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                  # Utility libraries
│   ├── db.ts            # Database connection
│   ├── types.ts         # TypeScript interfaces
│   └── web3.ts          # Blockchain utilities
├── prisma/              # Database schema
└── public/              # Static assets
```

## API Documentation

### Users API
- `GET /api/users` - Get all users
- `GET /api/users?walletAddress=0x...` - Get user by wallet address
- `POST /api/users` - Create new user

### Memes API
- `GET /api/memes` - Get memes with optional filtering
- `POST /api/memes` - Create new meme

### Engagements API
- `GET /api/engagements` - Get engagements with optional filtering
- `POST /api/engagements` - Create new engagement (upvote/comment/share)

### Rewards API
- `POST /api/rewards` - Calculate and distribute rewards for a meme

## Database Schema

### User
- `userId`: String (Primary Key)
- `farcasterId`: String (Optional)
- `walletAddress`: String (Unique)
- `memeCoinBalance`: Float
- `badges`: String (JSON array)
- `leaderboardRank`: Int

### Meme
- `memeId`: String (Primary Key)
- `creatorId`: String (Foreign Key)
- `imageUrl`: String
- `textPrompt`: String
- `topic`: String
- `upvotes`: Int
- `shares`: Int
- `creationTimestamp`: DateTime
- `mintedAsNft`: Boolean
- `nftContractAddress`: String (Optional)
- `nftTokenId`: String (Optional)

### Engagement
- `engagementId`: String (Primary Key)
- `userId`: String (Foreign Key)
- `memeId`: String (Foreign Key)
- `type`: String ('upvote', 'comment', 'share')
- `timestamp`: DateTime
- `commentText`: String (Optional)

### Trend
- `trendId`: String (Primary Key)
- `keyword`: String (Unique)
- `frequency`: Int
- `lastUpdated`: DateTime

## Blockchain Integration

### Base Network
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **MemeCoin Contract**: Placeholder (to be deployed)

### Wallet Integration
- Uses wagmi for React wallet connections
- Supports Base network transactions
- ERC-20 token interactions for MemeCoins
- NFT minting and trading capabilities

## Farcaster Integration

### Frame Compatibility
- Designed as a Base Mini App
- Compatible with Farcaster frames
- Social sharing and engagement features
- Frame metadata and actions

## Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

### Database
- Prisma ORM for type-safe database operations
- SQLite for development (easily upgradeable to PostgreSQL)
- Database migrations with Prisma

### API Design
- RESTful API endpoints
- JSON responses with success/error structure
- Proper error handling and validation
- Type-safe API responses

### UI/UX
- Responsive design for all screen sizes
- Custom design system implementation
- Accessible components
- Smooth animations and transitions

## Deployment

### Production Setup
1. Deploy to Vercel or similar platform
2. Set up production database (PostgreSQL recommended)
3. Configure environment variables
4. Deploy smart contracts to Base network
5. Set up monitoring and analytics

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_RPC_URL="https://mainnet.base.org"
MEME_COIN_CONTRACT_ADDRESS="0x..."
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Smart contract deployment for MemeCoin
- [ ] AI-powered meme generation
- [ ] Advanced trend analysis
- [ ] Mobile app development
- [ ] Multi-chain support
- [ ] Advanced marketplace features

---

Built with ❤️ on Base

