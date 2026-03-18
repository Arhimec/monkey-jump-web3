import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { ProviderFactory } from '@multiversx/sdk-dapp/out/providers/ProviderFactory';

type LoginMethod = 'extension' | 'walletConnect' | 'crossWindow';

export function LoginPage() {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) navigate('/game');
  }, [isLoggedIn, navigate]);

  const handleLogin = useCallback(async (method: LoginMethod) => {
    setLoggingIn(true);
    setError(null);
    try {
      const provider = await ProviderFactory.create({ type: method });
      const result = await provider.login();
      if (result?.address) {
        navigate('/game');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 bg-gradient-to-b from-jungle-dark via-jungle-deep to-jungle-dark -z-10" />

      {/* Floating particles */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-jungle-green/30 rounded-full animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="glass-panel p-8 md:p-12 max-w-md w-full text-center">
        <h1 className="font-pixel text-2xl md:text-3xl text-banana mb-2 leading-relaxed">
          MONKEY<br />JUMP
        </h1>
        <div className="font-pixel text-xs text-jungle-green mb-6">Web3 Edition</div>

        <div className="mb-6">
          <img
            src="/game/assets/monkey_sprite.png"
            alt="Monkey"
            className="w-20 h-20 mx-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="bg-jungle-dark/60 border border-jungle-green/20 rounded-lg p-4 mb-8">
          <p className="font-pixel text-[10px] text-jungle-green leading-relaxed">
            BAXC HOLDERS ONLY
          </p>
          <p className="font-mono text-xs text-gray-400 mt-2">
            Connect your xPortal wallet to play.<br />
            You need at least 1 BAXC NFT.
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 mb-4">
            <p className="font-mono text-xs text-danger">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleLogin('extension')}
            disabled={loggingIn}
            className="w-full font-pixel text-xs bg-jungle-green text-jungle-dark border-2 border-jungle-green rounded-lg py-3 hover:bg-banana hover:border-banana transition-all disabled:opacity-50"
          >
            {loggingIn ? 'Connecting...' : 'xPortal Extension'}
          </button>
          <button
            onClick={() => handleLogin('walletConnect')}
            disabled={loggingIn}
            className="w-full font-pixel text-xs bg-transparent text-jungle-green border border-jungle-green/50 rounded-lg py-3 hover:bg-jungle-green/10 transition-all disabled:opacity-50"
          >
            xPortal Mobile (WalletConnect)
          </button>
          <button
            onClick={() => handleLogin('crossWindow')}
            disabled={loggingIn}
            className="w-full font-pixel text-xs bg-transparent text-gray-400 border border-gray-600 rounded-lg py-3 hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            MultiversX Web Wallet
          </button>
        </div>

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
