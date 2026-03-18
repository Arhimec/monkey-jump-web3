import { useState, useEffect } from 'react';
import { TRAIT_PERKS } from '../config';
import type { PerkLabel, PlayerPerks } from '../types';

interface TraitConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PerkType = keyof PlayerPerks;

const PERK_TYPES: PerkType[] = [
  'score_multiplier',
  'extra_life',
  'invincibility_jump',
  'hitbox_forgiveness',
  'banana_multiplier',
  'shield_duration',
  'low_gravity',
  'speed_boost_duration',
];

export function TraitConfigModal({ isOpen, onClose }: TraitConfigModalProps) {
  const [config, setConfig] = useState<Record<string, Record<string, PerkLabel>>>(
    structuredClone(TRAIT_PERKS)
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem('baxc_trait_config');
      if (saved) setConfig(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const handlePerkChange = (
    category: string,
    traitName: string,
    field: 'perk' | 'value' | 'label',
    val: string,
  ) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      if (!next[category]) next[category] = {};
      if (!next[category][traitName]) {
        next[category][traitName] = { perk: 'score_multiplier', value: 1, label: '' };
      }
      if (field === 'perk') {
        next[category][traitName].perk = val as PerkType;
      } else if (field === 'value') {
        next[category][traitName].value = parseFloat(val) || 0;
      } else {
        next[category][traitName].label = val;
      }
      return next;
    });
  };

  const handleSave = () => {
    localStorage.setItem('baxc_trait_config', JSON.stringify(config));
    // Clear cached perks so they recompute
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('baxc_perks_')) sessionStorage.removeItem(key);
    }
    onClose();
  };

  const handleReset = () => {
    localStorage.removeItem('baxc_trait_config');
    setConfig(structuredClone(TRAIT_PERKS));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-panel p-6 max-w-4xl max-h-[85vh] overflow-y-auto w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-lg text-banana">Trait Config</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        {Object.entries(config).map(([category, traits]) => (
          <div key={category} className="mb-6">
            <h3 className="font-pixel text-sm text-jungle-green mb-3 border-b border-jungle-green/30 pb-1">
              {category}
            </h3>
            <div className="space-y-2">
              {Object.entries(traits).map(([traitName, perkDef]) => (
                <div key={traitName} className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-2 font-mono text-xs text-gray-300">{traitName}</span>
                  <select
                    value={perkDef.perk}
                    onChange={(e) => handlePerkChange(category, traitName, 'perk', e.target.value)}
                    className="col-span-3 bg-jungle-dark border border-jungle-green/30 rounded px-2 py-1 text-xs font-mono text-white"
                  >
                    {PERK_TYPES.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={perkDef.value}
                    onChange={(e) => handlePerkChange(category, traitName, 'value', e.target.value)}
                    className="col-span-2 bg-jungle-dark border border-jungle-green/30 rounded px-2 py-1 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={perkDef.label}
                    onChange={(e) => handlePerkChange(category, traitName, 'label', e.target.value)}
                    className="col-span-5 bg-jungle-dark border border-jungle-green/30 rounded px-2 py-1 text-xs font-mono text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3 mt-6 pt-4 border-t border-jungle-green/30">
          <button onClick={handleSave} className="btn-pixel">
            Save Config
          </button>
          <button onClick={handleReset} className="btn-danger">
            Reset to Defaults
          </button>
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm font-mono">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
