import { useRef, useEffect, useCallback } from 'react';
import type { PlayerPerks, GameOverData } from '../types';

interface MonkeyGameProps {
  perks: PlayerPerks;
  address: string;
  herotag: string | null;
  onGameOver: (data: GameOverData) => void;
}

export function MonkeyGame({ perks, address, herotag, onGameOver }: MonkeyGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const perksRef = useRef(perks);
  perksRef.current = perks;

  // Send perks to game iframe once loaded
  const sendPerks = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      {
        type: 'INIT_PERKS',
        perks: perksRef.current,
        address,
        herotag,
      },
      window.location.origin,
    );
  }, [address, herotag]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'GAME_READY') {
        sendPerks();
      }

      if (data.type === 'GAME_OVER') {
        onGameOver({
          score: data.score || 0,
          bananas: data.bananas || 0,
          distance: data.distance || 0,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendPerks, onGameOver]);

  return (
    <div className="relative w-full max-w-[900px] aspect-[900/506]">
      <iframe
        ref={iframeRef}
        src="/game/index.html"
        className="w-full h-full border-2 border-jungle-green/30 rounded-xl"
        style={{ imageRendering: 'pixelated' }}
        title="Monkey Jump Game"
        onLoad={sendPerks}
        allow="autoplay"
      />
    </div>
  );
}
