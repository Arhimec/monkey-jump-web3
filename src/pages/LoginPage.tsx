import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import { ProviderFactory } from '@multiversx/sdk-dapp/out/providers/ProviderFactory';
import type { IProviderFactory } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';

export function LoginPage() {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate   = useNavigate();

  // If already logged in (session restored), jump straight to game
  useEffect(() => {
    if (isLoggedIn) navigate('/game');
  }, [isLoggedIn, navigate]);

  // Open the sdk-dapp native unlock panel — it handles WalletConnect QR
  // inside its own side-panel modal and dismisses itself after login.
  const openPanel = () => {
    UnlockPanelManager.init({
      // loginHandler receives the provider type + anchor from the panel UI
      loginHandler: async ({ type, anchor }: IProviderFactory) => {
        const provider = await ProviderFactory.create({ type, anchor });
        await provider?.login();
        navigate('/game');
      },
      onClose: async () => {
        // panel closed without completing login — nothing to do
      },
    }).openUnlockPanel();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Full-screen gradient BG */}
      <div className="fixed inset-0 bg-gradient-to-b from-jungle-dark via-jungle-deep to-jungle-dark -z-10" />

      {/* Decorative floating dots */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-jungle-green/30 rounded-full animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top:  `${20 + (i % 3) * 25}%`,
              animationDelay:    `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="glass-panel p-8 md:p-12 max-w-sm w-full text-center">
        <h1 className="font-pixel text-2xl md:text-3xl text-banana mb-2 leading-relaxed">
          MONKEY<br />JUMP
        </h1>
        <div className="font-pixel text-xs text-jungle-green mb-6">Web3 Edition</div>

        {/* Monkey sprite — static first frame */}
        <div className="mb-6">
          <img
            src="/game/assets/monkey_sprite.png"
            alt="Monkey"
            className="w-20 h-20 mx-auto"
            style={{ imageRendering: 'pixelated', objectFit: 'none', objectPosition: '0 0' }}
          />
        </div>

        {/* BAXC gate notice */}
        <div className="bg-jungle-dark/60 border border-jungle-green/20 rounded-lg p-4 mb-8">
          <p className="font-pixel text-[10px] text-jungle-green leading-relaxed">
            BAXC HOLDERS ONLY
          </p>
          <p className="font-mono text-xs text-gray-400 mt-2">
            Connect your xPortal wallet to play.<br />
            You need at least 1 BAXC NFT.
          </p>
        </div>

        {/* Single connect button — opens the official panel */}
        <button
          onClick={openPanel}
          className="w-full font-pixel text-xs bg-jungle-green text-jungle-dark border-2 border-jungle-green rounded-lg py-4 hover:bg-banana hover:border-banana transition-all active:scale-95"
        >
          Connect Wallet
        </button>

        <div className="mt-8 pt-4 border-t border-jungle-green/20">
          <a
            href="https://xoxno.com/collection/BAXC-cdf74d"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-500 hover:text-jungle-green transition-colors"
          >
            Get a BAXC NFT &rarr;
          </a>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-mono text-[10px] text-gray-600">
          Powered by MultiversX
        </p>
      </div>
    </div>
  );
}
