# SprintPrep

> Turn your interview preparation into sprints.

Personal AI interview-prep planner: long-term roadmap → weekly sprints → daily tickets → spillover → adaptive replan.

Inspired by the *category* of modern AI learning planners (e.g. Planly) — original UI, branding, and implementation.

## Run locally

```bash
cd /home/mukul/Desktop/SprintPrep
npm install
cp .env.example .env
# Add GEMINI_API_KEY and set USE_MOCK_AI=false (or leave mock on)
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gemini (local)

```env
AI_PROVIDER="gemini"
GEMINI_API_KEY="your-key-from-aistudio.google.com"
USE_MOCK_AI="false"
```

## Free cloud deploy

See **[DEPLOY.md](./DEPLOY.md)** — Vercel (app) + Neon (Postgres) + Gemini, all free tiers.

## Environment

```env
DATABASE_URL="file:./dev.db"          # local SQLite
# DATABASE_URL="postgresql://..."    # Neon on Vercel
AI_PROVIDER="gemini"
GEMINI_API_KEY=
OPENAI_API_KEY=
USE_MOCK_AI=false
```

## Features

- Dark sidebar + light workspace (productivity-app layout)
- Dashboard: greeting, metrics, current sprint timeline, today's tickets
- My Plan (16-week roadmap), Today's Sprint, Tickets, Progress, Mocks, Settings
- Capacity-aware scheduling (~85% of study time)
- Spillover + AI replan proposals
- DSA tickets with real LeetCode/GFG links only
- Sprint reviews labeled as AI observations
- Toasts, skeletons, empty/error states

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run db:setup` | Push schema + seed content |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
