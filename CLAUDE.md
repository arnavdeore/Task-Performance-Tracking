# Slate: personal job tracking and performance portal

Owner: Arnav. Single user. Her job mixes development, data cleaning, data management and Power BI dashboards. She enters her own tasks, each with a TENTATIVE deadline (own target, can move) and a FIXED deadline (committed), and wants to analyse her performance against both.

## Decisions already made
- Frontend: React + Vite + Tailwind CSS (installable as a PWA later). TypeScript (confirmed). React 19, Vite 8, Tailwind CSS 4 (CSS-first: tokens live in `@theme` in src/index.css, there is no tailwind.config.js), react-router-dom 7 with HashRouter, Oxlint, npm, Node 24 LTS.
- Backend: Supabase (PostgreSQL + Auth). GitHub Pages is static only, so all data goes through Supabase.
- Hosting: GitHub Pages (github.io). The site is public, so a login screen is required and every table needs Row Level Security.
- Works on desktop and mobile (responsive, not two separate apps).
- Brand: "Slate". Colours: blue, red, green and pastel shades. See docs/design-notes.md.

## Source of truth for the UI
`design/*.dc.html` are the approved design files (exported from a design canvas). They are plain HTML with inline styles plus a small template syntax (see docs/design-notes.md, section "Reading the .dc.html files"). Port the look and behaviour into React components. Match spacing, radii, colours and copy. Do not redesign.

The three desktop pages (Dashboard, Tasks, Performance) deliberately share one page shell, one type scale and one set of nav tabs — docs/design-notes.md spells both out. Build the shell once as `AppShell` + `TopNav`; if the three pages drift apart visually, that is a bug.

Two framework-free libraries now live in `src/lib/` (already moved from `reference/`, which is empty):
- `thoughts.js` (+ `thoughts.d.ts`, test `thoughts.test.mjs`) — the rotating "thought of the moment", Hindu calendar aware, about 5,300 thoughts. `thoughtLib.ts` exports ONE shared instance (`thoughtLib`) used by both the thought strip and the calendar. `thoughtLib.panchang(ms)` gives tithi, month, vara, festival.
- `holidays.js` (+ `holidays.d.ts`) — `HOL_FIXED` and `HOL_BY_YEAR` (public/bank holidays), `FESTIVALS_BY_YEAR` (Hindu festivals that are not holidays), and helpers `holidayName`, `festivalName`, `isBankSaturday`, `bankSaturdayWhich`, `holidaysInMonth`, `festivalsInMonth`. Fixed-date holidays repeat yearly; movable ones are per year and need a new block each December. Only 2026 is filled; other years show none on purpose.

Still on the older flat style and due a restyle in Phase 2: `Login.dc.html` and the three Mobile screens. Ask Arnav when to do that — the desktop pages are final.

## How to work with Arnav (important)
- Instructor style: explain each step, exact menus/commands, expected result, common mistakes, and why.
- One small step at a time. Wait for her to confirm before the next step. Never skip steps.
- Before writing code for a new section, say in two or three lines what you will build and which files you will touch. Then build it. Build ONE section at a time and stop so Arnav can check it in the browser.
- Before telling her to commit, run `npm run build` yourself (it runs `tsc -b`, which is what fails the GitHub deploy). Do not commit or push on your own. Give her the exact commit message and the three commands (`git add .`, `git commit -m "..."`, `git push`) and let her run them, unless she says "commit it for me". Use specific commit messages, never "developed the pages".
- After every finished step, update the Progress section below and say what you changed.
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
- [x] Phase 0: gather info (Node 24 LTS, Git, VS Code, Claude Code, GitHub account).
- [x] Phase 1: prepare environment. Repo `arnavdeore/Task-Performance-Tracking`, Vite + React + TS + Tailwind, HashRouter, GitHub Actions deploy to GitHub Pages. Live: https://arnavdeore.github.io/Task-Performance-Tracking/
- [ ] Phase 2: build the frontend with mock data (in progress)
  - [x] App shell + top nav (`AppShell`, `TopNav`, five tabs: Dashboard, Tasks, Performance, Reports, Settings; no Calendar tab by design). Reports and Settings are still `PagePlaceholder`.
  - [ ] Dashboard, in the file order of design/Main.dc.html (`src/pages/Dashboard.tsx`):
    - [x] Greeting + four stat tiles (`StatTile`)
    - [x] Thought strip (`ThoughtStrip`; the design-review "Preview next" / "Back to now" buttons have been removed)
    - [x] Today's tasks + focus footer (`TodayTasks`)
    - [x] Performance card with rings (`PerformanceCard`)
    - [x] Deadline watch with All / Overdue / Next 7 days filter (`DeadlineWatch`, already takes an optional `category` prop for the donut filter)
    - [x] Month calendar (`MonthCalendar`): holidays, bank 2nd/4th Saturdays, deadline dots, Hindu festivals (lavender), tithi on hover and in the selected-day note. Committed; NOT yet confirmed by Arnav in the browser.
    - [x] Work by category (`WorkByCategory`; the selected category lives in `Dashboard.tsx` and is passed to `DeadlineWatch` as `category`; counts in `categoryCounts`). Built and passes `npm run build`; NOT yet confirmed by Arnav in the browser.
    - [x] This week strip (`WeekStrip`; mock plan/done counts in `src/data/dashboard.ts`, week helpers `mondayIndex`/`weekDates`/`shortDate` in `src/lib/dates.ts`). Built and passes `npm run build`; NOT yet confirmed by Arnav in the browser. 
    - [x] Latest updates (`LatestUpdates`; sample entries in `latestUpdates` in `src/data/dashboard.ts`; the "Write an EOD update" button links to `/tasks`, where the pop-up will open in the Tasks step). Built and passes `npm run build`; NOT yet confirmed by Arnav in the browser. This completes the Dashboard.
    - [ ] NEXT: Tasks page (board + Add task and EOD pop-ups). (Cleanups done: thought strip review buttons removed, Slate favicon, README rewritten.)
    - [ ] Latest updates
  - [ ] Tasks page (board + Add task and EOD pop-ups)
  - [ ] Performance page
  - [ ] Login, then the three Mobile screens (restyle them first; ask Arnav before starting)
- [ ] Phase 3: Supabase. [ ] Phase 4: test and error handling. [ ] Phase 5: improvements.

## Current state and handoff notes (read this first in a new session)
- Last full checkpoint: Dashboard up to the month calendar is built with mock data from `src/data/dashboard.ts` (all mock data for the Dashboard lives in that one file; Phase 3 replaces it with Supabase queries).
- Files by role: `src/components/*` one component per Dashboard section; `src/lib/dates.ts` (greeting, long date); `src/lib/holidays.js` and `thoughts.js` (see above); `src/index.css` (theme tokens + shared classes `.glass .white .nav3 .pillbtn .icobtn .seg .segb .wkh .day`).
- The user's name in the app is Arnav (greeting, top bar). Never write "Aditi" anywhere.
- Dussehra 2026 is Tue 20 Oct (confirmed by Arnav and by Hindu-calendar sources). The old 21 Oct "Vijaya Dashami" entry was removed so the calendar and the thought strip agree.
- The tithi in the calendar is computed (about 6 am) by `thoughts.js`; it can differ by a day from a printed Kalnirnay near tithi changes. Festival dates are hand-kept and sourced. Kalnirnay itself is not machine-readable, so do not claim the data is "from Kalnirnay".

### Gotchas learned the hard way
- Tailwind v4: CSS written outside a `@layer` beats utility classes. The global `a { color }` rule is inside `@layer base` for this reason (outside it, `text-ink` on links lost and card titles turned blue). Put new element-level rules in `@layer base`; shared component classes like `.glass` stay unlayered.
- Write full Tailwind class names (use lookup maps like `{ dev: 'bg-blue-card' }`); class names built from string pieces are not detected.
- The build is strict: `noUnusedLocals`, `verbatimModuleSyntax` (use `import type`), `erasableSyntaxOnly` (no enums). `thoughts.js` and `holidays.js` are plain JS with hand-written `.d.ts`; update the `.d.ts` whenever you add an export, and import them with the `.js` extension.
- `npm run dev` URL is http://localhost:5173/Task-Performance-Tracking/ (the base path is required).
- Windows "LF will be replaced by CRLF" warnings on commit are harmless.
- Design check order per section: look at the matching block in `design/Main.dc.html` (or Tasks/Performance), keep spacing, radii, colours and copy identical.

### Known small cleanups (do when convenient, one at a time, ask first)
- "Review sales dashboard KPIs" wraps to two lines in Today's tasks, so its chips sit lower than on the other cards. The design does the same; leave unless Arnav asks.
- Optional idea Arnav may want: more Kalnirnay-style observances (Ekadashi, Sankashti Chaturthi, Amavasya, Purnima) and Maharashtra state holidays. Ask before adding.
- Open question from earlier: should the thought card also appear on other pages?

## Hard rules
- Never commit secrets. Only the Supabase URL and anon key go in `VITE_` env vars, and only because Row Level Security restricts every row to the signed-in user. Never use the service-role key in the frontend.
- Keep `.env` out of git; commit `.env.example`.
- Dates: store as ISO dates (YYYY-MM-DD). Show as "13 Oct". Week starts Monday.
- Keep the Tentative (dashed blue outline) and Fixed (solid pink-red) visual language on every page: short form "T 13 Oct" / "F 15 Oct" where space is tight, "Tentative 13 Oct" / "Fixed 15 Oct" where there is room.
- The holiday and festival tables are hand-kept and year-specific. Never guess a festival date in code; add it to `holidays.js` with a source.

## Commands
- dev: `npm run dev` (open http://localhost:5173/Task-Performance-Tracking/)
- build check (run before every commit): `npm run build`
- lint: `npm run lint`
- thoughts test: `node src/lib/thoughts.test.mjs`
- deploy: automatic via GitHub Actions on every push to `main`; check https://github.com/arnavdeore/Task-Performance-Tracking/actions for a green tick, then hard-refresh the live site (Ctrl+Shift+R)
