import type { PerkLabel, PlayerPerks } from '../types';
import { PERK_DEFAULTS } from '../config';

const PERK_ICONS: Record<keyof PlayerPerks, string> = {
  score_multiplier: '✨',
  extra_life: '🦁',
  invincibility_jump: '🛡️',
  hitbox_forgiveness: '👁️',
  banana_multiplier: '🍌',
  shield_duration: '🔰',
  low_gravity: '🚀',
  speed_boost_duration: '⚡',
};

const PERK_COLORS: Record<keyof PlayerPerks, string> = {
  score_multiplier: 'border-gold/30 bg-gold/5 text-gold-light',
  extra_life: 'border-red-500/30 bg-red-500/5 text-red-300',
  invincibility_jump: 'border-blue-400/30 bg-blue-400/5 text-blue-300',
  hitbox_forgiveness: 'border-purple-400/30 bg-purple-400/5 text-purple-300',
  banana_multiplier: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-300',
  shield_duration: 'border-emerald-400/30 bg-emerald-400/5 text-emerald-300',
  low_gravity: 'border-indigo-400/30 bg-indigo-400/5 text-indigo-300',
  speed_boost_duration: 'border-orange-400/30 bg-orange-400/5 text-orange-300',
};

interface PerkBadgesProps {
  perks: PlayerPerks;
  activePerks: PerkLabel[];
  compact?: boolean;
}

export function PerkBadges({ perks, activePerks, compact = false }: PerkBadgesProps) {
  if (activePerks.length === 0) {
    return (
      <div className="text-gray-600 text-[10px] font-mono tracking-wider">
        NO ACTIVE PERKS
      </div>
    );
  }

  const shownPerks: Array<{ key: keyof PlayerPerks; label: string }> = [];
  const seen = new Set<string>();

  for (const ap of activePerks) {
    if (seen.has(ap.perk)) continue;
    seen.add(ap.perk);

    const value = perks[ap.perk];
    const def = PERK_DEFAULTS[ap.perk];
    if (value !== def) {
      shownPerks.push({ key: ap.perk, label: ap.label });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {shownPerks.map(({ key, label }) => (
        <span
          key={key}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-mono tracking-tight transition-transform hover:scale-105 ${PERK_COLORS[key]}`}
          title={label}
        >
          <span className="opacity-80">{PERK_ICONS[key]}</span>
          <span className="uppercase">{label}</span>
        </span>
      ))}
    </div>
  );
}
