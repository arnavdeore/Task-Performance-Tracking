# Slate

A personal job tracking and performance portal. Each task has a tentative deadline (own target, can move) and a fixed deadline (committed), and the app shows how performance holds up against both.

Live site: https://arnavdeore.github.io/Task-Performance-Tracking/

## Built with
- React 19, TypeScript and Vite
- Tailwind CSS 4
- react-router-dom (HashRouter, so it works on GitHub Pages)
- Supabase (database and sign-in) — planned for Phase 3; the screens use mock data for now

## Run it on your computer
```
npm install
npm run dev
```
Then open http://localhost:5173/Task-Performance-Tracking/ (the base path is required).

## Useful commands
| Command | What it does |
|---|---|
| `npm run dev` | Start the local site |
| `npm run build` | Type-check and build (run before every commit) |
| `npm run lint` | Check the code with Oxlint |
| `node src/lib/thoughts.test.mjs` | Test the thought-of-the-moment library |

## Deploy
Every push to `main` is built and published to GitHub Pages by GitHub Actions.

## More
- `CLAUDE.md` — project decisions, phases and progress
- `docs/design-notes.md` — design system and screen behaviour
- `design/` — the approved design files
