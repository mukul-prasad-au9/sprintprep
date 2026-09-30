# Deploy SprintPrep (Vercel + Neon)

Free personal hosting:

| Piece | Service |
|-------|---------|
| App | [Vercel](https://vercel.com) Hobby |
| Database | [Neon](https://neon.tech) Postgres |

SQLite is local only. Vercel needs Postgres (`DATABASE_URL=postgresql://...`).

Plan generation uses the bundled Planly syllabus — no AI keys required.

---

## Quick deploy

### 1. Neon database

1. https://neon.tech → create project  
2. Copy the connection string (`postgresql://...`)

### 2. GitHub + Vercel

```bash
# from this repo (already pushed)
# Vercel dashboard: New Project → import SprintPrep
```

Environment variables in Vercel:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon `postgresql://...` URL |

Optional (unused by syllabus planner): `USE_MOCK_AI=true`

### 3. Build

Vercel runs `npm run build` which:

1. Switches Prisma to Postgres when `DATABASE_URL` is postgres  
2. `prisma db push` + seed content  
3. Next.js build  

After deploy: open the URL → **Settings** → save profile (creates your Planly plan once).

---

## CLI deploy

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL   # paste Neon URL (Production)
vercel --prod
```

---

## Local

```env
DATABASE_URL="file:./dev.db"
```

```bash
npm run db:setup
npm run dev
```
