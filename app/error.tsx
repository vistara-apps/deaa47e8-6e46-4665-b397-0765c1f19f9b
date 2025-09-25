'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('MemeCoin Mania Error:', error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="glass-card p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted text-sm mb-4">
            Don't worry, even the best memes sometimes fail to load.
          </p>
          {error.message && (
            <p className="text-xs text-red-400 bg-red-500 bg-opacity-10 p-2 rounded">
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full btn-secondary"
          >
            Go Home
          </button>
        </div>

        <p className="text-xs text-muted">
          If the problem persists, please refresh the page or try again later.
        </p>
      </div>
    </div>
  );
}
