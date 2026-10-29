# Cookie Foundry

A cookie-themed incremental game for **arcade.fun**, forked from [remarkablegames/button-clicker](https://github.com/remarkablegames/button-clicker). Hand-bake a cookie, hire a production line, learn recipes, and build a bakery that reaches the stars.

## Play and build

Requires Node.js 24 or newer.

```sh
npm ci --ignore-scripts
npm start
npm test
npm run lint:tsc
npm run build
npm run preview
```

`dist/` is a self-contained static build. Serve it over HTTP(S). Assets use relative URLs, so the game works at a nested arcade.fun games-origin path. No backend, account, analytics, tracking, network API, external font, or paid service is required.

## Included

- Original generated cookie artwork and responsive cocoa-and-cream interface.
- All 16 upstream generator prices and production rates, reskinned as bakery buildings; original 1.15 price growth and bulk buying.
- 12 recipes, 12 achievements, golden-cookie windfalls and 30-second production frenzies.
- Prestige at 1 million cookies earned in a run. Earn square-root-scaled sugar crystals; each adds 5% permanent production and click power.
- Versioned browser saves every 5 seconds and on page exit; export/import JSON backups.
- Offline earnings at 50% normal production, capped at 8 hours. Active frenzy bonuses do not apply offline.
- Keyboard and touch controls, reduced-motion support and modal focus management.

Progress belongs to the browser and origin where you play. Export a backup before changing devices or moving from the preview to arcade.fun. This is a local single-player game; client balances are not authoritative competitive scores.

## Provenance and licensing

Based on Button Clicker commit `83155b439e64c6b9ebea32fb40f8cbac9557e59d`. Original MIT copyright and license are preserved in [LICENSE](LICENSE). The original exponential economy and `calculateNextCost` helper remain. Cookie Foundry replaces the original presentation and persistence architecture and adds the systems described above. See [MODIFICATIONS.md](MODIFICATIONS.md) and [ASSETS.md](ASSETS.md).

Cookie Foundry uses its own code additions, text and art. No Cookie Clicker source, images, audio or branding was copied.
