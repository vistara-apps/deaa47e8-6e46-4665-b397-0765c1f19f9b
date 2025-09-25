'use client';

import { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';
import { Palette, Check } from 'lucide-react';

const themes = [
  { id: 'default', name: 'MemeCoin Mania', description: 'Professional finance with meme energy' },
  { id: 'celo', name: 'CELO', description: 'Bold black and yellow' },
  { id: 'solana', name: 'SOLANA', description: 'Purple gradient vibes' },
  { id: 'base', name: 'BASE', description: 'Classic Base blue' },
  { id: 'coinbase', name: 'COINBASE', description: 'Navy corporate style' }
];

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6 text-center">
          <Palette className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Theme Preview</h1>
          <p className="text-muted">Choose your preferred theme</p>
        </div>

        {/* Theme Options */}
        <div className="space-y-3">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`w-full glass-card p-4 text-left transition-all duration-200 ${
                theme === themeOption.id ? 'ring-2 ring-accent' : 'hover:bg-opacity-90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{themeOption.name}</h3>
                  <p className="text-sm text-muted">{themeOption.description}</p>
                </div>
                {theme === themeOption.id && (
                  <Check className="w-5 h-5 text-accent" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Preview Card */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg"></div>
              <div>
                <p className="font-medium">Sample Meme Creator</p>
                <p className="text-sm text-muted">2 hours ago</p>
              </div>
            </div>
            
            <div className="bg-surface p-4 rounded-lg">
              <p className="text-sm">This is how your memes will look with the selected theme!</p>
            </div>
            
            <div className="flex items-center justify-between">
              <button className="btn-primary text-sm">
                Primary Action
              </button>
              <button className="btn-secondary text-sm">
                Secondary
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="w-full btn-secondary"
        >
          Back to App
        </button>
      </div>
    </div>
  );
}
