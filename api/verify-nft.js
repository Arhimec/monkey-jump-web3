// NFT verification endpoint
// POST /api/verify-nft { address }
// Verifies the wallet owns BAXC NFTs and computes perks server-side

const NFT_COLLECTION = 'BAXC-cdf74d';
const MVX_API = 'https://api.multiversx.com';

const TRAIT_PERKS = {
  Fur: {
    Gold:      { perk: 'score_multiplier', value: 2.0 },
    Wave:      { perk: 'score_multiplier', value: 1.75 },
    Dizzy:     { perk: 'score_multiplier', value: 1.75 },
    Tattooed:  { perk: 'score_multiplier', value: 1.5 },
    Rainbow:   { perk: 'extra_life', value: 1 },
    Silver:    { perk: 'extra_life', value: 1 },
  },
  Eyes: {
    Laser:     { perk: 'invincibility_jump', value: 3 },
    TheX:      { perk: 'invincibility_jump', value: 2 },
    EgldVR:    { perk: 'invincibility_jump', value: 2 },
    Egld:      { perk: 'invincibility_jump', value: 2 },
    '3D':      { perk: 'hitbox_forgiveness', value: 12 },
    Techno:    { perk: 'hitbox_forgiveness', value: 10 },
    Hologram:  { perk: 'hitbox_forgiveness', value: 10 },
  },
  Hat: {
    Wizard:    { perk: 'banana_multiplier', value: 3 },
    DJ:        { perk: 'banana_multiplier', value: 3 },
    LadyX:     { perk: 'banana_multiplier', value: 2 },
    WW2Pilot:  { perk: 'banana_multiplier', value: 2 },
    TheKing:   { perk: 'banana_multiplier', value: 2 },
    GoldLaurel:{ perk: 'shield_duration', value: 1.5 },
    Viking:    { perk: 'shield_duration', value: 1.5 },
  },
  Clothes: {
    BlackBaxc: { perk: 'extra_life', value: 2 },
    BaxcTshirt:{ perk: 'extra_life', value: 1 },
    TheX:      { perk: 'extra_life', value: 2 },
    Astronaut: { perk: 'low_gravity', value: 0.7 },
    KingXRobe: { perk: 'low_gravity', value: 0.75 },
  },
  Background: {
    XBackground: { perk: 'speed_boost_duration', value: 1.75 },
  },
};

function parseNFTAttributes(nft) {
  if (nft.metadata?.attributes?.length > 0) {
    return nft.metadata.attributes;
  }
  if (nft.attributes) {
    try {
      const decoded = Buffer.from(nft.attributes, 'base64').toString('utf-8');
      return decoded.split(';').map((pair) => {
        const [trait_type, value] = pair.split(':');
        return { trait_type: (trait_type || '').trim(), value: (value || '').trim() };
      }).filter(a => a.trait_type && a.value);
    } catch { /* ignore */ }
  }
  return [];
}

function computePerks(allTraits) {
  const perks = {
    score_multiplier: 1.0,
    extra_life: 0,
    invincibility_jump: 0,
    hitbox_forgiveness: 0,
    banana_multiplier: 1,
    shield_duration: 1.0,
    low_gravity: 1.0,
    speed_boost_duration: 1.0,
  };

  for (const trait of allTraits) {
    const category = TRAIT_PERKS[trait.trait_type];
    if (!category) continue;
    const perkDef = category[trait.value];
    if (!perkDef) continue;

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

  return perks;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { address } = req.body || {};
  if (!address) return res.status(400).json({ error: 'Missing address' });

  try {
    const url = `${MVX_API}/accounts/${address}/nfts?collections=${NFT_COLLECTION}&size=100`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`MultiversX API error: ${response.status}`);

    const nfts = await response.json();
    const hasAccess = nfts.length > 0;
    const allTraits = nfts.flatMap(parseNFTAttributes);
    const perks = computePerks(allTraits);

    return res.status(200).json({ hasAccess, nfts, perks });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
