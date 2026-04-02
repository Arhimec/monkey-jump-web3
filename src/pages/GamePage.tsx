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
import { GameOverModal } from '../components/GameOverModal';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleNewGame = () => {
    // Send message to iframe to restart
    const iframe = document.querySelector('iframe');
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'RESTART_GAME' }, window.location.origin);
    }
    setLastScore(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Determine if we should show site navigation/perks
  // On mobile, hide them during active gameplay to maximize space
  const isPlaying = !lastScore;
  const showNav = !isPlaying; // Simplified for now: always show nav if not playing

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-dark">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-110" />
          <div className="animate-spin w-10 h-10 border-2 border-gold border-t-transparent rounded-full mx-auto mb-6 relative z-10" />
          <p className="font-pixel text-[10px] text-gold tracking-widest relative z-10">VERIFYING NFT DATA</p>
          <p className="font-mono text-[9px] text-gray-500 mt-3 relative z-10 uppercase tracking-tight">
            {address ? `${address.slice(0, 10)}...${address.slice(-10)}` : ''}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-charcoal-dark">
        <div className="glass-panel p-10 max-w-md w-full text-center border-danger/20">
          <div className="text-danger font-pixel text-xs mb-6 uppercase tracking-widest">System Error</div>
          <p className="font-mono text-sm text-gray-400 mb-8 leading-relaxed opacity-80">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-pixel w-full py-4">
            Reload System
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-charcoal-dark relative overflow-hidden">
        {/* Access Denied Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,65,54,0.05)_0%,transparent_70%)]" />
        
        <div className="glass-panel p-10 md:p-14 max-w-md w-full text-center relative border-danger/20">
          <div className="text-danger font-pixel text-lg mb-8 uppercase tracking-widest">Access Denied</div>
          
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-danger/10 blur-2xl rounded-full scale-125 opacity-30" />
            <img
              src="/game/assets/monkey_sprite.png"
              alt="Monkey"
              className="w-20 h-20 mx-auto opacity-30 grayscale relative z-10"
              style={{ imageRendering: 'pixelated', objectFit: 'none', objectPosition: '0 0' }}
            />
          </div>
          
          <p className="font-mono text-sm text-gray-400 mb-2 font-light">
            Exclusive entry for <span className="text-white font-medium italic">BAXC Holders</span>
          </p>
          <p className="font-mono text-[10px] text-gray-600 mb-10 tracking-[0.2em]">
            COLLECTION: BAXC-cdf74d
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <a
              href="https://xoxno.com/collection/BAXC-cdf74d"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pixel py-4"
            >
              Acquire Pass (NFT)
            </a>
            <button onClick={handleLogout} className="btn-danger py-4 font-mono text-[10px] uppercase">
              Exit Terminal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-safe overflow-hidden flex flex-col bg-charcoal-dark">
      {/* Header - Hidden on mobile during active gameplay */}
      <header className={`flex items-center justify-between px-6 py-4 bg-charcoal-dark border-b border-gold/10 flex-shrink-0 z-20 transition-all duration-300 ${isPlaying ? 'max-sm:hidden' : ''}`}>
        <div className="flex items-center gap-6">
          <h1 className="font-pixel text-[10px] text-gold gold-glow tracking-tighter">BAXC / ASCENT</h1>
          <div className="hidden sm:flex h-4 w-px bg-gold/10" />
          <span className="hidden sm:inline font-mono text-[10px] text-gray-500 tracking-wider">
            {herotag ? `@${herotag}` : `${address.slice(0, 10)}...${address.slice(-10)}`}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 font-mono text-[9px] text-gold/60 hover:text-gold transition-colors uppercase tracking-[0.1em]"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? '[Exit Full]' : '[Fullscreen]'}
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowConfig(true)}
              className="font-mono text-[9px] text-gray-500 hover:text-gold transition-colors uppercase tracking-[0.1em]"
              title="Admin Terminal"
            >
              [Admin]
            </button>
          )}
          <button
            onClick={() => navigate('/leaderboard')}
            className="font-mono text-[9px] text-gray-500 hover:text-gold transition-colors uppercase tracking-[0.1em]"
          >
            Hall of Fame
          </button>
          <button 
            onClick={handleLogout} 
            className="font-mono text-[9px] text-gray-500 hover:text-danger transition-colors uppercase tracking-[0.1em]"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Perks Ribbon - Hidden on mobile during active gameplay */}
      {activePerks.length > 0 && (
        <div className={`px-6 py-2 bg-gold/5 border-b border-gold/10 flex-shrink-0 z-10 overflow-x-auto transition-all duration-300 ${isPlaying ? 'max-sm:hidden' : ''}`}>
          <div className="flex items-center gap-4 min-w-max">
            <span className="font-pixel text-[8px] text-gold/40 tracking-wider">ACTIVE PERKS</span>
            <div className="h-3 w-px bg-gold/10" />
            <PerkBadges perks={perks} activePerks={activePerks} />
          </div>
        </div>
      )}

      {/* Game Viewport */}
      <main className="flex-1 relative flex items-center justify-center p-0 sm:p-6 overflow-hidden min-h-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0%,transparent_80%)] pointer-events-none" />
        <div className="w-full h-full max-w-3xl max-h-[900px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x md:border border-gold/10 md:rounded-2xl overflow-hidden relative">
          <MonkeyGame
            perks={perks}
            address={address}
            herotag={herotag}
            onGameOver={handleGameOver}
          />
        </div>
      </main>

      {/* Footer / Stats */}
      {lastScore && (
        <div className="px-6 py-4 bg-charcoal-dark border-t border-gold/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
             <span className="font-pixel text-[9px] text-gold/40 tracking-widest uppercase">Last Score</span>
             <span className="font-pixel text-[11px] text-gold gold-glow">
               {Math.floor(lastScore.score * perks.score_multiplier).toLocaleString()}
             </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍌</span>
              <span className="font-mono text-xs text-white/70">{lastScore.bananas}</span>
            </div>
            <div className="h-4 w-px bg-gold/10" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gray-500 uppercase">Ascent</span>
              <span className="font-mono text-xs text-white/70">{lastScore.distance}m</span>
            </div>
          </div>
        </div>
      )}

      <TraitConfigModal isOpen={showConfig} onClose={() => setShowConfig(false)} />
      
      {lastScore && (
        <GameOverModal
          isOpen={!!lastScore}
          data={lastScore}
          perks={perks}
          onNewGame={handleNewGame}
          onReturnToMenu={() => navigate('/')}
        />
      )}
    </div>
  );
}
