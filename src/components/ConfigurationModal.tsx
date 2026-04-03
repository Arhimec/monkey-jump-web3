import { useState, useEffect } from 'react';
import { NFTData, PerkLabel, PlayerPerks } from '../types';
import { 
  TRAIT_PERKS, 
  getTraitPerks, 
  computePerks, 
  parseNFTAttributes,
  PERK_DEFAULTS 
} from '../config';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: NFTData[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  isAdmin: boolean;
}

type Tab = 'squad' | 'perks' | 'system';

export function ConfigurationModal({ 
  isOpen, 
  onClose, 
  nfts, 
  selectedIds, 
  onToggle, 
  isAdmin 
}: ConfigurationModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('squad');
  const [traitConfig, setTraitConfig] = useState<Record<string, Record<string, PerkLabel>>>(
    structuredClone(TRAIT_PERKS)
  );
  
  const maxSquad = 5;

  // Load admin config if open
  useEffect(() => {
    if (isOpen && isAdmin) {
      setTraitConfig(getTraitPerks());
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  // Compute current perks for the "Perks" tab
  const { perks: squadPerks, activePerks } = (() => {
    const selectedNfts = nfts.filter(n => selectedIds.includes(n.identifier));
    const allTraits = selectedNfts.flatMap(parseNFTAttributes);
    return computePerks(allTraits);
  })();

  const handleAdminPerkChange = (
    category: string,
    traitName: string,
    field: 'perk' | 'value' | 'label',
    val: string,
  ) => {
    setTraitConfig((prev) => {
      const next = structuredClone(prev);
      if (!next[category]) next[category] = {};
      if (!next[category][traitName]) {
        next[category][traitName] = { perk: 'score_multiplier', value: 1, label: '' };
      }
      if (field === 'perk') {
        next[category][traitName].perk = val as keyof PlayerPerks;
      } else if (field === 'value') {
        next[category][traitName].value = parseFloat(val) || 0;
      } else {
        next[category][traitName].label = val;
      }
      return next;
    });
  };

  const saveAdminConfig = () => {
    localStorage.setItem('baxc_trait_config', JSON.stringify(traitConfig));
    // Clear cached perks in session storage so they recompute
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('baxc_perks_')) sessionStorage.removeItem(key);
    }
    window.location.reload(); // Hard reload to apply global config changes
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 pointer-events-none">
      <div className="absolute inset-0 bg-charcoal-dark/95 backdrop-blur-xl pointer-events-auto" onClick={onClose} />
      
      <div className="glass-panel w-full max-w-5xl h-[85vh] flex flex-col relative z-10 pointer-events-auto overflow-hidden border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header & Tabs */}
        <div className="px-6 py-4 border-b border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-pixel text-lg text-gold gold-glow uppercase tracking-tighter">Terminal Config</h2>
            <div className="h-4 w-px bg-gold/10 hidden sm:block" />
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
              ID: {selectedIds.length}/{maxSquad} ACTIVE UNIT(S)
            </span>
          </div>

          <div className="flex bg-charcoal-dark/50 p-1 rounded-lg border border-gold/5">
            <button
              onClick={() => setActiveTab('squad')}
              className={`px-4 py-2 font-pixel text-[8px] rounded transition-all duration-300 ${activeTab === 'squad' ? 'bg-gold text-charcoal-dark shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-gray-500 hover:text-gold'}`}
            >
              SQUAD SELECT
            </button>
            <button
              onClick={() => setActiveTab('perks')}
              className={`px-4 py-2 font-pixel text-[8px] rounded transition-all duration-300 ${activeTab === 'perks' ? 'bg-gold text-charcoal-dark shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-gray-500 hover:text-gold'}`}
            >
              ACTIVE PERKS
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('system')}
                className={`px-4 py-2 font-pixel text-[8px] rounded transition-all duration-300 ${activeTab === 'system' ? 'bg-danger text-white shadow-[0_0_15px_rgba(255,65,54,0.3)]' : 'text-gray-500 hover:text-danger'}`}
              >
                SYS TUNING
              </button>
            )}
          </div>
          
          <button onClick={onClose} className="hidden sm:block text-gold/40 hover:text-gold text-2xl px-2">&times;</button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold/10">
          {activeTab === 'squad' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {nfts.map((nft) => {
                const isSelected = selectedIds.includes(nft.identifier);
                const canSelect = isSelected || selectedIds.length < maxSquad;
                const perksPreview = computePerks(parseNFTAttributes(nft)).activePerks;

                return (
                  <div
                    key={nft.identifier}
                    onClick={() => canSelect && onToggle(nft.identifier)}
                    className={`
                      relative group cursor-pointer transition-all duration-300 p-2 rounded-xl border
                      ${isSelected ? 'bg-gold/5 border-gold/40 scale-[1.02]' : 'bg-charcoal-dark/50 border-gold/5 opacity-60 hover:opacity-100'}
                      ${!canSelect && !isSelected ? 'cursor-not-allowed opacity-20' : ''}
                    `}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                      <img src={nft.url || nft.thumbnailUrl} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 border-4 border-gold/50 rounded-lg pointer-events-none" />
                      )}
                    </div>
                    <div className="font-pixel text-[7px] text-gray-300 mb-2 truncate">{nft.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {perksPreview.slice(0, 2).map((p, i) => (
                        <span key={i} className="font-mono text-[7px] text-gold/60 py-0.5 px-1 bg-gold/5 rounded border border-gold/10">
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'perks' && (
            <div className="max-w-2xl mx-auto space-y-8 py-10">
              <div className="text-center mb-10">
                <h3 className="font-pixel text-gold mb-2 uppercase">Squad Capability Report</h3>
                <p className="font-mono text-[10px] text-gray-500">Aggregated performance buffs from your active squad</p>
              </div>
              
              <div className="grid gap-4">
                {activePerks.length > 0 ? activePerks.map((p, i) => (
                  <div key={i} className="glass-panel p-4 flex items-center justify-between border-gold/10">
                    <span className="font-mono text-xs text-gold uppercase tracking-widest">{p.perk.replace(/_/g, ' ')}</span>
                    <span className="font-pixel text-[10px] text-white underline decoration-gold/30">{p.label}</span>
                  </div>
                )) : (
                  <div className="text-center py-20 opacity-30">
                    <div className="font-pixel text-2xl mb-4">⚠️</div>
                    <div className="font-pixel text-[10px]">NO ACTIVE SQUAD</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <div className="space-y-10 py-6">
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
                <p className="font-mono text-[10px] text-danger-light uppercase tracking-tighter">
                  Warning: System tuning modifies the core game balance for all users via your local storage override.
                </p>
              </div>
              
              {Object.entries(traitConfig).map(([category, traits]) => (
                <div key={category} className="space-y-4">
                  <h4 className="font-pixel text-[10px] text-gold border-b border-gold/10 pb-2">{category}</h4>
                  <div className="grid gap-3">
                    {Object.entries(traits).map(([traitName, perkDef]) => (
                      <div key={traitName} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center glass-panel p-3 border-gold/5">
                        <span className="sm:col-span-2 font-mono text-[10px] text-gray-400">{traitName}</span>
                        <select
                          value={perkDef.perk}
                          onChange={(e) => handleAdminPerkChange(category, traitName, 'perk', e.target.value)}
                          className="sm:col-span-3 bg-charcoal-dark border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-gold"
                        >
                          {Object.keys(PERK_DEFAULTS).map((pt) => (
                            <option key={pt} value={pt}>{pt}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          value={perkDef.value}
                          onChange={(e) => handleAdminPerkChange(category, traitName, 'value', e.target.value)}
                          className="sm:col-span-2 bg-charcoal-dark border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-gold"
                        />
                        <input
                          type="text"
                          value={perkDef.label}
                          onChange={(e) => handleAdminPerkChange(category, traitName, 'label', e.target.value)}
                          className="sm:col-span-5 bg-charcoal-dark border border-gold/10 rounded px-2 py-1 text-[10px] font-mono text-gold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold/10 bg-charcoal-dark/50 flex justify-between items-center">
          <div className="font-mono text-[9px] text-gray-500 uppercase">
            {activeTab === 'system' ? 'Changes require local reload' : 'Auto-saves squad configuration'}
          </div>
          <div className="flex gap-4">
            {activeTab === 'system' ? (
              <button 
                onClick={saveAdminConfig}
                className="btn-pixel bg-danger hover:bg-danger-light text-white px-8"
              >
                COMMIT CHANGES
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="btn-pixel px-12"
              >
                PROCEED TO JUNGLE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
