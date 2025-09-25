export default function Loading() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto animate-bounce-subtle">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Loading MemeCoin Mania</h2>
          <p className="text-muted">Preparing your meme empire...</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
