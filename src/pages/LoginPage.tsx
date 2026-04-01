import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';

export function LoginPage() {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate   = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/game');
  }, [isLoggedIn, navigate]);

  const openPanel = () => {
    UnlockPanelManager.init({
      loginHandler: () => navigate('/game'),
      onClose: async () => { /* closed without login */ },
    }).openUnlockPanel();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 bg-charcoal-dark -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] -z-10" />
      
      {/* Animated Gold Accents */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[100px] bg-gradient-to-b from-transparent via-gold/20 to-transparent rotate-45 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top:  `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="glass-panel p-10 md:p-14 max-w-md w-full text-center relative border-gold/30 hover:border-gold/50 transition-colors duration-500">
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" />

        <div className="mb-8">
          <h1 className="font-pixel text-3xl md:text-4xl text-gold gold-glow mb-4 tracking-tighter leading-none">
            MONKEY<br />JUMP
          </h1>
          <div className="font-mono text-[10px] tracking-[0.3em] text-gold/60 uppercase">
            Ape Ascent — Web3 Edition
          </div>
        </div>

        {/* Monkey sprite — premium glow */}
        <div className="mb-10 relative inline-block group">
          <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full scale-110 opacity-50 group-hover:opacity-100 transition-opacity" />
          <img
            src="/game/assets/monkey_sprite.png"
            alt="Monkey"
            className="w-24 h-24 mx-auto relative z-10 transition-transform group-hover:scale-110 duration-500"
            style={{ imageRendering: 'pixelated', objectFit: 'none', objectPosition: '0 0' }}
          />
        </div>

        {/* BAXC gate notice */}
        <div className="bg-charcoal-dark/80 backdrop-blur-md border border-gold/10 rounded-2xl p-6 mb-10 shadow-inner">
          <p className="font-pixel text-[10px] text-gold mb-3 tracking-wider">
            BAXC HOLDERS ONLY
          </p>
          <div className="h-px w-12 bg-gold/30 mx-auto mb-4" />
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Connect your <span className="text-white font-medium italic">xPortal</span> wallet to enter the arena. Minimum 1 BAXC NFT required.
          </p>
        </div>

        {/* Single connect button — opens the official panel */}
        <button
          onClick={openPanel}
          className="w-full btn-pixel py-5 text-sm uppercase"
        >
          Begin Ascent
        </button>

        <div className="mt-10 pt-6 border-t border-gold/10">
          <a
            href="https://xoxno.com/collection/BAXC-cdf74d"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gold transition-all duration-300"
          >
            <span>Need an entry pass? Get BAXC</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
        </div>
      </div>

      <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-1000">
        <p className="font-mono text-[9px] tracking-[0.2em] text-gray-400 uppercase">
          Powered by MultiversX Infrastructure
        </p>
      </div>
    </div>
  );
}
