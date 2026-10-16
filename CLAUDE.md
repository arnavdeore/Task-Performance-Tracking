# Slate: personal job tracking and performance portal

Owner: Arnav. Single user. Her job mixes development, data cleaning, data management and Power BI dashboards. She enters her own tasks, each with a TENTATIVE deadline (own target, can move) and a FIXED deadline (committed), and wants to analyse her performance against both.

## Decisions already made
- Frontend: React + Vite + Tailwind CSS (installable as a PWA later). TypeScript vs JavaScript: ask Arnav to confirm in Phase 1.
- Backend: Supabase (PostgreSQL + Auth). GitHub Pages is static only, so all data goes through Supabase.
- Hosting: GitHub Pages (github.io). The site is public, so a login screen is required and every table needs Row Level Security.
- Works on desktop and mobile (responsive, not two separate apps).
- Brand: "Slate". Colours: blue, red, green and pastel shades. See docs/design-notes.md.

## Source of truth for the UI
`design/*.dc.html` are the approved design files (exported from a design canvas). They are plain HTML with inline styles plus a small template syntax (see docs/design-notes.md, section "Reading the .dc.html files"). Port the look and behaviour into React components. Match spacing, radii, colours and copy. Do not redesign.

The three desktop pages (Dashboard, Tasks, Performance) deliberately share one page shell, one type scale and one set of nav tabs — docs/design-notes.md spells both out. Build the shell once as `AppShell` + `TopNav`; if the three pages drift apart visually, that is a bug.

Two framework-free libraries are ready to reuse as they are (move both into `src/lib/`):
- `reference/thoughts.js` — the rotating "thought of the moment" (Hindu calendar aware, about 5,300 thoughts, no repeats within a day). `reference/thoughts.test.mjs` is its test: `node reference/thoughts.test.mjs`.
- `reference/holidays.js` — Indian holidays and bank closures for the Dashboard calendar, plus `holidayName()`, `isBankSaturday()` and `holidaysInMonth()` helpers. Fixed-date holidays repeat yearly; movable festivals are stored per year and need a new block added each December.

Still on the older flat style and due a restyle in Phase 2: `Login.dc.html` and the three Mobile screens. Ask Arnav when to do that — the desktop pages are final.

## How to work with Arnav (important)
- Instructor style: explain each step, exact menus/commands, expected result, common mistakes, and why.
- One small step at a time. Wait for her to confirm before the next step. Never skip steps.
- When there is a real choice, compare options with pros and cons first, then recommend one.
- Follow the phases below and finish one before starting the next.
- Plain everyday language. Avoid jargon without explaining it.

## Phases
0. Gather info: check her tools (Node, Git, VS Code, GitHub account, Claude Code).
1. Prepare environment: GitHub repo, Vite + React + Tailwind scaffold, folder structure, GitHub Pages deploy of an empty "Hello Slate" page (HashRouter, Vite `base` set to the repo name).
2. Build the frontend with MOCK data, in this order: app shell + top nav, Dashboard (stat tiles, thought strip, today's tasks, month calendar, deadline watch, performance rings, category donut, this-week strip, latest updates), Tasks (board + Add task and EOD pop-ups), Performance (scorecard, rings, month-by-month, weekly completion, insights, category table), Login, mobile layouts.
3. Supabase: database design (tables, columns, RLS), auth (email + password, public sign-ups disabled), then connect the frontend.
4. Test (metrics maths, validation, mobile), error handling (empty states, failed saves, offline).
5. Improvements: PWA install, export report, Calendar and Reports pages, mobile polish.

## Progress
Claude: update this section every time a step is finished, and tell Arnav what you changed.
- [x] Phase 0: gather info
- [x] Phase 1: prepare environment
- [ ] Phase 2: build the frontend with mock data (in progress)
  - [x] App shell + top nav
  - [ ] Dashboard (built in file order of design/Main.dc.html): [x] greeting + stat tiles, [x] thought strip, [x] Today's tasks (all live on Pages), [x] Performance card (built, waiting for Arnav's browser check); not started: Deadline watch, month calendar, Work by category, This week, Latest updates
  - [ ] Tasks, Performance, Login, mobile layouts

## Hard rules
- Never commit secrets. Only the Supabase URL and anon key go in `VITE_` env vars, and only because Row Level Security restricts every row to the signed-in user. Never use the service-role key in the frontend.
- Keep `.env` out of git; commit `.env.example`.
- Dates: store as ISO dates (YYYY-MM-DD). Show as "13 Oct". Week starts Monday.
- Keep the Tentative (dashed blue outline) and Fixed (solid pink-red) visual language on every page: short form "T 13 Oct" / "F 15 Oct" where space is tight, "Tentative 13 Oct" / "Fixed 15 Oct" where there is room.
- The holiday and festival tables are hand-kept and year-specific. Never guess a festival date in code; add it to `holidays.js` with a source.

## Commands (fill in during Phase 1)
- dev: `npm run dev`
- build: `npm run build`
- deploy: GitHub Actions on push to main (set up in Phase 1)
