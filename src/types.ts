export interface PlayerPerks {
  score_multiplier: number;
  extra_life: number;
  invincibility_jump: number;
  hitbox_forgiveness: number;
  banana_multiplier: number;
  shield_duration: number;
  low_gravity: number;
  speed_boost_duration: number;
}

export interface PerkLabel {
  perk: keyof PlayerPerks;
  value: number;
  label: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTData {
  identifier: string;
  name: string;
  attributes: string; // base64 encoded
  metadata?: {
    attributes?: NFTAttribute[];
  };
  url?: string;
  thumbnailUrl?: string;
}

export interface Score {
  address: string;
  herotag: string | null;
  score: number;
  bananas: number;
  distance: number;
  perks: Partial<PlayerPerks>;
  timestamp: number;
}

export interface NFTGateResult {
  hasAccess: boolean;
  nfts: NFTData[];
  perks: PlayerPerks;
  activePerks: PerkLabel[];
}

export interface GameOverData {
  score: number;
  bananas: number;
  distance: number;
}
