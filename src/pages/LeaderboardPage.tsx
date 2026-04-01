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
    <div className="min-h-screen flex flex-col bg-charcoal-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <header className="flex items-center justify-between px-6 py-4 bg-charcoal-dark border-b border-gold/10 z-20">
        <h1 className="font-pixel text-[10px] text-gold gold-glow tracking-tighter uppercase">Hall of Fame</h1>
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <button
              onClick={() => navigate('/game')}
              className="font-mono text-[9px] text-gray-400 hover:text-gold transition-colors uppercase tracking-widest"
            >
              &larr; Back to Ascent
            </button>
          )}
          {!isLoggedIn && (
            <button
              onClick={() => navigate('/')}
              className="font-mono text-[9px] text-gray-400 hover:text-gold transition-colors uppercase tracking-widest"
            >
              Login Terminal
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 z-10">
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-pixel text-2xl text-gold gold-glow mb-3">ELITE ASCENDERS</h2>
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                The highest peaks reached by validated BAXC holders on the MultiversX network.
              </p>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 font-mono text-[9px] text-gold/60 hover:text-gold transition-colors uppercase tracking-widest px-4 py-2 bg-charcoal-dark border border-gold/10 rounded-lg"
            >
              <span className="text-[12px]">↻</span> Refresh Data
            </button>
          </div>

          {error && (
            <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 mb-8">
              <p className="font-mono text-xs text-danger text-center opacity-80 uppercase tracking-tight">{error}</p>
            </div>
          )}

          <div className="relative">
            <LeaderboardTable
              scores={scores}
              loading={loading}
              currentAddress={address}
            />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center opacity-40">
        <p className="font-mono text-[8px] tracking-[0.3em] text-gray-500 uppercase">
          On-chain verification secured by @multiversx
        </p>
      </footer>
    </div>
  );
}
