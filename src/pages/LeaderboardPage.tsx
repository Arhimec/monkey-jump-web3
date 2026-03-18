import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/out/react/account/useGetAccountInfo';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/Leaderboard';

export function LeaderboardPage() {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();
  const { scores, loading, error, refetch } = useLeaderboard(50);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-jungle-dark/80 border-b border-jungle-green/20">
        <h1 className="font-pixel text-sm text-banana">LEADERBOARD</h1>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={() => navigate('/game')}
              className="font-mono text-xs text-gray-400 hover:text-jungle-green transition-colors"
            >
              Back to Game
            </button>
          )}
          {!isLoggedIn && (
            <button
              onClick={() => navigate('/')}
              className="font-mono text-xs text-gray-400 hover:text-jungle-green transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-pixel text-lg text-banana">Top Players</h2>
              <p className="font-mono text-xs text-gray-500 mt-1">
                BAXC Monkey Jump Rankings
              </p>
            </div>
            <button
              onClick={refetch}
              className="font-mono text-xs text-gray-400 hover:text-jungle-green transition-colors"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 mb-4">
              <p className="font-mono text-xs text-danger">{error}</p>
            </div>
          )}

          <LeaderboardTable
            scores={scores}
            loading={loading}
            currentAddress={address}
          />
        </div>
      </main>
    </div>
  );
}
