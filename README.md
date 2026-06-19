# ScavRaiders — Genesis Allowlist (Next.js + 3D Nexus)

An allowlist landing site for the **ScavRaiders** extraction-survival NFT game, built
around an interactive **3D galaxy world-select**: four faction home-worlds drift as
rotating particle-planets in the Scrap Nexus. Selecting a planet awakens its faction,
themes the whole UI to that faction's color, and opens Genesis registration.

Built with Next.js 14 (App Router) and react-three-fiber / three.js. No paid services,
no database required to run — the allowlist API is a stub you wire to your own store.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# production:
npm run build && npm run start
```

Requires Node 18.18+ (tested on Node 22).

## What's where

```
app/
  layout.js              Root layout, metadata, Google Fonts <link>
  page.js                Client page — holds the selected faction, composes sections
  globals.css            Full theme (HUD / space aesthetic) + all section styles
  api/allowlist/route.js Allowlist submission STUB (see "Going live" below)
components/
  Galaxy.jsx             R3F <Canvas>: starfield, Nexus core, the four planets, camera
  Planet.jsx             One particle-sphere planet w/ glow, hover, select, HTML label
  Console.jsx            The registration form ("Insertion Console"), themed by faction
  Metadata.jsx           Dynamic-metadata trophy with animated counters
  Sections.jsx           StatusBar, Factions, Perks, Roadmap, Footer (mostly static)
lib/
  factions.js            Single source of truth: names, colors, world params, 3D positions
public/
  crew.png               Faction key art (transparent PNG)
```

## Going live (important)

`app/api/allowlist/route.js` currently **validates and returns a generated Raider ID
but does not persist anyone**. Before launch, wire it to a real store — search the file
for `WIRE A REAL STORE HERE`. Options: a database (Supabase/Postgres/Mongo), an allowlist
provider (e.g. Premint), or Mailchimp / a Google Sheet via their API.

## Design / content notes

- Faction data (colors, worlds, traits, planet positions) lives in `lib/factions.js`.
  Change it there and the galaxy, console, and faction cards all update together.
- Fonts load via a `<link>` in `layout.js` (Chakra Petch / Inter / JetBrains Mono).
  `optimizeFonts` is disabled in `next.config.mjs` so builds never require a network
  fetch; remove that line if you want Next to inline/optimize fonts at build time.
- Respects `prefers-reduced-motion`: planet rotation, float, and the autorotating
  camera all stop, and CSS animations are disabled.
- Copy is deliberately framed as **access and community, not financial return**, and the
  footer carries a plain not-an-investment disclaimer. Keep that framing.

## Swapping the art

Replace `public/crew.png`. For per-faction character art, drop images in `public/` and
reference them from the faction cards in `components/Sections.jsx`.
