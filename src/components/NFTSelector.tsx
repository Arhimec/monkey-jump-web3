import { NFTData } from '../types';
import { parseNFTAttributes, computePerks } from '../config';

interface NFTSelectorProps {
  nfts: NFTData[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onConfirm: () => void;
}

export function NFTSelector({ nfts, selectedIds, onToggle, onConfirm }: NFTSelectorProps) {
  const maxSquad = 5;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-charcoal-dark/95 backdrop-blur-xl p-6 sm:p-10 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <header className="mb-10 text-center">
          <h2 className="font-pixel text-2xl sm:text-3xl text-gold gold-glow mb-4 tracking-tighter">
            Select Your Squad
          </h2>
          <div className="flex flex-col items-center gap-2">
            <p className="font-mono text-[11px] text-gray-400 uppercase tracking-widest">
              Choose up to <span className="text-gold font-bold">{maxSquad}</span> BAXC NFTs to combine their perks
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className={`font-pixel text-xs ${selectedIds.length > 0 ? 'text-gold' : 'text-gray-600'}`}>
                {selectedIds.length} / {maxSquad} SELECTED
              </span>
              <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                  style={{ width: `${(selectedIds.length / maxSquad) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-20">
          {nfts.map((nft) => {
            const isSelected = selectedIds.includes(nft.identifier);
            const canSelect = isSelected || selectedIds.length < maxSquad;
            
            // Compute preview perks for this specific NFT
            const traits = parseNFTAttributes(nft);
            const { activePerks } = computePerks(traits);

            return (
              <div
                key={nft.identifier}
                onClick={() => canSelect && onToggle(nft.identifier)}
                className={`
                  relative group cursor-pointer transition-all duration-500
                  ${isSelected ? 'scale-[1.02] -translate-y-1' : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}
                  ${!canSelect && !isSelected ? 'cursor-not-allowed opacity-30 grayscale' : ''}
                `}
              >
                {/* Selection Ring */}
                <div className={`
                  absolute -inset-1 rounded-2xl transition-opacity duration-500
                  ${isSelected ? 'opacity-100 border-2 border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'opacity-0'}
                `} />

                <div className="glass-panel p-3 border-gold/10 group-hover:border-gold/30">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-charcoal-dark/50">
                    <img
                      src={nft.url || nft.thumbnailUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-gold text-charcoal-dark px-2 p-1 font-pixel text-[8px] rounded-md shadow-lg animate-pulse">
                        SQUAD
                      </div>
                    )}
                  </div>

                  <h3 className="font-pixel text-[9px] text-gray-200 mb-2 truncate uppercase tracking-tight">
                    {nft.name.split('#')[1] ? `#${nft.name.split('#')[1]}` : nft.name}
                  </h3>

                  {/* Perk Preview */}
                  <div className="space-y-1">
                    {activePerks.length > 0 ? (
                      activePerks.slice(0, 2).map((p, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-gold/50" />
                          <span className="font-mono text-[8px] text-gold/60 truncate uppercase">{p.label}</span>
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-[8px] text-gray-600 uppercase italic">No Traits</span>
                    )}
                    {activePerks.length > 2 && (
                      <span className="font-mono text-[8px] text-gold/40">+{activePerks.length - 2} more...</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky footer action */}
        <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-charcoal-dark via-charcoal-dark/95 to-transparent pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            disabled={selectedIds.length === 0}
            className={`
              btn-pixel px-12 py-5 text-sm uppercase tracking-[0.2em] pointer-events-auto
              transition-all duration-500 shadow-2xl
              ${selectedIds.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'gold-glow-btn'}
            `}
          >
            {selectedIds.length === 0 ? 'Select at least one Ape' : 'Enter BAXC Jungle'}
          </button>
        </div>
      </div>
    </div>
  );
}
