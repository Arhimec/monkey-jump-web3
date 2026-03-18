import type { PerkLabel, PlayerPerks } from './types';

export const NFT_COLLECTION = 'BAXC-cdf74d';
export const MVX_API = 'https://api.multiversx.com';

// Hardcoded admin addresses — only these can access the TraitConfigModal
export const ADMIN_ADDRESSES: string[] = [
  // Add admin wallet addresses here, e.g.:
  // 'erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4hu',
];

export const PERK_DEFAULTS: PlayerPerks = {
  score_multiplier: 1.0,
  extra_life: 0,
  invincibility_jump: 0,
  hitbox_forgiveness: 0,
  banana_multiplier: 1,
  shield_duration: 1.0,
  low_gravity: 1.0,
  speed_boost_duration: 1.0,
};

export type TraitCategory = 'Fur' | 'Eyes' | 'Hat' | 'Clothes' | 'Background';

export const TRAIT_PERKS: Record<string, Record<string, PerkLabel>> = {
  Fur: {
    Gold:      { perk: 'score_multiplier', value: 2.0, label: '2× Score' },
    Wave:      { perk: 'score_multiplier', value: 1.75, label: '1.75× Score' },
    Dizzy:     { perk: 'score_multiplier', value: 1.75, label: '1.75× Score' },
    Tattooed:  { perk: 'score_multiplier', value: 1.5, label: '1.5× Score' },
    Rainbow:   { perk: 'extra_life', value: 1, label: '+1 Extra Life' },
    Silver:    { perk: 'extra_life', value: 1, label: '+1 Extra Life' },
  },
  Eyes: {
    Laser:     { perk: 'invincibility_jump', value: 3, label: 'Laser Eyes: 3 invincible jumps' },
    TheX:      { perk: 'invincibility_jump', value: 2, label: 'X Eyes: 2 invincible jumps' },
    EgldVR:    { perk: 'invincibility_jump', value: 2, label: 'EGLD VR: 2 invincible jumps' },
    Egld:      { perk: 'invincibility_jump', value: 2, label: 'EGLD Eyes: 2 invincible jumps' },
    '3D':      { perk: 'hitbox_forgiveness', value: 12, label: '3D Eyes: wider dodge window' },
    Techno:    { perk: 'hitbox_forgiveness', value: 10, label: 'Techno Eyes: wider dodge window' },
    Hologram:  { perk: 'hitbox_forgiveness', value: 10, label: 'Hologram: wider dodge window' },
  },
  Hat: {
    Wizard:    { perk: 'banana_multiplier', value: 3, label: 'Wizard: 3× banana points' },
    DJ:        { perk: 'banana_multiplier', value: 3, label: 'DJ: 3× banana points' },
    LadyX:     { perk: 'banana_multiplier', value: 2, label: 'LadyX: 2× banana points' },
    WW2Pilot:  { perk: 'banana_multiplier', value: 2, label: 'WWII Pilot: 2× banana points' },
    TheKing:   { perk: 'banana_multiplier', value: 2, label: 'The King: 2× banana points' },
    GoldLaurel:{ perk: 'shield_duration', value: 1.5, label: 'Gold Laurel: shield lasts 50% longer' },
    Viking:    { perk: 'shield_duration', value: 1.5, label: 'Viking: shield lasts 50% longer' },
  },
  Clothes: {
    BlackBaxc: { perk: 'extra_life', value: 2, label: 'Black BAXC: +2 Extra Lives' },
    BaxcTshirt:{ perk: 'extra_life', value: 1, label: 'BAXC Tshirt: +1 Extra Life' },
    TheX:      { perk: 'extra_life', value: 2, label: 'The X: +2 Extra Lives' },
    Astronaut: { perk: 'low_gravity', value: 0.7, label: 'Astronaut: low gravity' },
    KingXRobe: { perk: 'low_gravity', value: 0.75, label: 'King X Robe: reduced gravity' },
  },
  Background: {
    XBackground: { perk: 'speed_boost_duration', value: 1.75, label: 'X Background: speed boosts last 75% longer' },
  },
};

/** Load user-overridden trait config from localStorage (admin feature) */
export function getTraitPerks(): Record<string, Record<string, PerkLabel>> {
  try {
    const saved = localStorage.getItem('baxc_trait_config');
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return TRAIT_PERKS;
}

/** Compute final perks from a list of NFT trait arrays */
export function computePerks(
  allTraits: Array<{ trait_type: string; value: string }>,
): { perks: PlayerPerks; activePerks: PerkLabel[] } {
  const traitConfig = getTraitPerks();
  const perks: PlayerPerks = { ...PERK_DEFAULTS };
  const activePerks: PerkLabel[] = [];

  for (const trait of allTraits) {
    const category = traitConfig[trait.trait_type];
    if (!category) continue;
    const perkDef = category[trait.value];
    if (!perkDef) continue;

    activePerks.push(perkDef);

    switch (perkDef.perk) {
      case 'score_multiplier':
        perks.score_multiplier = Math.max(perks.score_multiplier, perkDef.value);
        break;
      case 'extra_life':
        perks.extra_life = Math.min(perks.extra_life + perkDef.value, 5);
        break;
      case 'invincibility_jump':
        perks.invincibility_jump = Math.min(perks.invincibility_jump + perkDef.value, 5);
        break;
      case 'hitbox_forgiveness':
        perks.hitbox_forgiveness = Math.max(perks.hitbox_forgiveness, perkDef.value);
        break;
      case 'banana_multiplier':
        perks.banana_multiplier = Math.max(perks.banana_multiplier, perkDef.value);
        break;
      case 'shield_duration':
        perks.shield_duration = Math.max(perks.shield_duration, perkDef.value);
        break;
      case 'low_gravity':
        perks.low_gravity = Math.min(perks.low_gravity, perkDef.value);
        break;
      case 'speed_boost_duration':
        perks.speed_boost_duration = Math.max(perks.speed_boost_duration, perkDef.value);
        break;
    }
  }

  return { perks, activePerks };
}

/** Parse NFT attributes — either from metadata.attributes or base64-encoded string */
export function parseNFTAttributes(nft: {
  attributes?: string;
  metadata?: { attributes?: Array<{ trait_type: string; value: string }> };
}): Array<{ trait_type: string; value: string }> {
  // Prefer structured metadata
  if (nft.metadata?.attributes && nft.metadata.attributes.length > 0) {
    return nft.metadata.attributes;
  }

  // Fallback: decode base64 semicolon-separated attributes
  if (nft.attributes) {
    try {
      const decoded = atob(nft.attributes);
      return decoded.split(';').map((pair) => {
        const [trait_type, value] = pair.split(':');
        return { trait_type: trait_type?.trim() || '', value: value?.trim() || '' };
      }).filter(a => a.trait_type && a.value);
    } catch {
      // invalid base64
    }
  }

  return [];
}
