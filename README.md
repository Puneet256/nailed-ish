# nailed...ish

A static, browser-only daily estimation game built with Next.js, React and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The project uses Next.js static export (`out/`). Deploy that directory to any static host that supports static files, such as Cloudflare Pages, Netlify or Vercel.

## Where to edit

- `src/data/questions.ts`: replace the illustrative sample questions with reviewed daily questions.
- `src/lib/config.ts`: set the launch date and timer length.
- `src/lib/scoring.ts`: scoring formulas and accuracy tiers.
- `src/components/`: all game UI components.
- `src/app/globals.css`: visual styling.

## How daily questions work

`questions.ts` contains five illustrative question sets. The game calculates a day number from the local calendar date and `LAUNCH_DATE`, then selects a set deterministically. The sample data currently cycles through those five sets; replace this with a properly scheduled bank before launch.

## Browser-only limitations

Progress, results and streaks live in localStorage on the current browser/device. Clearing browser data or switching devices loses that data. There are no accounts, server-side scores, global percentile or anti-cheat guarantees.

## Scoring

Quantity questions use absolute base-10 log ratio error. Year questions use the PRD's scaled absolute-year error. Each question scores from 100 down to zero over an error range of 1.5. Daily score is out of 500. Average fold-error is the geometric mean of each question's fold-error.
