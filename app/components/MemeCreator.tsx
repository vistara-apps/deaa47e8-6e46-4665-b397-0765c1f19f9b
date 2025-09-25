'use client';

import { useState } from 'react';
import { Image, Type, Sparkles, Send } from 'lucide-react';
import { MEME_TEMPLATES, TRENDING_TOPICS } from '@/lib/constants';
import { generateMemeId } from '@/lib/utils';

interface MemeCreatorProps {
  onMemeCreated: (meme: any) => void;
}

export function MemeCreator({ onMemeCreated }: MemeCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(MEME_TEMPLATES[0]);
  const [textPrompt, setTextPrompt] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMeme = async () => {
    if (!textPrompt.trim() || !selectedTopic) return;

    setIsCreating(true);
    
    // Simulate meme creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newMeme = {
      memeId: generateMemeId(),
      creatorId: 'user_123',
      imageUrl: selectedTemplate.imageUrl,
      textPrompt,
      topic: selectedTopic,
      upvotes: 0,
      shares: 0,
      comments: 0,
      creationTimestamp: Date.now(),
      mintedAsNft: false,
      trending: false
    };

    onMemeCreated(newMeme);
    
    // Reset form
    setTextPrompt('');
    setSelectedTopic('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Create Your Meme</h2>
        <p className="text-muted">Turn trending topics into viral gold</p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Image className="w-5 h-5" />
          Choose Template
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {MEME_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedTemplate.id === template.id
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <img 
                src={template.imageUrl || '/api/placeholder/150/100'} 
                alt={template.name}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <p className="text-xs font-medium">{template.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Type className="w-5 h-5" />
          Your Meme Text
        </h3>
        <textarea
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          placeholder="Enter your hilarious meme text..."
          className="w-full p-4 bg-surface border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-accent"
          rows={4}
        />
      </div>

      {/* Topic Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Trending Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TOPICS.slice(0, 6).map((topic) => (
            <button
              key={topic.keyword}
              onClick={() => setSelectedTopic(topic.keyword)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTopic === topic.keyword
                  ? 'bg-accent text-black'
                  : 'bg-surface text-fg hover:bg-opacity-80'
              }`}
            >
              #{topic.keyword}
              <span className="ml-1 text-xs opacity-70">
                {topic.frequency}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreateMeme}
        disabled={!textPrompt.trim() || !selectedTopic || isCreating}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isCreating ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Creating Meme...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Create & Earn MemeCoins
          </>
        )}
      </button>

      {/* Reward Info */}
      <div className="glass-card p-4 text-center">
        <p className="text-sm text-muted mb-2">Potential Rewards</p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="coin-glow">+10 MC</span>
          <span className="text-muted">Create</span>
          <span className="coin-glow">+2 MC</span>
          <span className="text-muted">Per Upvote</span>
          <span className="coin-glow">+50 MC</span>
          <span className="text-muted">Trending</span>
        </div>
      </div>
    </div>
  );
}
