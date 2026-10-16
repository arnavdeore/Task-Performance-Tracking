# Slate design notes

Everything here was taken from the approved design files in `../design/`. When this document and a design file disagree, the design file wins.

## Reading the .dc.html files
- Open them in VS Code as text. They are normal HTML with inline `style` attributes, so colours, sizes and spacing can be copied directly.
- They are NOT meant to be opened in a browser (a missing runtime script, `support.js`, drives them).
- Template syntax: `{{name.field}}` is a value from the logic; `<sc-for list="{{items}}" as="x">` is a loop; `<sc-if value="{{flag}}">` is a condition; `onClick="{{fn}}"` is an event. The `hint-placeholder-*` attributes are for the design editor only; ignore them.
- At the bottom of each file, `<script type="text/x-dc">` holds `class Component extends DCLogic` with `state` and `renderVals()`. That is the page logic and the sample data. Port it to React state and hooks. `renderVals()` is the equivalent of a render pass: everything in it recomputes on each state change.
- All sample data is in that script block. Nothing in the designs talks to a server.

## Files
| File | Screen |
|---|---|
| Main.dc.html | Desktop Dashboard |
| Tasks.dc.html | Desktop Tasks board, Add task and EOD update pop-ups |
| Performance.dc.html | Desktop Performance |
| MobileHome / MobileTasks / MobileAdd | Mobile screens (older flat style; restyle to match desktop) |
| Login.dc.html | Sign in (older flat style; restyle to match desktop) |

The three desktop boards are all 1600 x 1800 in `canvas.json` and share one page shell (see below). The mobile boards are 390 x 844. The desktop pages are fluid: build them responsive, do not hard-code 1600.

## The shared page shell (identical on all three desktop pages)
Get this right once and the three pages match:
- Outermost element: `min-height:100vh`, `padding:20px`, flex column, the page gradient as background.
- Inside it one rounded frame that fills the remaining height: `flex:1 1 auto`, radius 44, `padding:24px`, flex column, `gap:26px`, `rgba(255,255,255,.4)` with a 1.5px white border and a soft shadow.
- First child: the top bar (white card, radius 28, `padding:10px 18px`). Logo left, text tabs centred, search and bell icons and the avatar right.
- Then `<main>` with `flex:1 1 auto`, flex column, `gap:26px`. The last row inside `main` carries `flex:1 1 auto` so a short page still fills the frame instead of leaving a dead band.
- Nav items, in order: Dashboard, Tasks, Performance, Reports, Settings. There is no Calendar tab (the calendar lives on the Dashboard). Reports and Settings are placeholders.

### One type scale across the pages
| Element | Size |
|---|---|
| Page title (h1) | 30px / 800 / letter-spacing -.015em |
| Page subtitle | 14px / line-height 1.55 / #5B667D |
| Section heading (h2) | 21px / 700 |
| Nav tab | 13.5px / 600, pill padding 11px 22px |
| Segmented control button | 38px tall, 13.5px / 600, pill container with 5px padding |
| Stat tile | label 12.5px, number 32px / 800, sub-line 11.5px |
| Primary button | 50px tall, 15px / 700 (smaller in-card buttons: 42px / 13px) |
| Body text in cards | 13px to 14px, line-height 1.55 to 1.65 |

## Visual language
- Font: Plus Jakarta Sans (400 to 800), loaded from Google Fonts.
- Page background: `linear-gradient(150deg,#D3E3F8 0%,#E2E1F6 52%,#DDEEEA 100%)`.
- Cards inside the frame: radius 30 to 34. Two kinds: "white" (solid white, large soft shadow) and "glass" (`rgba(255,255,255,.6)`, 1.5px near-white border).
- Buttons: pills (fully rounded). Primary = navy `#232B5E` with white text. Secondary = white.
- Active nav tab and active segment = navy pill with white text.
- Charts: concentric rings (SVG circles with `stroke-dasharray`), capsule bars (rounded bars with a 3px white outline; striped = planned, solid = completed, green = the one being read), donut with a white centre.
- Mobile: bottom tab bar with Home, Tasks, big round Add button, Stats, Settings.

### Colours
| Use | Main | Dark text | Pastel |
|---|---|---|---|
| Navy (nav, primary buttons) | #232B5E | | |
| Text / muted | #1B2438 / #5B667D, #4A556B | | |
| Blue (Development, tentative) | #2457C5 | #1A3F94 | #E4EDFC, card #CFE0F9 |
| Green (Data Cleaning, success) | #1E9E68 | #0F6B43 | #E1F4EA, card #D3EFE1 |
| Red (fixed deadline, overdue) | #C23A3A | #A12B2B | #FCE6E6, border #F0B4B4, card #FBD9D2 |
| Lavender (Data Management) | #8B7BE0 / #A99BEA | #4C3AA6 | #ECE8FB, card #E4E2FA |
| Amber (Power BI) | #DD9A22 / #F0B44C | #7A5200 | #FBEFD2, card #FDE3C8 |
| Holiday (calendar) | dot #E0A124 | #6B4A07 | cell #FBEFD6 |
| Banks closed (calendar) | | #55617A | cell #E7ECF5 |

### The two deadline kinds (keep this everywhere)
- Tentative = her own target, can move. Dashed blue outline chip.
- Fixed = the committed date, drives the on-time score. Pink-red chip.
- Short form where space is tight (Dashboard cards, lists): `T 13 Oct` / `F 15 Oct`, with a legend nearby.
- Long form where there is room (Tasks board cards, mobile cards): `Tentative 13 Oct` / `Fixed 15 Oct`.

## Domain
- Categories: Development, Data Cleaning, Data Management, Power BI.
- Priority: Low, Medium, High.
- Status columns: To do, In progress, Waiting, Done.
- Task fields: title, category, priority, tentative deadline, fixed deadline, estimated hours, status, completed date, logged hours, notes.
- EOD update fields: date, task, hours spent today, status after today, mood (On track, At risk, Blocked), update text, next steps or blockers (optional).
- Saving an EOD update adds its hours to the task's logged hours, can change the task status (Done sets the completed date), and copies the text to the card note.

## Validation (keep these messages)
Add task: title required; fixed deadline required ("It drives your on-time score"); tentative must not be after fixed; estimated hours >= 0.
EOD update: a task must be picked; update text required; hours between 0 and 24.

## Screens and behaviour

**Dashboard (Main.dc.html).** Top to bottom:
1. Greeting that follows the clock (morning / afternoon / evening) with the date, and four stat tiles. Each tile is label + big number + a sub-line that adds information (Open tasks 9 / "5 due this week"; Done this month 23 / "4 more than September"; On time 87% / "Target 90%"; Overdue 1 / "Oldest 2 days late").
2. Thought strip (see below).
3. Row: "Today's tasks" (three pastel cards, each with priority, title, category, T and F chips, hours progress) with a footer bar summarising planned vs logged hours for today; beside it the **month calendar** (see below).
4. Row: "Deadline watch" (list with All / Overdue / Next 7 days filter, and a T/F legend) + "Performance" (three rings and metrics, average-delay strip, link to the full report) + "Work by category" (donut; clicking a category filters the deadline list and changes the donut centre).
5. Row: "This week" (seven day columns, Monday to Sunday, each a vertical track filled by the share of that day's planned work that is done - green at 100%, blue in progress, grey for days still ahead, today's column highlighted, with a percentage and tasks-left line) + "Latest updates" (the two most recent EOD entries with hours and mood, and a button to the tasks board).

There are deliberately no "Add task" or "EOD update" buttons on the Dashboard; both live on the Tasks page.

**The month calendar (Dashboard).** Monday-start grid of the current month, with previous / next month arrows and a Today button. Each day cell can carry: a solid red dot (a fixed deadline falls that day), a hollow blue ring (a tentative date), and an amber corner dot plus an amber cell tint (a holiday). Second and fourth Saturdays are tinted grey as "banks closed". Today is a filled navy cell; a clicked day gets a navy ring. Clicking a day writes a line under the grid, for example "21 October: holiday, Vijaya Dashami" or "10 October: banks closed, second Saturday; Review sales dashboard KPIs (tentative)". With no day selected the line summarises the month ("October has 6 fixed deadlines, 6 tentative dates and 5 holidays"). Chips under the grid list that month's holidays; a legend sits at the bottom.
Holiday data: use `reference/holidays.js`. Fixed-date holidays repeat every year; the movable festivals are stored per year, and a year that is not in the table shows no festival holidays on purpose. Add the next year's dates each December. State holidays vary, so treat the list as indicative.

**Tasks (Tasks.dc.html).** Header: page title, three stat tiles (Open tasks with a status breakdown, Fixed dates next 7 days, Logged today), then a row with the category filter pills, an overdue pill, and the "EOD update" and "Add task" buttons.
Board: four columns (To do, In progress, Waiting, Done), each a glass card with a coloured dot, name and count. Cards are **white with a 6px left stripe in the category colour** (not a pastel fill), radius 22, 18px padding, and carry: a category line (dot + name) and a priority chip on one row, an 18px title, "Tentative …" and "Fixed …" chips, an optional note clamped to two lines, a status line and hours on one row above an 8px progress bar filled in the category colour, then "Log update" and a move button (Start / Mark done / Resume / Reopen).
Below the board: the EOD update log, grouped by day with the hours logged that day.
Pop-ups: both open centred over a dim backdrop; click outside, Esc or the close button dismisses; saving closes the pop-up and shows a navy confirmation toast. The forms are split into labelled groups on tinted panels - Add task: "The task", "Deadlines", "Effort and notes"; EOD update: "Which task is this about?", "Today", "Your update". Inputs are 50px tall at 15px.

**Performance (Performance.dc.html).** Period control (This month, Last 3 months, Year to date) and Export report. Then: scorecard (fixed met %, tentative hit %, average delay when late); health-check rings; "Month by month" capsule chart with an On-time % / Tasks done toggle and a 90% target line; "What this means" plain-language insights generated from the numbers; **"Weekly completion"** (ten weeks, each a striped planned capsule beside a solid completed capsule, bars and labels in the same 10-column grid so they line up, weeks outside the selected period faded, with a readout column showing the week's percentage, change versus the previous week, four-week average, best week and tasks carried over); by-category table (done, on-time %, planned vs actual hours with over/under %); late and overdue list filtered by the selected category.

**Thought strip (Dashboard).** Changes every 10 minutes (at :00, :10, :20 …). Chosen from day + time slot, so it is stable within a slot. Mixes Hindu-calendar items (tithi, paksha, weekday, time-of-day, festivals) with global sayings. No thought repeats within a calendar day. Shows a source chip, a festival chip when there is one, and a Panchang line (tithi, month, Vikram Samvat, weekday). The panchang is an approximation and the festival dates are a hand-kept table, so update them each year. The "Preview next" button is for design review only; remove it in the real app.

## Performance metric definitions (draft; confirm in the database phase)
- Fixed deadlines met % = tasks completed on or before the fixed date / tasks completed in the period.
- Tentative dates hit % = tasks completed on or before the tentative date / tasks completed in the period.
- Average delay when late = mean days after the fixed date, over tasks completed late.
- Estimate accuracy: how close actual hours were to estimated hours. Exact formula to be decided.
- Weekly completion % = tasks completed that week / tasks planned for that week. "Planned" needs a definition in Phase 3 (suggestion: tasks whose tentative or fixed date falls in that week).
- Target for fixed deadlines: 90%.

## Draft data model (to be designed properly in Phase 3)
- `tasks`: id, user_id, title, category, priority, tentative_date, fixed_date, est_hours, status, completed_on, logged_hours, notes, created_at.
- `eod_updates`: id, user_id, task_id, date, hours, mood, status_after, comment, next_steps, created_at.
- Row Level Security on both: a user can only read and write rows where user_id = their own id.

## Suggested React structure (Phase 2)
`src/components/` AppShell, TopNav, StatTile, ThoughtStrip, TaskCard, BoardColumn, Modal, AddTaskModal, EodModal, RingChart, CapsuleBars, Donut, MiniCalendar, WeekStrip, SegmentedControl, DeadlineList.
`src/pages/` Dashboard, Tasks, Performance, Login.
`src/lib/` thoughts.js and holidays.js (both from `reference/`), metrics (pure functions with tests), dates.
`src/data/` mock data first, then Supabase hooks.
