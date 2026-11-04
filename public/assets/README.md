# Images and logos

Static images for the prototype. Vite serves everything in `public/` from the site root, so `public/assets/logos/...` is available at `/assets/logos/...`.

## What's here

```
assets/
├── logos/
│   ├── Kitman Labs base.png     # Kitman Labs logo
│   └── teams/
│       ├── nba/                 # NBA team logos (bulls.png, celtics.png, ...)
│       └── premier-league/      # Premier League club logos (arsenal.png, chelsea.png, ...)
└── README.md
```

There are no athlete photos. Athlete avatars fall back to initials (see below).

## Using them

Prefer the components, which handle missing images for you:

```jsx
import { LogoImage, PlayerAvatar } from '../components'

<LogoImage type="team" logoId="arsenal" league="premier-league" height={40} />
<PlayerAvatar playerId="123" playerName="Marcus Johnson" size="medium" />
```

Both resolve paths through `src/utils/assetManager.js`. If you need a path directly, use its helpers (`getTeamLogo`, `getOrganizationLogo`, `getPlayerImage`) rather than hardcoding `/assets/...`.

## Missing images

`assetManager.js` expects some folders that don't exist yet (`players/`, `badges/`) and placeholder files that aren't in the repo. In practice:

- Athlete avatars always show the athlete's initials: `getPlayerImage` doesn't look up photos yet, even if you add them
- If a logo file is missing, `LogoImage` shows a "Team" or "Logo" label in its place

So a prototype never breaks for want of an image, but add real files if a screen needs them.

## Adding images

1. Put the file in the matching folder, creating `badges/` if you need it (athlete photos also need a change to `getPlayerImage` before they show)
2. Name it in lowercase with hyphens: `manchester-city.png`, `athlete-123.jpg`
3. For a new team logo, use `logos/teams/<league>/<team>.png` so `LogoImage` finds it
4. Keep files small: under 500 KB, square for avatars and badges, transparent PNG or SVG for logos
