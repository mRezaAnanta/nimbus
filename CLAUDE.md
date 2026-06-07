# CLAUDE.md

Read **[AGENTS.md](./AGENTS.md)**. It is the single source of truth for this project
(architecture, folder layout, how to add chapters/lessons/languages, and the design rules).

Quick reminders for Claude:

- Package manager is **bun**. Verify changes with `bun run check` (must be 0 errors, 0 warnings).
- Do **not** auto-start the dev server. The maintainer runs `bun run dev` themselves.
- **Never use dashes.** No dashed lines or borders, and no em dash or middle-dot separators
  in copy. Write like a human (commas, full sentences, colons, parentheses).
- Content and language are **separated per lesson**: `<lesson>/index.ts` is config,
  `<lesson>/id.ts` and `<lesson>/en.ts` are text. Shared UI lives in `src/lib/components/`.
- Nim's dialogue is **reactive**: stages call `onstate(token)`; text comes from
  `lesson.text[lang].dialog[token]`. No "Di dunia nyata" toggle.
