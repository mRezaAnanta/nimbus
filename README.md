# ☁️ Nimbus

**Learn cloud computing by playing.** Nimbus is an open-source, game-like website that teaches
cloud from absolute zero, interactively. A cloud mascot named **Nim** guides you, and every
concept is something you try yourself rather than just read about.

Inspired by Skill Builder, but built like a game: bite-sized story beats, hands-on stages, and
real-world explanations woven into the play.

## What's inside (Chapter 1: Foundations)

1. **What is a server?** see a request go out and a page come back.
2. **What is the cloud?** on-premise vs cloud, and what the cloud actually is.
3. **What is a Region?** place your server on a real world map / spinnable globe and feel latency.

More chapters (Availability Zones, scaling, security, and beyond) are on the way.

## Tech stack

SvelteKit, Svelte 5 (runes), TypeScript, Tailwind CSS v4, d3-geo, and **bun**.

## Run it locally

```sh
bun install
bun run dev
```

Then open the printed URL. Other scripts: `bun run check` (typecheck), `bun run build`, `bun run lint`.

## Contributing

Content lives as plain data per chapter in `src/lib/chapters/`, with language and content
separated per lesson (`index.ts` for config, `id.ts` / `en.ts` for text). Adding a lesson,
chapter, or language doesn't require touching the engine. See **[AGENTS.md](./AGENTS.md)** for
the architecture and step-by-step recipes, and **[CURRICULUM.md](./CURRICULUM.md)** for the
full lesson roadmap and what is left to build.

Currently bilingual: Indonesian and English.

## Data credits

- World map: [Natural Earth](https://www.naturalearthdata.com/) (public domain), via `bun scripts/generate-worldmap.mjs`.
- Region boundaries (Virginia, Singapore) for the Availability Zone lesson: [Natural Earth](https://www.naturalearthdata.com/) (public domain), via `bun scripts/generate-region-shapes.mjs`.
- Undersea cables and landing stations: [TeleGeography Submarine Cable Map](https://www.submarinecablemap.com/), via `bun scripts/generate-cables.mjs`. Shown with attribution in the Cable lesson. The data packet routes are generated from the real cable graph; check that they follow actual cables with `bun scripts/verify-routes.mjs`.

## License

MIT (code). Bundled map data keeps the license of its source listed under Data credits.
