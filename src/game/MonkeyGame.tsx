import { useRef, useEffect, useCallback } from 'react';
import type { PlayerPerks, GameOverData } from '../types';

interface MonkeyGameProps {
  perks: PlayerPerks;
  address: string;
  herotag: string | null;
  onGameOver: (data: GameOverData) => void;
}

export function MonkeyGame({ perks, address, herotag, onGameOver }: MonkeyGameProps) {
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const perksRef   = useRef(perks);
  perksRef.current = perks;

  const sendPerks = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: 'INIT_PERKS', perks: perksRef.current, address, herotag },
      window.location.origin,
    );
  }, [address, herotag]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'GAME_READY') sendPerks();
      if (data.type === 'GAME_OVER') {
        onGameOver({
          score:    data.score    || 0,
          bananas:  data.bananas  || 0,
          distance: data.distance || 0,
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendPerks, onGameOver]);

  return (
    /*
      Mobile-first sizing strategy:
      - On mobile: take all remaining viewport height (flex-1), full width
      - On desktop: cap at 900px wide, keep 900/506 aspect ratio
      The iframe itself handles internal scaling via its own resize() function.
    */
    <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
      <div
        className="w-full h-full"
        style={{
          /* On large screens limit to game's natural dimensions */
          maxWidth:  '900px',
          maxHeight: '506px',
          /* On smaller screens: keep 900:506 ratio but fill available space */
          aspectRatio: '900 / 506',
        }}
      >
        <iframe
          ref={iframeRef}
          src="/game/index.html"
          className="w-full h-full border-0 rounded-xl"
          style={{ display: 'block' }}
          title="Monkey Jump Game"
          onLoad={sendPerks}
          allow="autoplay"
        />
      </div>
    </div>
  );
}
