# Pullbell — restock alerts

Pullbell works like the TYPA restock tracker. It watches retailer product pages for hard-to-find collectibles (Pokémon TCG, One Piece TCG, NeeDoh, Pop Mart, Kidrobot, Sonny Angel). When something comes back in stock, it sends an instant push alert that opens the retailer's product page.

It ships as an **iOS and Android app** (Expo) and an **installable web app** (Next.js PWA). Both use the same backend.

## Features

| | Web | iOS / Android |
|---|---|---|
| Live drops feed (every restock detected, newest first, filter by brand, auto-refresh) | ✓ | ✓ |
| Search and "newly added" products | ✓ | ✓ |
| Product page: where to buy (live stock and price per retailer), 7-day restock history grid, latest restocks, eBay/StockX resale links, more from the brand | ✓ | ✓ |
| Brand pages: follow a whole brand, recent drops, all products | ✓ | ✓ |
| Follow a product or brand → push alert on restock; tapping the alert opens the retailer page | Web Push | Expo push |
| No account needed (anonymous device id) | ✓ | ✓ |

## How it works

```
apps/monitor ──checks──▶ retailer pages (Shopify .js endpoints, schema.org JSON-LD)
     │  sold out → in stock = restock event
     ├──▶ Postgres (packages/db)
     └──▶ Web Push / Expo push to every device following the product or its brand

apps/web     Next.js site + JSON API (/api/*) reading the same Postgres
apps/mobile  Expo Router app, talks to apps/web's API
```

- **Restock detection** (`apps/monitor/src/check.ts`): an alert fires only when a listing goes from *sold out* to *in stock*. The first check of a new listing just records a baseline, so adding products never sends a wave of false alerts.
- **Adapters** (`apps/monitor/src/adapters/`):
  - `shopify` reads `https://<store>/products/<handle>.js` (`available`, `price` in cents).
  - `jsonld` reads the schema.org `Product` / `offers.availability` markup most stores embed for Google.
  - Each adapter is a URL mapping plus a pure `parse(body)`. Adding a retailer type means writing one new adapter.
- **Politeness**: listings at the same retailer are checked one after another, 1 second apart. Different retailers are checked in parallel. The default pass interval is 60 seconds.
- **Expired subscriptions** (Web Push 404/410, Expo `DeviceNotRegistered`) are deleted automatically.

## Local development

Requires Node 22+ and Postgres.

```bash
npm install

# 1. Database
createdb pullbell                       # or any Postgres you have
cp packages/db/.env.example packages/db/.env
npm run db:push                          # create tables
npm run db:seed                          # load packages/db/src/catalog.json

# 2. Push keys (one pair, shared by web and monitor)
npx web-push generate-vapid-keys

# 3. Web app + API  →  http://localhost:3000
cp apps/web/.env.example apps/web/.env.local   # fill NEXT_PUBLIC_VAPID_PUBLIC_KEY
npm run dev:web

# 4. Monitor
cp apps/monitor/.env.example apps/monitor/.env # fill the VAPID keys
npm run monitor                                # or: npm start -w @pullbell/monitor -- --once

# 5. Mobile app
cp apps/mobile/.env.example apps/mobile/.env   # EXPO_PUBLIC_API_URL = your web app URL (use your LAN IP for a phone)
npm run dev:mobile
```

Checks: `npm test` (adapter and restock-rule tests) and `npm run typecheck`.

## Push notifications

- **Web**: works in Chrome, Edge, Firefox and Safari. On iPhone it works only after **Share → Add to Home Screen** (iOS 16.4+); the Following page explains this. Local testing needs HTTPS or `localhost`.
- **iOS / Android**: Expo push needs an EAS project and push credentials.
  1. In `apps/mobile`, run `npx eas-cli@latest init`. This writes `extra.eas.projectId` to the app config.
  2. Set up FCM (Android) and APNs (iOS, which needs a paid Apple Developer account) with `eas credentials`, or during the first `eas build`.
  3. Push doesn't work in Expo Go. Use a development build: `eas build --profile development`.

## Adding products

Edit `packages/db/src/catalog.json` (brands, retailers with their `adapter`, products with one or more listing URLs) and run `npm run db:seed` again. Re-seeding updates rows in place and keeps stock state and history.

The seed catalog has 24 real products across 6 brands and 10 retailers (40 listings). All were checked live on 2026-11-11.

## Deploying

- **Postgres**: any managed Postgres (Neon, Supabase, RDS…). Run `npm run db:push` and `npm run db:seed` against it.
- **Web + API**: Vercel (set the root directory to `pullbell/apps/web`), or any Node host. Env: `DATABASE_URL`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
- **Monitor**: a long-running worker (Railway, Fly.io, Render background worker, a small VM) running `npm run monitor`. Alternatively, a scheduler can run `npm start -w @pullbell/monitor -- --once`. Env: see `apps/monitor/.env.example`.
- **Mobile**: `eas build` and `eas submit` for the App Store and Google Play, with `EXPO_PUBLIC_API_URL` pointing at the deployed web app.

## Known limits

- Big-box retailers (Target, Walmart, Amazon, Best Buy, Pokémon Center) use bot protection and client-side rendering. The two included adapters won't read them. Supporting them needs dedicated adapters, and usually their affiliate or product APIs.
- Restock history days are bucketed in the viewer's own time zone. The feed refreshes every 30 seconds; it isn't streamed.

## Name

"Pullbell" ("pull" as in pulling a hit card, "bell" as in the alert) was checked on 2026-11-11:

- No app with that name on the US App Store or Google Play.
- `pullbell.com` and `pullbell.app` were both unregistered.
- No live USPTO word marks for PULLBELL or PULL BELL.

Runner-ups that also passed: Bellpup, Kipbell. This was a knockout search, not a legal clearance. Get a trademark attorney's clearance search before filing, and register the domains and social handles soon.
