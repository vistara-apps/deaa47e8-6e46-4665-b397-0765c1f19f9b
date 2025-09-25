export const MEME_TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Pointing',
    imageUrl: '/templates/drake.jpg',
    textAreas: [
      { x: 50, y: 20, width: 40, height: 30, placeholder: 'Thing you don\'t like' },
      { x: 50, y: 60, width: 40, height: 30, placeholder: 'Thing you like' }
    ]
  },
  {
    id: 'distracted',
    name: 'Distracted Boyfriend',
    imageUrl: '/templates/distracted.jpg',
    textAreas: [
      { x: 10, y: 80, width: 25, placeholder: 'Loyal thing' },
      { x: 40, y: 10, width: 25, placeholder: 'New shiny thing' },
      { x: 70, y: 80, width: 25, placeholder: 'You' }
    ]
  },
  {
    id: 'expanding',
    name: 'Expanding Brain',
    imageUrl: '/templates/expanding.jpg',
    textAreas: [
      { x: 50, y: 10, width: 45, placeholder: 'Basic idea' },
      { x: 50, y: 30, width: 45, placeholder: 'Better idea' },
      { x: 50, y: 50, width: 45, placeholder: 'Great idea' },
      { x: 50, y: 70, width: 45, placeholder: 'Galaxy brain idea' }
    ]
  }
];

export const TRENDING_TOPICS = [
  { keyword: 'DeFi', category: 'crypto', frequency: 95 },
  { keyword: 'NFTs', category: 'crypto', frequency: 87 },
  { keyword: 'Base Chain', category: 'crypto', frequency: 92 },
  { keyword: 'Meme Coins', category: 'crypto', frequency: 89 },
  { keyword: 'Web3', category: 'tech', frequency: 78 },
  { keyword: 'AI', category: 'tech', frequency: 85 },
  { keyword: 'Crypto Winter', category: 'finance', frequency: 72 },
  { keyword: 'HODL', category: 'culture', frequency: 88 }
];

export const MEMECOIN_REWARDS = {
  CREATE_MEME: 10,
  UPVOTE_RECEIVED: 2,
  COMMENT_RECEIVED: 3,
  SHARE_RECEIVED: 5,
  TRENDING_BONUS: 50,
  DAILY_LOGIN: 5,
  FIRST_MEME: 25
};

export const RARITY_COLORS = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  legendary: 'text-yellow-400'
};
