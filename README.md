# SFIC Activity Room Booking System

Premium college club activity room booking for **Strategy First** — dark cyber-college UI, **Supabase Postgres**, Prisma ORM, Framer Motion, and optimistic admin flows.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase (PostgreSQL)** + **Prisma ORM** — `User`, `Club`, `Room`, `Booking` with typed enums
- **Framer Motion** — `layoutId` room morph, fluid time-slot picker, nav pills
- **Recharts** — admin peak-hour analytics
- **Zod** — server action validation

## Quick start

1. In [Supabase](https://supabase.com/dashboard) open your project → **Connect** → **Session pooler** → **URI**.  
   **Do not use the direct `db.*.supabase.co` string on IPv4 networks** (Supabase shows “Not IPv4 compatible”).  
   Session pooler looks like:  
   `postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-REGION.pooler.supabase.com:5432/postgres`

2. Copy `.env.example` → `.env`. Paste **both** `DATABASE_URL` and `DIRECT_URL` (same Session pooler URI is fine locally). Add `?sslmode=require` if missing.

3. Verify connection, then push schema:

```bash
npm install
npm run db:check
npm run db:push
npm run db:seed
```

If `db:check` fails: open Supabase → ensure the project is **not paused**, reset the DB password, and copy the fresh **URI** from **Connect**.

### Pages feel slow in development

Normal in `npm run dev`:

- **First visit** to each route compiles many modules (often 2–5+ seconds once).
- **Database** is remote Supabase (Australia pooler) — each query adds network latency.
- After the first load, the same route is usually much faster.

If the terminal says **“Port 3000 is in use”** and the app runs on **3002**, stop the old server or open the URL shown in the terminal (`http://localhost:3002`). Running two dev servers causes confusion and slowness:

```bash
lsof -ti:3000,3002 | xargs kill -9 2>/dev/null
npm run dev
```

### Internal Server Error / ENOENT / ChunkLoadError in browser

Usually a **stale `.next` cache** or an old tab after code changes. Fix:

```bash
# Stop dev server (Ctrl+C), then:
npm run fresh
```

Then **hard-refresh** the browser (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows).

Do **not** use `db.*.supabase.co` in `.env` on IPv4 networks — use **Session pooler** (`aws-1-ap-southeast-2.pooler.supabase.com` in this project).

`npm run db:seed` uses `prisma db seed`, which loads `.env` automatically.

4. Run dev server:

```bash
npm run dev
```

5. Use these URLs (admin login is **not** linked from the public nav — bookmark it):

| Page | URL |
|------|-----|
| Public site | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) |
| Clubs | [http://localhost:3000/clubs](http://localhost:3000/clubs) |
| Admin login | [http://localhost:3000/sfic/manage](http://localhost:3000/sfic/manage) |

After admin login you land on `/admin`. Password: `ADMIN_PASSWORD` in `.env`.

## Vercel deploy

- Add **`DATABASE_URL`** in project Environment Variables (Supabase pooled URI if you use PgBouncer).
- Build command: `npm run build` (runs `prisma generate` automatically).

## Features

| Area | Highlights |
|------|------------|
| **Public (no login)** | Today timeline, **Clubs** directory, book rooms (2 or 3 hr blocks), My Bookings by email |
| **Admin (`/sfic/manage`)** | Password-gated + signed session; KPI, **club CRUD**, rooms, approvals |
| **UX** | Strategy First brand — black `#000000`, red `#D2232A`, white; official logo in nav; glass cards |

## Project structure

```
prisma/schema.prisma    # DB schema + enums
src/actions/            # Server actions
src/data/queries.ts     # Read models
src/components/         # UI (booking, admin, motion)
src/app/(public)/       # Public booking routes
src/app/(admin)/        # Admin routes (session required)
```
