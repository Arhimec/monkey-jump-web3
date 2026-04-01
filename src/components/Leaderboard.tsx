import type { Score } from '../types';
import { PERK_DEFAULTS } from '../config';

interface LeaderboardProps {
  scores: Score[];
  loading: boolean;
  currentAddress?: string;
}

const PERK_ICONS: Record<string, string> = {
  score_multiplier: '✨',
  extra_life: '🦁',
  invincibility_jump: '🛡️',
  hitbox_forgiveness: '👁️',
  banana_multiplier: '🍌',
  shield_duration: '🔰',
  low_gravity: '🚀',
  speed_boost_duration: '⚡',
};

function truncateAddress(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
}

function getRankStyle(rank: number): string {
  if (rank === 1) return 'text-gold-glow font-bold scale-110';
  if (rank === 2) return 'text-gray-300 font-bold';
  if (rank === 3) return 'text-amber-700 font-bold';
  return 'text-gray-500 font-mono';
}

function getRankLabel(rank: number): JSX.Element | string {
  if (rank === 1) return <span className="text-xl drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return `#${rank}`;
}

export function LeaderboardTable({ scores, loading, currentAddress }: LeaderboardProps) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4" />
        <div className="animate-pulse text-gold/40 font-pixel text-[8px] tracking-[0.3em] uppercase">
          Synchronizing Ledger...
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-20 bg-charcoal-dark/30 rounded-2xl border border-gold/5">
        <div className="text-gray-600 font-pixel text-[10px] uppercase tracking-widest">
          The Hall is Empty. Claim your place.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gold/10">
            <th className="py-4 px-4 font-pixel text-[8px] text-gold/40 uppercase tracking-widest">Rank</th>
            <th className="py-4 px-4 font-pixel text-[8px] text-gold/40 uppercase tracking-widest">Ascender</th>
            <th className="py-4 px-4 font-pixel text-[8px] text-gold/40 text-right uppercase tracking-widest">Peak Score</th>
            <th className="py-4 px-4 font-pixel text-[8px] text-gold/40 text-right uppercase tracking-widest">🍌</th>
            <th className="py-4 px-4 font-pixel text-[8px] text-gold/40 text-right uppercase tracking-widest">Path</th>
            <th className="py-4 px-4 font-pixel text-[8px] text-gold/40 text-center uppercase tracking-widest">Perks</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, i) => {
            const rank = i + 1;
            const isMe = currentAddress && score.address === currentAddress;
            return (
              <tr
                key={`${score.address}-${score.timestamp}`}
                className={`group border-b border-white/5 transition-all duration-300 ${
                  isMe ? 'bg-gold/5' : 'hover:bg-white/[0.02]'
                }`}
              >
                <td className={`py-5 px-4 font-pixel text-xs text-center ${getRankStyle(rank)}`}>
                  {getRankLabel(rank)}
                </td>
                <td className="py-5 px-4">
                  <div className="flex flex-col">
                    <span className={`font-mono text-xs ${isMe ? 'text-gold font-bold' : 'text-white/90 group-hover:text-gold transition-colors'}`}>
                      {score.herotag ? `@${score.herotag}` : truncateAddress(score.address)}
                    </span>
                    {isMe && <span className="text-[8px] text-gold/40 font-pixel uppercase tracking-tighter mt-1">Validated Identity</span>}
                  </div>
                </td>
                <td className="py-5 px-4 text-right">
                  <span className={`font-mono text-sm ${rank <= 3 ? 'text-gold font-bold' : 'text-white/80'}`}>
                    {score.score.toLocaleString()}
                  </span>
                </td>
                <td className="py-5 px-4 text-right font-mono text-xs text-white/50">
                  {score.bananas}
                </td>
                <td className="py-5 px-4 text-right font-mono text-[10px] text-white/40 italic">
                  {score.distance}m
                </td>
                <td className="py-5 px-4">
                  <div className="flex justify-center gap-1.5">
                    {score.perks && Object.entries(score.perks).map(([key, val]) => {
                      const def = PERK_DEFAULTS[key as keyof typeof PERK_DEFAULTS];
                      if (val === def || val === undefined) return null;
                      return (
                        <span key={key} title={key} className="text-xs transition-transform hover:scale-125 opacity-70 hover:opacity-100">
                          {PERK_ICONS[key] || '?'}
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
