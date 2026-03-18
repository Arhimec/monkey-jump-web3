import type { Score } from '../types';
import { PERK_DEFAULTS } from '../config';

interface LeaderboardProps {
  scores: Score[];
  loading: boolean;
  currentAddress?: string;
}

const PERK_ICONS: Record<string, string> = {
  score_multiplier: '⭐',
  extra_life: '❤️',
  invincibility_jump: '🛡️',
  hitbox_forgiveness: '👁️',
  banana_multiplier: '🍌',
  shield_duration: '🔰',
  low_gravity: '🚀',
  speed_boost_duration: '⚡',
};

function truncateAddress(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function getRankStyle(rank: number): string {
  if (rank === 1) return 'text-banana font-bold';
  if (rank === 2) return 'text-gray-300 font-bold';
  if (rank === 3) return 'text-amber-600 font-bold';
  return 'text-gray-400';
}

function getRankLabel(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

export function LeaderboardTable({ scores, loading, currentAddress }: LeaderboardProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-jungle-green font-pixel text-sm">
          Loading scores...
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 font-pixel text-sm">
          No scores yet. Be the first!
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-jungle-green/30">
            <th className="text-left py-3 px-2 font-pixel text-xs text-jungle-green">Rank</th>
            <th className="text-left py-3 px-2 font-pixel text-xs text-jungle-green">Player</th>
            <th className="text-right py-3 px-2 font-pixel text-xs text-banana">Score</th>
            <th className="text-right py-3 px-2 font-pixel text-xs text-amber-400">🍌</th>
            <th className="text-right py-3 px-2 font-pixel text-xs text-gray-400">Dist</th>
            <th className="text-center py-3 px-2 font-pixel text-xs text-gray-400">Perks</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, i) => {
            const rank = i + 1;
            const isMe = currentAddress && score.address === currentAddress;
            return (
              <tr
                key={`${score.address}-${score.timestamp}`}
                className={`border-b border-jungle-green/10 transition-colors ${
                  isMe ? 'bg-jungle-green/10' : 'hover:bg-jungle-green/5'
                }`}
              >
                <td className={`py-3 px-2 font-pixel text-xs ${getRankStyle(rank)}`}>
                  {getRankLabel(rank)}
                </td>
                <td className="py-3 px-2 font-mono text-xs">
                  <span className={isMe ? 'text-jungle-green' : 'text-white'}>
                    {score.herotag ? `@${score.herotag}` : truncateAddress(score.address)}
                  </span>
                  {isMe && <span className="ml-2 text-jungle-green text-[10px]">(you)</span>}
                </td>
                <td className="py-3 px-2 text-right font-mono text-xs text-banana font-bold">
                  {score.score.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right font-mono text-xs text-amber-400">
                  {score.bananas}
                </td>
                <td className="py-3 px-2 text-right font-mono text-xs text-gray-400">
                  {score.distance}m
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="flex justify-center gap-0.5">
                    {score.perks && Object.entries(score.perks).map(([key, val]) => {
                      const def = PERK_DEFAULTS[key as keyof typeof PERK_DEFAULTS];
                      if (val === def || val === undefined) return null;
                      return (
                        <span key={key} title={key} className="text-xs">
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
