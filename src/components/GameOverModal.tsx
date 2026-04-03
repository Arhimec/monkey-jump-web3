import { GameOverData, PlayerPerks } from '../types';

interface GameOverModalProps {
  isOpen: boolean;
  data: GameOverData;
  perks: PlayerPerks;
  onNewGame: () => void;
  onChangeSquad: () => void;
  onReturnToMenu: () => void;
}

export function GameOverModal({ isOpen, data, perks, onNewGame, onChangeSquad, onReturnToMenu }: GameOverModalProps) {
  if (!isOpen) return null;

  const finalScore = Math.floor(data.score * perks.score_multiplier);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-dark/80 backdrop-blur-md animate-in fade-in duration-500" />
      
      {/* Modal Content */}
      <div className="glass-panel w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border-gold/30 max-h-[95dvh] flex flex-col">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gold/50 blur-xl flex-shrink-0" />
        
        <div className="p-4 sm:p-8 text-center overflow-y-auto">
          <div className="landscape:flex landscape:items-center landscape:gap-8 landscape:text-left">
            {/* Header section — simplified for space in landscape */}
            <div className="landscape:flex-1 landscape:border-r landscape:border-gold/10 landscape:pr-8">
              <h2 className="font-pixel text-lg sm:text-xl text-danger gold-glow mb-1 uppercase tracking-tighter">
                Game Over
              </h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gold/5 blur-xl group-hover:bg-gold/10 transition-colors rounded-full" />
                  <div className="relative">
                    <span className="block font-pixel text-[8px] sm:text-[9px] text-gold/40 tracking-widest uppercase mb-1">Final Score</span>
                    <span className="block font-pixel text-3xl sm:text-4xl text-gold gold-glow leading-none">
                      {finalScore.toLocaleString()}
                    </span>
                    {perks.score_multiplier > 1 && (
                      <span className="block font-mono text-[7px] sm:text-[8px] text-jungle-green mt-1 opacity-80 uppercase">
                        Includes {perks.score_multiplier}x Multiplier
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="glass-panel bg-white/5 border-white/5 p-3 sm:p-4 py-2 sm:py-3">
                    <span className="block font-pixel text-[7px] sm:text-[8px] text-gray-500 tracking-wider mb-1 sm:mb-2 uppercase">Bananas</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base sm:text-xl">🍌</span>
                      <span className="font-pixel text-base sm:text-lg text-white">{data.bananas}</span>
                    </div>
                  </div>
                  <div className="glass-panel bg-white/5 border-white/5 p-3 sm:p-4 py-2 sm:py-3">
                    <span className="block font-pixel text-[7px] sm:text-[8px] text-gray-500 tracking-wider mb-1 sm:mb-2 uppercase">Distance</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-base sm:text-lg text-white font-bold">{data.distance}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions section — moves right in landscape */}
            <div className="landscape:flex-1 flex flex-col gap-2.5 sm:gap-4 mt-4 landscape:mt-0 landscape:justify-center">
              <button
                onClick={onNewGame}
                className="btn-pixel w-full py-3 sm:py-5 text-xs sm:text-sm active:scale-95 transition-transform"
              >
                Try Again
              </button>
              <button
                onClick={onChangeSquad}
                className="bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold font-pixel text-[9px] sm:text-[10px] w-full py-3 sm:py-4 transition-all duration-300 uppercase tracking-widest"
              >
                Change Squad
              </button>
              <button
                onClick={onReturnToMenu}
                className="btn-danger w-full py-2.5 sm:py-4 text-[8px] sm:text-[10px] uppercase font-mono tracking-widest opacity-70 hover:opacity-100 transition-opacity"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>

        {/* Footer decoration — hidden on short landscape to save space */}
        <div className="bg-gold/5 border-t border-gold/10 py-2 sm:py-3 px-6 flex justify-between items-center flex-shrink-0 landscape:hidden sm:landscape:flex">
          <span className="font-mono text-[7px] sm:text-[8px] text-gray-600 uppercase tracking-widest">BAXC // ASCENT</span>
          <span className="font-mono text-[7px] sm:text-[8px] text-gray-600">v1.0.4-gold</span>
        </div>
      </div>
    </div>
  );
}
