import { useState, useEffect, useCallback } from 'react';
import type { Score, PlayerPerks } from '../types';

interface UseLeaderboardReturn {
  scores: Score[];
  loading: boolean;
  error: string | null;
  submitScore: (data: {
    address: string;
    herotag: string | null;
    score: number;
    bananas: number;
    distance: number;
    perks: Partial<PlayerPerks>;
  }) => Promise<void>;
  refetch: () => void;
}

export function useLeaderboard(limit = 50): UseLeaderboardReturn {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/scores?limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch scores');
      const data = await res.json();
      setScores(data.scores || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const submitScore = useCallback(async (data: {
    address: string;
    herotag: string | null;
    score: number;
    bananas: number;
    distance: number;
    perks: Partial<PlayerPerks>;
  }) => {
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit score');
      // Refetch after submit
      await fetchScores();
    } catch (err) {
      console.error('Score submit error:', err);
    }
  }, [fetchScores]);

  return { scores, loading, error, submitScore, refetch: fetchScores };
}
