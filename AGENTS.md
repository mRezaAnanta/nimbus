# Nimbus: agent & contributor guide

Nimbus is an open-source, game-like website for learning cloud computing from zero,
interactively. A cloud mascot named **Nim** guides the learner (Clash-of-Clans vibe).
Every game metaphor is tied to reality through Nim's reactions.

## Commands (use **bun**)

```bash
bun run dev       # dev server (the maintainer usually runs this; don't auto-start it)
bun run check     # svelte-check typecheck; run this to verify changes
bun run build     # production build
bun run lint      # prettier + eslint
bun run format    # prettier --write
```

After editing, run `bun run check`. It must report **0 errors, 0 warnings**.

## Stack

SvelteKit, Svelte 5 (runes mode), TypeScript, Tailwind CSS v4, adapter-auto.

## Architecture: three layers

1. **Content** (`src/lib/chapters/`): the curriculum. Pure data plus which stage to use.
2. **Components** (`src/lib/components/`): reusable UI. Call these; don't duplicate.
3. **Routes** (`src/routes/`): thin glue. URL changes per lesson; the shell stays.

### Content layer: one folder per chapter, one folder per lesson

```
src/lib/chapters/
  types.ts                  # shared types (Lesson, Chapter, *Text interfaces)
  index.ts                  # registry: chapters[] + getChapter()
  foundations/              # a chapter
    index.ts                # chapter meta: number, title {id,en}, lessons[], summary {id,en}
    server/                 # a lesson (one folder)
      index.ts              #   CONTENT/config: id, mood, stage component, ties text together
      id.ts                 #   LANGUAGE: Bahasa Indonesia strings
      en.ts                 #   LANGUAGE: English strings
    cloud/  { index.ts, id.ts, en.ts }
    region/ { index.ts, id.ts, en.ts }
```

**Language is separated from content.** A lesson's `index.ts` holds structure only
(id, mood, which `*Stage.svelte`). All text lives in `id.ts` and `en.ts`, each exporting
an object of the same shape (typed by a `*Text` interface in `types.ts`).

### Routes

```
src/routes/
  +layout.svelte               # global: imports layout.css (theme + fonts)
  +page.ts                     # redirect "/" to the first chapter's first lesson
  [chapter]/
    +layout.svelte             # the SHELL: background, header, language toggle, progress
    +page.ts                   # redirect "/<chapter>" to its first lesson
    [lesson]/
      +page.ts                 # validate params, return {chapterId, lessonId, index, total}
      +page.svelte             # the player: title HUD, stage, Nim bubble, nav (goto)
    done/
      +page.ts                 # validate chapter
      +page.svelte             # chapter completion summary
```

`load` returns only serializable data (ids/indices), never the stage component.
The `+page.svelte` imports the registry (`getChapter`) to resolve the component and text.

## Dialogue & flow

The landing page (`src/routes/+page.svelte`) is Nim's intro: paged welcome lines, then Nim
glides toward the corner and routes into the first lesson.

Inside a lesson, Nim's text has two parts in `lesson.text[lang]`:

- **`intro: string[]`** — narrative beats. The **Next** button paginates them one at a time so
  text never gets too long. On the last beat, Next advances the lesson (or to `/done`). Don't
  write "click Next" inside the copy.
- **`reactions: Record<token,string>`** — shown when the user acts on the stage; a reaction
  temporarily overrides the current beat. Stages emit tokens via `onstate(token)`:
  - `ServerStage` -> `served`; `CloudStage` -> `home`/`cloud` (first click) then `both`;
    `RegionStage` -> `near`/`mid`/`far` (by latency).

Next is disabled only on the last beat until the stage's interaction is complete
(`oncomplete`). Teaching is woven into the beats/reactions; there is intentionally **no
"Di dunia nyata" toggle**. Tone: detailed but compact, storytelling.

## Stage component contract

A stage lives in `src/lib/components/stages/*Stage.svelte` and accepts:

```ts
let { text, oncomplete, onstate }: {
  text: LessonText;            // cast to your specific type: const tx = $derived(text as ServerText)
  oncomplete?: () => void;     // call once the step is satisfied (unlocks "Next")
  onstate?: (s: string) => void; // call with a dialog token on each meaningful action
} = $props();
```

## Recipes

**Add a lesson to a chapter**
1. `mkdir src/lib/chapters/<chapter>/<lesson>` with `index.ts`, `id.ts`, `en.ts`.
2. Reuse a stage or add one in `src/lib/components/stages/`. Add its `*Text` interface in `types.ts`.
3. Append the lesson to the chapter's `lessons[]` in `<chapter>/index.ts`. It gets a URL automatically.

**Add a chapter**
1. `mkdir src/lib/chapters/<chapter>/` with `index.ts` (Chapter meta) plus lesson folders.
2. Register it in `src/lib/chapters/index.ts` (the `chapters` array, in order).

**Add a language**
1. Add the code to `Lang` and the `ui` dict in `src/lib/i18n.ts`.
2. Add `<lang>.ts` to every lesson folder and a key in every chapter's `title` and `summary`.

## Maps

The Region stage has two views with a toggle (`src/lib/components/stages/RegionStage.svelte`):

- **Flat (default)**: the generated `WorldMap.svelte` (Natural Earth 110m, equirectangular,
  960 x 373.33 viewBox). Pins use hand-tuned `fx/fy` + `labelPos`. Regenerate the map with
  `bun scripts/generate-worldmap.mjs`.
- **Globe**: a draggable orthographic globe via `d3-geo` using `src/lib/data/land-110m.json`.
  Drag spins it (`rotate`); far-side points are hidden via `geoDistance`; the latency line is a
  great-circle `LineString`.

Each region stores both `lon/lat` (globe) and `fx/fy/labelPos` (flat). Pins have no focus
outline (`outline: none`).

## Design rules (non-negotiable)

- **No dashes anywhere.** That means no dashed lines/borders, and no em dash or middle-dot
  separators in copy. Write like a human: use commas, full sentences, colons, or parentheses.
- Minimalist, clean, calm. **Not "AI-looking"**: no purple gradients, no emoji spam.
- Full-screen and responsive (mobile stacks: title, then stage, then Nim).
- **Nim is a separate character** at bottom-left with a **cloud-shaped speech bubble**.
- The **lesson title is a HUD element** (top-center), OUTSIDE the bubble.
- Palette and fonts are tokens in `src/routes/layout.css` (`@theme`): accent `brand`, plus
  `grass` / `amber` / `danger`. Fonts: Fraunces (display) and Inter (sans).
- Start every topic from absolute zero; assume the learner knows nothing.
