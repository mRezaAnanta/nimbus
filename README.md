# ☁️ Nimbus

**Learn cloud computing by playing.** Nimbus is an open-source, game-like website that teaches
cloud from absolute zero, interactively. A mascot named **Nim** guides you, and every concept is
something you try on a live stage, not just read about.

**Live: [nimbus.farhanaulianda.my.id](https://nimbus.farhanaulianda.my.id)**. Bilingual
(Indonesian and English), no sign-up, works on phone or desktop.

## What's inside

**Part 1, Core Concepts** is fully playable: six provider-neutral chapters that teach the ideas
first, ending at a **Provider Tracks** gateway where you pick AWS, Google Cloud, or Azure.
**Part 2**, the per-provider tracks, is on the way.

See **[CURRICULUM.md](./CURRICULUM.md)** for the full lesson-by-lesson roadmap.

## How it works

Each lesson is a few short story beats from Nim, then an interactive stage you actually play with.
You place a server on a spinnable globe and watch the latency change, ride a data packet along
real undersea cables, knock out a data center and see the site fail or survive, trim a cloud bill,
and more. Progress is saved in your browser and lessons unlock in order.

## Tech stack

SvelteKit, Svelte 5 (runes mode), TypeScript, Tailwind CSS v4, d3-geo, and **bun**.

## Run locally

```sh
bun install
bun run dev
```

Then open the printed URL. Other scripts: `bun run check` (typecheck, kept at zero errors and
warnings), `bun run build`, and `bun run lint`.

## Contributing

Content lives as plain data per chapter in `src/lib/chapters/`, with language separated from
content per lesson (`index.ts` for config, `id.ts` and `en.ts` for text). Adding a lesson,
chapter, or language never touches the engine. See **[AGENTS.md](./AGENTS.md)** for the
architecture, the design rules, and step-by-step recipes.

## Credits

- World map: [Natural Earth](https://www.naturalearthdata.com/) (public domain), via `bun scripts/generate-worldmap.mjs`.
- Region boundaries (Availability Zone lesson): [Natural Earth](https://www.naturalearthdata.com/) (public domain), via `bun scripts/generate-region-shapes.mjs`.
- Undersea cables and landing stations: [TeleGeography Submarine Cable Map](https://www.submarinecablemap.com/), via `bun scripts/generate-cables.mjs`, shown with attribution in the Cable lesson.
- Provider logos are trademarks of their respective owners (Amazon Web Services, Microsoft Azure, Google Cloud) and are used only to identify each provider.

## License

MIT (code). Bundled map data keeps the license of its source, listed under Credits.
