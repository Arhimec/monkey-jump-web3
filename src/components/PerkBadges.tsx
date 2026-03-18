import type { PerkLabel, PlayerPerks } from '../types';
import { PERK_DEFAULTS } from '../config';

const PERK_ICONS: Record<keyof PlayerPerks, string> = {
  score_multiplier: '⭐',
  extra_life: '❤️',
  invincibility_jump: '🛡️',
  hitbox_forgiveness: '👁️',
  banana_multiplier: '🍌',
  shield_duration: '🔰',
  low_gravity: '🚀',
  speed_boost_duration: '⚡',
};

const PERK_COLORS: Record<keyof PlayerPerks, string> = {
  score_multiplier: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  extra_life: 'border-red-500/50 bg-red-500/10 text-red-400',
  invincibility_jump: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
  hitbox_forgiveness: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
  banana_multiplier: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
  shield_duration: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  low_gravity: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  speed_boost_duration: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
};

interface PerkBadgesProps {
  perks: PlayerPerks;
  activePerks: PerkLabel[];
  compact?: boolean;
}

export function PerkBadges({ perks, activePerks, compact = false }: PerkBadgesProps) {
  if (activePerks.length === 0) {
    return (
      <div className="text-gray-500 text-xs font-mono">
        No trait perks active
      </div>
    );
  }

  // Deduplicate by showing only the final computed perk values
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

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {shownPerks.map(({ key }) => (
          <span key={key} title={key} className="text-sm">
            {PERK_ICONS[key]}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {shownPerks.map(({ key, label }) => (
        <span
          key={key}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono ${PERK_COLORS[key]}`}
        >
          <span>{PERK_ICONS[key]}</span>
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}
