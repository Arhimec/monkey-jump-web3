# Monkey Jump — BAXC Web3 Edition

A blockchain-gated arcade game for **BAXC NFT holders** on MultiversX. Players connect their xPortal wallet, verify NFT ownership, and enjoy trait-based in-game perks derived from their NFT metadata.

## Quick Start

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build to dist/
```

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — no special config needed
4. The `vercel.json` routes API functions and SPA rewrites automatically
5. Deploy!

> **Note:** The leaderboard uses in-memory storage in serverless functions. Scores reset on cold starts. See [Swap to a Real DB](#swap-leaderboard-to-a-real-database) below.

## Configure Admin Wallet Addresses

Edit `src/config.ts` and add wallet addresses to the `ADMIN_ADDRESSES` array:

```typescript
export const ADMIN_ADDRESSES: string[] = [
  'erd1your_admin_address_here...',
];
```

Admin users see a **[Config]** button in the game header that opens the Trait Config Modal, allowing live perk tuning without redeployment. Changes are saved to `localStorage`.

## Swap Leaderboard to a Real Database

The `api/scores.js` endpoint uses an in-memory array (resets on Vercel cold starts). To use a persistent store:

### MongoDB Atlas

```javascript
// api/scores.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('monkeyjump');
const collection = db.collection('scores');

// GET: await collection.find().sort({ score: -1 }).limit(limit).toArray()
// POST: await collection.insertOne(entry)
```

### Supabase

```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET: await supabase.from('scores').select('*').order('score', { ascending: false }).limit(limit)
// POST: await supabase.from('scores').insert(entry)
```

### Vercel KV (Redis)

```javascript
import { kv } from '@vercel/kv';
// Use sorted sets: ZADD / ZREVRANGE
```

## NFT Collection

| Property | Value |
|----------|-------|
| Collection | `BAXC-cdf74d` |
| Network | MultiversX Mainnet |
| API | `https://api.multiversx.com` |
| Gate | Wallet must own >= 1 NFT |

## Trait Perk Reference

### Fur (Score Multiplier / Extra Lives)

| Trait | Perk | Value |
|-------|------|-------|
| Gold | Score Multiplier | 2.0x |
| Wave | Score Multiplier | 1.75x |
| Dizzy | Score Multiplier | 1.75x |
| Tattooed | Score Multiplier | 1.5x |
| Rainbow | Extra Life | +1 |
| Silver | Extra Life | +1 |

### Eyes (Invincibility / Hitbox)

| Trait | Perk | Value |
|-------|------|-------|
| Laser | Invincible Jumps | 3 |
| TheX | Invincible Jumps | 2 |
| EgldVR | Invincible Jumps | 2 |
| Egld | Invincible Jumps | 2 |
| 3D | Hitbox Forgiveness | 12px |
| Techno | Hitbox Forgiveness | 10px |
| Hologram | Hitbox Forgiveness | 10px |

### Hat (Banana Multiplier / Shield)

| Trait | Perk | Value |
|-------|------|-------|
| Wizard | Banana Multiplier | 3x |
| DJ | Banana Multiplier | 3x |
| LadyX | Banana Multiplier | 2x |
| WW2Pilot | Banana Multiplier | 2x |
| TheKing | Banana Multiplier | 2x |
| GoldLaurel | Shield Duration | 1.5x |
| Viking | Shield Duration | 1.5x |

### Clothes (Extra Lives / Gravity)

| Trait | Perk | Value |
|-------|------|-------|
| BlackBaxc | Extra Life | +2 |
| BaxcTshirt | Extra Life | +1 |
| TheX | Extra Life | +2 |
| Astronaut | Low Gravity | 0.7x |
| KingXRobe | Low Gravity | 0.75x |

### Background

| Trait | Perk | Value |
|-------|------|-------|
| XBackground | Speed Boost Duration | 1.75x |

### Perk Stacking Rules

- **score_multiplier**: highest value wins
- **extra_life**: summed (cap: 5)
- **invincibility_jump**: summed (cap: 5)
- **hitbox_forgiveness**: highest value wins
- **banana_multiplier**: highest value wins
- **shield_duration**: highest multiplier wins
- **low_gravity**: lowest value wins (most reduced)
- **speed_boost_duration**: highest multiplier wins

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Blockchain**: @multiversx/sdk-dapp v5 + @multiversx/sdk-core v15
- **Game Engine**: Vanilla Canvas (adapted from Monkey Jump)
- **Styling**: Tailwind CSS v3
- **Backend**: Vercel Serverless Functions (Node.js 20)

## Project Structure

```
monkey-jump-web3/
├── index.html                  # Entry HTML
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── vercel.json                 # Vercel routing & functions
├── src/
│   ├── main.tsx                # initApp() + render
│   ├── App.tsx                 # React Router
│   ├── config.ts               # NFT collection, trait perks, admin config
│   ├── types.ts                # TypeScript types
│   ├── index.css               # Tailwind + custom styles
│   ├── pages/
│   │   ├── LoginPage.tsx       # xPortal wallet connect
│   │   ├── GamePage.tsx        # NFT gate + perks + game iframe
│   │   └── LeaderboardPage.tsx # Score rankings
│   ├── components/
│   │   ├── PerkBadges.tsx      # Visual perk display
│   │   ├── TraitConfigModal.tsx# Admin trait/perk editor
│   │   └── Leaderboard.tsx     # Score table component
│   ├── hooks/
│   │   ├── useNFTGate.ts       # NFT fetch + perk computation
│   │   └── useLeaderboard.ts   # Score CRUD
│   └── game/
│       └── MonkeyGame.tsx      # iframe bridge (postMessage)
├── public/game/
│   ├── index.html              # Standalone game (perk-aware)
│   └── assets/                 # Sprites
└── api/
    ├── scores.js               # GET/POST leaderboard
    └── verify-nft.js           # Server-side NFT verification
```

## WalletConnect Project ID

For xPortal Mobile (WalletConnect) to work, register a project at [cloud.walletconnect.com](https://cloud.walletconnect.com/) and pass the project ID in `src/main.tsx` via the `initApp` config:

```typescript
initApp({
  dAppConfig: {
    environment: EnvironmentsEnum.mainnet,
    providers: {
      walletConnect: {
        walletConnectV2ProjectId: 'YOUR_PROJECT_ID',
      },
    },
  },
});
```

## License

MIT
