<<<<<<< ours
# School Schedule

React + Vite + Tailwind timetable with URL driven filters, push reminders, offline support, and a local admin panel. The UI always reads from `data/schedule.json` (copied to `public/data/` for dev/prod), so editors only touch the JSON source of truth.

## Stack and infrastructure

- React 19, Vite, TailwindCSS (12 column grid, restrained palette, baseline rhythm).
- PWA via `public/manifest.json` and `public/service-worker.js` (shell + `schedule.json` cached with stale-while-revalidate).
- ESLint (flat config), Prettier, Husky (pre-commit hook runs lint -> format check -> unit tests).
- Vitest (time/week helpers) and Playwright (URL state + next lesson card).
- GitHub Actions: lint -> format check -> `npm run test:unit` -> build on PRs; `main` deploys to GitHub Pages.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Syncs `data/` to `public/` and starts Vite (not run here per user request). |
| `npm run build` | `rimraf dist`, sync JSON, Vite build. |
| `npm run preview` | `vite preview --host 127.0.0.1 --port 4173` (same origin used in Playwright tests). |
| `npm run lint` / `npm run format[:check]` | ESLint and Prettier. |
| `npm run test:unit` | Vitest suite. |
| `npm run test` | Unit -> build -> Playwright (left for the user to execute locally). |
| `npm run generate:icons` | Creates PNG icons in `public/icons` using `pngjs`. |
| `npm run import:schedule ./file.csv` | Converts CSV/Google Sheets to `data/schedule.json` and mirrors it to `public/data`. |
| `npm run sync-data` | Copies `data/schedule.json` to `public/data/schedule.json` (called inside `dev` and `build`). |

## Layout

```
school-schedule/
├── data/schedule.json          # source of truth for lessons
├── public/
│   ├── data/schedule.json      # HTTP served copy
│   ├── icons/icon-{192,512}.png
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── main.jsx / App.jsx      # landing + timetable UI
│   ├── pages/Admin.jsx         # editor served at /admin
│   ├── lib/{time,schedule}.js  # Intl helpers, week parity, countdowns
│   └── index.css               # Tailwind layers and utility classes
├── scripts/
│   ├── generate-icons.mjs
│   ├── import-schedule.mjs     # CSV -> JSON + public sync
│   └── sync-data.mjs           # data -> public copy
└── tests/
    ├── time.test.js            # Vitest
    └── e2e/url.spec.ts         # Playwright
```

## Main page

- 12 column grid with 64-96px spacing, Manrope/Inter typography (H1 40-48px, lead 18-20px, body 16px, line height >= 1.5).
- Filters card: class, day, mode, reminder lead minutes, push toggle (state stored in query string and localStorage).
- Next lesson card exposes `data-next-*` attributes, updates every minute and on `visibilitychange`.
- Schedule table has zebra rows, slot highlighting, responsive hiding of teacher/room columns under 640px.
- Notes and footer sections document PWA/admin/import flows; `/admin` link is always visible.

## Admin panel

- Left column for classes/days, right column for the editable table. All inputs share a 44px height and 12px radius.
- Supports base/alternate subjects, teachers, and rooms for week cycles; buttons "Save JSON" / "Reset" remain in place.
- Toasts appear bottom right with subtle colours and 150ms ease out transitions.
- Export downloads a valid JSON; reset reloads `data/schedule.json`.

## Data and logic

- `lib/time.js` keeps everything in `Europe/Kyiv` using Intl APIs (start of week, parity, human readable countdown).
- `lib/schedule.js` resolves base/alternate fields, builds lesson objects with `Date` instances, and finds the next lesson.
- Service worker caches `/`, `index.html`, manifest, icons, and `schedule.json`.
- Push reminders use the Notification API plus the registered service worker.

## Tests and CI

- Vitest covers time helpers (`humanizeDiff`, `isBaseWeek`, `getStartOfWeek`).
- Playwright ensures query params restore filters (`#dayFilter`) and the next lesson card renders countdown text.
- `.github/workflows/ci-cd.yml` runs on PRs and pushes to `main`/`develop`, uploading the `dist` artifact and deploying from `main`.

## Next steps

1. Run `npm run test` locally (omitted here on purpose).
2. Hook up the final production domain in Plausible/GitHub Pages and update this README.
3. Add more Playwright coverage for admin edits and push permission flows if needed.
=======
# Расписание уроков

Статический сайт с интерактивным расписанием школьных уроков.

## Возможности

- Фильтрация по дням недели и поиск по предметам или преподавателям.
- Хранение выбранного класса и дня в браузере для быстрого возврата.
- Подсказки по дням недели: количество уроков, ближайшее занятие и заметки.

## Как запустить

Откройте файл `index.html` в браузере, чтобы увидеть расписание и воспользоваться фильтрами по дням и выбором класса.
>>>>>>> theirs
