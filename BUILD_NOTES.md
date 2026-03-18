# Build Notes — Monkey Jump Web3

## Files Created

### Root Config
- `package.json` — Dependencies: React 18, sdk-dapp v5.6.22, sdk-core v15.4, Vite 5, Tailwind 3
- `tsconfig.json` + `tsconfig.node.json` — TypeScript strict mode, bundler resolution
- `vite.config.ts` — React plugin, global polyfills for sdk-dapp compatibility
- `tailwind.config.js` — Custom jungle theme colors + pixel/mono fonts
- `postcss.config.js` — Tailwind + autoprefixer
- `vercel.json` — Node 20 runtime for API, SPA rewrites
- `index.html` — Entry with Google Fonts preconnect

### Source (`src/`)
- `main.tsx` — Calls `initApp()` from sdk-dapp before rendering React
- `App.tsx` — BrowserRouter with 3 routes: /, /game, /leaderboard
- `config.ts` — NFT collection ID, trait-to-perk mapping, perk computation, base64 attribute parser
- `types.ts` — PlayerPerks, Score, NFTData, GameOverData interfaces
- `index.css` — Tailwind layers + glass-panel, btn-pixel, perk-badge utilities

### Pages
- `LoginPage.tsx` — Three login methods via ProviderFactory (extension, walletConnect, crossWindow)
- `GamePage.tsx` — NFT gate check, perk display, game iframe, score submission, admin config toggle
- `LeaderboardPage.tsx` — Top 50 scores table with rank medals

### Components
- `PerkBadges.tsx` — Color-coded perk badges with icons, deduplication by perk type
- `Leaderboard.tsx` — Sortable score table with rank styling, perk icons, current-player highlight
- `TraitConfigModal.tsx` — Admin modal: edit perk type/value/label per trait, save to localStorage

### Hooks
- `useNFTGate.ts` — Fetches NFTs from MultiversX API, parses traits, computes perks, caches in sessionStorage
- `useLeaderboard.ts` — GET/POST scores with refetch

### Game
- `MonkeyGame.tsx` — iframe bridge: sends INIT_PERKS via postMessage, listens for GAME_OVER

### Game iframe (`public/game/`)
- `index.html` — Full game adapted from monkey-jump with:
  - postMessage listener for INIT_PERKS (receives perks from parent)
  - postMessage dispatch for GAME_OVER (sends score data to parent)
  - Perk integration: extra lives, invincible jumps, hitbox forgiveness, low gravity, banana multiplier, shield/speed boost duration
  - Debug overlay hidden by default (D key toggles)
- `assets/` — Copied sprites from original game

### API (Vercel Serverless)
- `api/scores.js` — In-memory leaderboard (GET sorted + POST with validation, caps at 500 entries)
- `api/verify-nft.js` — Server-side NFT ownership check + perk computation

## SDK Compatibility Notes

**@multiversx/sdk-dapp v5.6.22** has a completely different API from v3.x:
- No React UI components (ExtensionLoginButton, etc.) — these moved to `@multiversx/sdk-dapp-ui` (Stencil web components)
- Login is done programmatically: `ProviderFactory.create({ type: 'extension' })` then `.login()`
- Logout: `ProviderFactory.destroy()`
- Initialization: `initApp()` from `@multiversx/sdk-dapp/out/methods/initApp/initApp`
- Hooks: `@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn` and `useGetAccountInfo`
- Types: `@multiversx/sdk-dapp/out/types/enums.types` for EnvironmentsEnum
- No DappProvider React wrapper needed — `initApp()` sets up the store globally

## Build Output

- TypeScript: 0 errors
- Vite build: successful (7.78s)
- Bundle sizes:
  - vendor: 160 KB (React + router)
  - app: ~1.3 MB (sdk-dapp)
  - sdk-core: ~1.4 MB
- Chunk size warnings are expected due to sdk-dapp/sdk-core bundle sizes

## Known Limitations

1. **Leaderboard persistence**: In-memory store resets on Vercel cold starts. Must swap to a real DB for production.
2. **WalletConnect**: Requires a WalletConnect v2 Project ID from cloud.walletconnect.com for xPortal Mobile.
3. **NFT metadata**: Some NFTs may have attributes as base64-encoded strings instead of structured metadata. The parser handles both formats.
4. **Bundle size**: sdk-dapp + sdk-core add ~2.7 MB to the bundle. Code splitting with dynamic imports could help.
