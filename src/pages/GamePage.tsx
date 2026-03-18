import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/out/react/account/useGetAccountInfo';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { ProviderFactory } from '@multiversx/sdk-dapp/out/providers/ProviderFactory';
import { useNFTGate } from '../hooks/useNFTGate';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { PerkBadges } from '../components/PerkBadges';
import { TraitConfigModal } from '../components/TraitConfigModal';
import { MonkeyGame } from '../game/MonkeyGame';
import { ADMIN_ADDRESSES } from '../config';
import type { GameOverData } from '../types';

export function GamePage() {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();
  const navigate = useNavigate();
  const { loading, error, hasAccess, perks, activePerks, herotag } = useNFTGate(address);
  const { submitScore } = useLeaderboard();
  const [showConfig, setShowConfig] = useState(false);
  const [lastScore, setLastScore] = useState<GameOverData | null>(null);

  const isAdmin = ADMIN_ADDRESSES.includes(address);

  if (!isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleGameOver = async (data: GameOverData) => {
    setLastScore(data);
    const finalScore = Math.floor(data.score * perks.score_multiplier);
    await submitScore({
      address,
      herotag,
      score: finalScore,
      bananas: data.bananas,
      distance: data.distance,
      perks,
    });
  };

  const handleLogout = async () => {
    try {
      await ProviderFactory.destroy();
    } catch {
      // ignore
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-jungle-green border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-pixel text-sm text-jungle-green">Checking NFTs...</p>
          <p className="font-mono text-xs text-gray-500 mt-2">
            {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-panel p-8 max-w-md w-full text-center">
          <div className="text-danger font-pixel text-lg mb-4">Error</div>
          <p className="font-mono text-sm text-gray-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-pixel">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-panel p-8 max-w-md w-full text-center">
          <div className="text-danger font-pixel text-xl mb-4">Access Denied</div>
          <img
            src="/game/assets/monkey_sprite.png"
            alt="Monkey"
            className="w-16 h-16 mx-auto mb-4 opacity-30 grayscale"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="font-mono text-sm text-gray-400 mb-2">
            You need a BAXC NFT to play
          </p>
          <p className="font-mono text-xs text-gray-600 mb-6">
            Collection: BAXC-cdf74d
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://xoxno.com/collection/BAXC-cdf74d"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pixel"
            >
              Get BAXC
            </a>
            <button onClick={handleLogout} className="btn-danger">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-jungle-dark/80 border-b border-jungle-green/20">
        <div className="flex items-center gap-4">
          <h1 className="font-pixel text-sm text-banana">MONKEY JUMP</h1>
          <span className="font-mono text-xs text-gray-500">
            {herotag ? `@${herotag}` : `${address.slice(0, 8)}...${address.slice(-6)}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowConfig(true)}
              className="font-mono text-xs text-gray-400 hover:text-jungle-green transition-colors"
              title="Admin: Configure Traits"
            >
              [Config]
            </button>
          )}
          <button
            onClick={() => navigate('/leaderboard')}
            className="font-mono text-xs text-gray-400 hover:text-banana transition-colors"
          >
            Leaderboard
          </button>
          <button onClick={handleLogout} className="font-mono text-xs text-gray-400 hover:text-danger transition-colors">
            Disconnect
          </button>
        </div>
      </header>

      {activePerks.length > 0 && (
        <div className="px-4 py-2 bg-jungle-dark/50 border-b border-jungle-green/10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-pixel text-[10px] text-gray-500">PERKS:</span>
            <PerkBadges perks={perks} activePerks={activePerks} />
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4">
        <MonkeyGame
          perks={perks}
          address={address}
          herotag={herotag}
          onGameOver={handleGameOver}
        />
      </main>

      {lastScore && (
        <div className="px-4 py-2 bg-jungle-dark/80 border-t border-jungle-green/20 text-center">
          <span className="font-pixel text-xs text-banana">
            Last: {Math.floor(lastScore.score * perks.score_multiplier).toLocaleString()} pts
          </span>
          <span className="font-mono text-xs text-gray-500 ml-4">
            🍌 {lastScore.bananas} &middot; {lastScore.distance}m
          </span>
        </div>
      )}

      <TraitConfigModal isOpen={showConfig} onClose={() => setShowConfig(false)} />
    </div>
  );
}
