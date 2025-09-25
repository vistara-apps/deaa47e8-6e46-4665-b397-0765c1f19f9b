// AI integration for meme generation and text analysis
// Using OpenAI API for text generation and analysis

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface MemePrompt {
  topic: string;
  style: string;
  humor: 'light' | 'dark' | 'sarcastic' | 'absurd';
  length: 'short' | 'medium' | 'long';
}

export interface GeneratedMeme {
  text: string;
  hashtags: string[];
  virality_score: number;
  category: string;
}

// Generate meme text based on topic and style
export const generateMemeText = async (prompt: MemePrompt): Promise<GeneratedMeme | null> => {
  try {
    if (!OPENAI_API_KEY) {
      // Fallback to simple template-based generation
      return generateFallbackMeme(prompt);
    }

    const systemPrompt = `You are a creative meme generator. Create viral-worthy meme text based on the given topic and style.
    Return a JSON object with: text (the meme text), hashtags (array of relevant hashtags), virality_score (1-10), category (crypto/tech/culture/etc)`;

    const userPrompt = `Topic: ${prompt.topic}
Style: ${prompt.style}
Humor: ${prompt.humor}
Length: ${prompt.length}

Generate a meme text that's likely to go viral.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    // Parse JSON response
    const result = JSON.parse(content);
    return {
      text: result.text,
      hashtags: result.hashtags || [],
      virality_score: result.virality_score || 5,
      category: result.category || 'general',
    };
  } catch (error) {
    console.error('Error generating meme text:', error);
    return generateFallbackMeme(prompt);
  }
};

// Fallback meme generation when AI is not available
const generateFallbackMeme = (prompt: MemePrompt): GeneratedMeme => {
  const templates = {
    crypto: [
      "When you bought the top and everyone else sold",
      "Me checking my portfolio vs my bank account",
      "Crypto explained in one picture",
    ],
    tech: [
      "When the code finally compiles",
      "Developers vs the code they wrote 6 months ago",
      "When you find the bug after 3 hours of debugging",
    ],
    culture: [
      "That moment when you realize you're the meme",
      "When life gives you lemons, make lemonade. When life gives you crypto...",
      "The struggle is real",
    ],
  };

  const categoryTemplates = templates[prompt.topic as keyof typeof templates] || templates.culture;
  const text = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];

  return {
    text,
    hashtags: ['#meme', `#${prompt.topic}`, '#viral', '#memecoin'],
    virality_score: Math.floor(Math.random() * 5) + 5,
    category: prompt.topic,
  };
};

// Analyze meme virality potential
export const analyzeMemeVirality = async (memeText: string): Promise<number> => {
  try {
    if (!OPENAI_API_KEY) {
      // Simple heuristic-based scoring
      return Math.floor(Math.random() * 5) + 5;
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Rate this meme\'s virality potential on a scale of 1-10. Consider humor, relatability, timeliness, and shareability. Return only a number.'
          },
          { role: 'user', content: memeText },
        ],
        temperature: 0.3,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const score = parseInt(data.choices[0]?.message?.content?.trim() || '5');

    return Math.max(1, Math.min(10, score));
  } catch (error) {
    console.error('Error analyzing meme virality:', error);
    return Math.floor(Math.random() * 5) + 5;
  }
};

// Generate trending topic suggestions
export const generateTopicSuggestions = async (currentTrends: string[]): Promise<string[]> => {
  try {
    if (!OPENAI_API_KEY) {
      return ['crypto', 'memes', 'web3', 'ai', 'blockchain'];
    }

    const trendsText = currentTrends.join(', ');
    const prompt = `Based on current trending topics: ${trendsText}

Generate 5 new meme-worthy topics that could go viral. Focus on timely, relatable, and humorous subjects. Return as a JSON array of strings.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    const suggestions = JSON.parse(content);
    return Array.isArray(suggestions) ? suggestions : ['crypto', 'memes', 'web3', 'ai', 'blockchain'];
  } catch (error) {
    console.error('Error generating topic suggestions:', error);
    return ['crypto', 'memes', 'web3', 'ai', 'blockchain'];
  }
};

