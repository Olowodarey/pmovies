# Movies — Personal Movie & TV Tracker

A full-stack movie discovery and tracking app. Browse trending, upcoming, and top-rated titles from TMDB, build a personal watchlist, mark films as watched, rate them, and see personal viewing stats broken down by month, year, media type, and genre.

**Live demo:** [https://pmovies-hub.vercel.app](https://pmovies-hub.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)

---

## Features

**Discover**
- Trending movies (day / week)
- Upcoming, top-rated, animated
- Top-rated TV series
- Browse by 18 genres with decade filter (1970s → 2020s)
- Actor & director search with full filmography
- Similar-movies section on every title
- Auto-embedded YouTube trailer

**Track**
- Save titles to a personal watchlist
- Mark titles as watched with a 1–5 star rating
- Full watch history with timestamps

**Stats**
- Total watched, watchlist size
- Watched this month / this year
- Movie vs TV breakdown
- Average star rating
- Top genres (auto-derived from watched titles)

**Auth**
- Email + password with hashed credentials (bcrypt)
- Google OAuth 2.0
- JWT stored in an HTTP-only cookie

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion |
| **State** | Redux Toolkit + RTK Query |
| **Backend** | NestJS 11, TypeScript |
| **Database** | PostgreSQL via Prisma 7 |
| **Auth** | JWT, Passport (Google OAuth 2.0), bcrypt |
| **External API** | TMDB (The Movie Database) |
| **Hosting** | Vercel (frontend) + Railway (backend + Postgres) |

---

## Architecture Highlights

### 1. Server Components + Selective RTK Query

TMDB data (public, cacheable) is fetched in **React Server Components** using Next.js's `fetch` + `revalidate` — the TMDB token stays server-side and cached responses are shared across all users. User-specific data (watchlist, watched, stats) uses **RTK Query** on the client with proper cache invalidation.

```
Public data      →  Server Components   →  Next.js edge cache (1h–7d)
User-specific    →  RTK Query client    →  Session cookie sent per request
```

### 2. First-Party Cookie Auth via Rewrite Proxy

Frontend runs on `vercel.app`, backend on `railway.app` — different second-level domains. Modern browsers block or partition third-party cookies, which breaks the standard cross-origin auth flow.

Solution: Next.js `rewrites` proxy all backend calls through the frontend origin:

```js
{ source: "/api/backend/:path*", destination: `${BACKEND}/:path*` }
```

The browser now sees the auth cookie as **first-party** (attributed to `pmovies-hub.vercel.app` even though the backend actually sets it), so it's never blocked. Google OAuth callback is also routed through this proxy for the same reason.

### 3. Denormalized Genre IDs for Fast Stats

The `WatchedEntry` table stores TMDB `genreIds` as a Postgres `Int[]` column. Personal top-genre stats are computed with a single query + in-memory tally — no join to a genres table, no per-movie lookups.

### 4. Turborepo-Style pnpm Workspace

Single repo, two independent apps sharing types where useful. Backend and frontend deploy separately (Railway and Vercel) but develop together.

---

## Project Structure

```
pmovies/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma       # User, WatchlistEntry, WatchedEntry
│   │   └── migrations/
│   └── src/
│       ├── auth/               # JWT + Google OAuth + guards
│       ├── watchlist/          # CRUD for saved titles
│       ├── watched/            # CRUD + stats aggregation
│       └── prisma/
│
├── frontend/                   # Next.js App Router
│   ├── app/
│   │   ├── (auth)/             # login, signup
│   │   ├── (main)/             # discover, profile, about…
│   │   ├── _component/         # shared UI (cards, nav, modals)
│   │   ├── _services/
│   │   │   ├── tmdb.ts         # server-only TMDB fetch
│   │   │   ├── fetchquerry.ts  # client TMDB (RTK Query)
│   │   │   └── backendApi.ts   # our backend (RTK Query)
│   │   ├── _themes/            # next-themes light/dark
│   │   └── _types/             # shared TS types
│   └── next.config.mjs         # rewrite proxy config
│
├── pnpm-workspace.yaml
└── railway.toml
```

---

## Local Development

### Prerequisites
- Node.js ≥ 22.12
- pnpm ≥ 10
- PostgreSQL ≥ 14 running locally (or use Railway/Neon)
- TMDB API access token — [get one here](https://www.themoviedb.org/settings/api)
- Google OAuth credentials (optional) — [Google Cloud Console](https://console.cloud.google.com)

### 1. Clone and install

```bash
git clone https://github.com/<you>/pmovies.git
cd pmovies
pnpm install
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/pmovies_dev?schema=public"
PORT=4000
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="<generate with: openssl rand -hex 32>"
JWT_EXPIRES_IN="7d"

# Optional — only needed if you want Google login
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"
```

Run migrations:

```bash
pnpm prisma migrate deploy
```

Start the backend:

```bash
pnpm start:dev   # http://localhost:4000
```

### 3. Configure the frontend

```bash
cd ../frontend
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_TMDB_ACCESS_TOKEN="<your TMDB v4 token>"
TMDB_TOKEN="<same token — server-only version>"
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
INTERNAL_BACKEND_URL="http://localhost:4000"   # for the rewrite proxy
```

Start the frontend:

```bash
pnpm dev         # http://localhost:3000
```

---

## Deployment

### Backend (Railway)

1. Push to GitHub
2. Create a new Railway project → Deploy from Repo
3. Add a Postgres plugin — Railway auto-injects `DATABASE_URL`
4. Set all `.env` vars in the Railway dashboard (Variables tab)
5. Set the callback URL to your **frontend** origin, routed through the proxy:
   ```
   GOOGLE_CALLBACK_URL=https://<your-frontend>.vercel.app/api/backend/auth/google/callback
   ```

### Frontend (Vercel)

1. Import the repo into Vercel, set the root directory to `frontend/`
2. Set env vars:
   ```
   TMDB_TOKEN=...
   NEXT_PUBLIC_TMDB_ACCESS_TOKEN=...
   NEXT_PUBLIC_BACKEND_URL=https://<your-backend>.up.railway.app
   INTERNAL_BACKEND_URL=https://<your-backend>.up.railway.app
   ```
3. Add the redirect URI to Google Cloud Console under your OAuth client's **Authorized redirect URIs**:
   ```
   https://<your-frontend>.vercel.app/api/backend/auth/google/callback
   ```

---

## Design Decisions Worth Noting

- **No mocking in dev** — the app runs against a real Postgres and real TMDB from the first `pnpm dev`. Faster to catch integration bugs.
- **Genre IDs stored on watch** — genres are captured at `mark-as-watched` time from TMDB's response, so stats don't require a separate lookup table or nightly job.
- **URL-driven pagination** — pagination links are plain `<Link>` tags, not client state. Pages are shareable and browser back/forward works.
- **Stagger animations in list views** — Framer Motion `staggerChildren` gives lists a subtle cascade on mount without hurting performance (each item is a lightweight `motion.div`).
- **Route segment caching** — Trending is cached 1 hour, top-rated 24 hours, trailers 1 week. TMDB rate limits never hit and the same TMDB call is amortized across all visitors in a cache window.

---

## Screenshots

<!-- Add screenshots here once you take them:
![Home](docs/home.png)
![Profile](docs/profile.png)
![Details](docs/details.png)
-->

---

## License

MIT

---

*Built by [Darey Olowo](https://github.com/<your-github>) as a personal project.*
