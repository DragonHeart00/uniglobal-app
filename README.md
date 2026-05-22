# GodKänt – Körkort B (web)

Unified, multilingual React rebuild of the two GodKänt Android apps
(`APGPAR` – Arabic, `APGPSV` – Swedish). Both apps shipped the same Swedish
driving-theory MCQ engine in two languages; this project merges them into one
PWA with dynamic language switching, dark mode and offline-ready static data.

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite 7** via **TanStack Start v1** (file-based routing, SSR)
- **Tailwind CSS v4** (semantic tokens, oklch, no inline colors)
- **Zustand** (persisted app store, ephemeral session store)
- **react-i18next** + **i18next-browser-languagedetector**
- **Framer Motion** for transitions
- **shadcn/ui** primitives, **lucide-react** icons, **sonner** toasts

## Languages

| Code | Label | Direction | Questions | Files |
| ---- | ----- | --------- | --------- | ----- |
| `sv` | Svenska | LTR | 840 | 12 |
| `ar` | العربية | RTL | 1260 | 18 |

Selected language is persisted in `localStorage` (`godkant.lang`) and applied
to `<html lang>` and `<html dir>` automatically.

## Features migrated from the Android apps

- Study / Test / Examen modes
- File ("pärm") selection — all files or single file
- Sortable-answer logic (`Sortable=Yes` rows get answers shuffled)
- Image-question support (`image1` / `image2`)
- Favorites (per language, persisted)
- Latest result on home
- Examen: 70 random questions, 52 to pass (Trafikverket threshold)

Removed by request: code-based login / subscription / device binding, AdMob.

## Data pipeline

Each Android app shipped `database_questions.db` and `database_images.db`
(base64-encoded BLOBs). A one-shot Python script reads both `.db` files,
decodes the image BLOBs and writes:

- `src/data/questions.{ar,sv}.json` — questions, folders, answer arrays,
  correct answer, sortable flag, image URLs
- `public/images/{ar,sv}/<n>_{1,2}.<ext>` — 618 AR + 366 SV image files

The script lives in this repo's history; re-running it requires the original
`.db` files at `/tmp/ar_app` and `/tmp/sv_app`.

## Project structure

```
src/
  components/layout/   Shell, PageHeader
  components/ui/       shadcn primitives
  features/test/       TestRunner
  data/                questions.{ar,sv}.json
  i18n/                index.ts, locales/{ar,sv}.json
  lib/                 questions.ts (selectors, exam builder, shuffle)
  routes/              __root, index, mode, files, test, done, answers, favorites, about
  store/               app-store.ts (persisted), session-store.ts (ephemeral)
  styles.css           design tokens
public/
  images/{ar,sv}/      extracted question images
  manifest.webmanifest PWA manifest
```

## Run / build

```bash
bun install
bun run dev     # Vite dev server
bun run build   # production build
```

## Deploy

The template targets edge runtimes (Cloudflare Workers). Any static-friendly
host that supports the Vite output works. Publish from Lovable for one-click
deploy.

## Migration notes

- All Android `activity_*` screens map to `src/routes/*.tsx`.
- `database_favorite` (SQLite) → Zustand persisted `favorites` map.
- `SharedPreferences` (latest result, mode, etc.) → `localStorage` via Zustand
  `persist` middleware.
- `activity_test` answer-rendering, sortable shuffling, correct/wrong styling
  and review flow are reproduced in `features/test/TestRunner.tsx` and
  `routes/answers.tsx`.
- RTL is end-to-end: `[dir="rtl"]` swaps icon directions in nav buttons and
  Tailwind logical properties (`me-*`, `ms-*`, `text-start`) handle alignment.
