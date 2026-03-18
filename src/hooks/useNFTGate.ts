import { useState, useEffect, useCallback } from 'react';
import { NFT_COLLECTION, MVX_API, PERK_DEFAULTS, computePerks, parseNFTAttributes } from '../config';
import type { NFTData, NFTGateResult, PlayerPerks, PerkLabel } from '../types';

const CACHE_KEY_PREFIX = 'baxc_perks_';

interface UseNFTGateReturn {
  loading: boolean;
  error: string | null;
  hasAccess: boolean;
  nfts: NFTData[];
  perks: PlayerPerks;
  activePerks: PerkLabel[];
  herotag: string | null;
  refetch: () => void;
}

export function useNFTGate(address: string | undefined): UseNFTGateReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NFTGateResult>({
    hasAccess: false,
    nfts: [],
    perks: { ...PERK_DEFAULTS },
    activePerks: [],
  });
  const [herotag, setHerotag] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Check sessionStorage cache
    const cacheKey = CACHE_KEY_PREFIX + address;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as NFTGateResult & { herotag: string | null };
        setResult(parsed);
        setHerotag(parsed.herotag);
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    try {
      // Fetch NFTs and account info in parallel
      const [nftRes, accountRes] = await Promise.all([
        fetch(`${MVX_API}/accounts/${address}/nfts?collections=${NFT_COLLECTION}&size=100`),
        fetch(`${MVX_API}/accounts/${address}`),
      ]);

      if (!nftRes.ok) throw new Error('Failed to fetch NFTs');

      const nfts: NFTData[] = await nftRes.json();
      let herotagValue: string | null = null;

      if (accountRes.ok) {
        const accountData = await accountRes.json();
        herotagValue = accountData.username || null;
      }

      const hasAccess = nfts.length > 0;

      // Collect all traits from all NFTs
      const allTraits = nfts.flatMap(parseNFTAttributes);
      const { perks, activePerks } = computePerks(allTraits);

      const gateResult: NFTGateResult = { hasAccess, nfts, perks, activePerks };
      setResult(gateResult);
      setHerotag(herotagValue);

      // Cache result
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ ...gateResult, herotag: herotagValue }));
      } catch {
        // storage full
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    loading,
    error,
    hasAccess: result.hasAccess,
    nfts: result.nfts,
    perks: result.perks,
    activePerks: result.activePerks,
    herotag,
    refetch: fetchNFTs,
  };
}
