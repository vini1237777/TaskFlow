# TaskFlow — Task Management System

> Full-Stack Engineer Assessment — Track A  
> Built with **Node.js + TypeScript + Prisma** (backend) and **Next.js 15 / React 19 + TypeScript** (frontend)

---

## Architecture Overview

```
taskflow/
├── backend/          # Node.js + TypeScript + Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma     # DB schema (User, Task, RefreshToken)
│   └── src/
│       ├── index.ts           # Express app entry point
│       ├── controllers/
│       │   ├── authController.ts
│       │   └── taskController.ts
│       ├── middleware/
│       │   ├── auth.ts        # JWT authentication guard
│       │   ├── errorHandler.ts
│       │   └── validate.ts    # express-validator middleware
│       ├── routes/
│       │   ├── auth.ts
│       │   └── tasks.ts
│       └── utils/
│           └── jwt.ts         # Token generation & verification
│
└── frontend/         # Next.js 15 + React 19 + TypeScript
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx        # Redirects → /dashboard
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   └── dashboard/page.tsx
        ├── components/
        │   ├── AuthGuard.tsx
        │   ├── TaskCard.tsx
        │   ├── TaskModal.tsx
        │   ├── TaskFiltersBar.tsx
        │   ├── TaskSkeleton.tsx
        │   ├── StatsBar.tsx
        │   └── Pagination.tsx
        ├── hooks/
        │   └── useTasks.ts     # All task state & API logic
        ├── lib/
        │   ├── api.ts          # Axios client + token refresh interceptor
        │   ├── authApi.ts
        │   └── tasksApi.ts
        ├── store/
        │   └── authStore.ts    # Zustand global auth state
        └── types/
            └── index.ts
```

---

## Tech Choices & Why

| Layer            | Choice                                          | Reason                                                             |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| Backend runtime  | Node.js + TypeScript                            | Required by spec; type safety eliminates entire classes of bugs    |
| Framework        | Express                                         | Lightweight, battle-tested, composable middleware                  |
| ORM              | Prisma                                          | Type-safe queries, migrations, readable schema DSL                 |
| Database         | SQLite (dev) / PostgreSQL (prod-ready)          | Zero-config for dev; swap `DATABASE_URL` for Postgres in prod      |
| Auth             | JWT — Access (15m) + Refresh (7d) with rotation | Stateless access, revocable refresh, no session DB needed          |
| Password hashing | bcrypt (cost factor 12)                         | Industry standard, adaptive                                        |
| Validation       | express-validator                               | Declarative, chainable, integrates cleanly                         |
| Rate limiting    | express-rate-limit                              | Brute-force protection on auth routes                              |
| Frontend         | Next.js 15 App Router + React 19                | Latest stable, Server/Client components, `useTransition` for async |
| Styling          | Tailwind CSS v3                                 | Utility-first, fast iteration, no runtime overhead                 |
| HTTP client      | Axios + interceptors                            | Automatic token refresh on 401, request queuing                    |
| Global state     | Zustand                                         | Minimal boilerplate, no context drilling                           |
| Toasts           | react-hot-toast                                 | Lightweight, fully customisable                                    |

---

## Part 1 — Backend API

### Running locally

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create env file
cp .env.example .env
# Edit .env — change JWT secrets for production!

# 3. Generate Prisma client & push schema
npm run db:generate
npm run db:push

# 4. Start dev server
npm run dev
# → API running at http://localhost:4000
```

### API Reference

#### Auth

| Method | Endpoint         | Auth | Description                                |
| ------ | ---------------- | ---- | ------------------------------------------ |
| `POST` | `/auth/register` | ✗    | Create account, returns token pair         |
| `POST` | `/auth/login`    | ✗    | Login, returns token pair                  |
| `POST` | `/auth/refresh`  | ✗    | Rotate refresh token, get new access token |
| `POST` | `/auth/logout`   | ✗    | Revoke refresh token                       |

**Register / Login body:**

```json
{
  "name": "Jane Smith", // register only
  "email": "jane@example.com",
  "password": "Password1"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "name": "..." },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

#### Tasks — all require `Authorization: Bearer <accessToken>`

| Method   | Endpoint            | Description                                  |
| -------- | ------------------- | -------------------------------------------- |
| `GET`    | `/tasks`            | List tasks (paginated, filtered, searchable) |
| `POST`   | `/tasks`            | Create a task                                |
| `GET`    | `/tasks/:id`        | Get single task                              |
| `PATCH`  | `/tasks/:id`        | Update task fields                           |
| `DELETE` | `/tasks/:id`        | Delete task                                  |
| `POST`   | `/tasks/:id/toggle` | Toggle PENDING ↔ COMPLETED                   |

**GET /tasks query params:**

| Param       | Type   | Example                                     |
| ----------- | ------ | ------------------------------------------- |
| `page`      | number | `1`                                         |
| `limit`     | number | `10` (max 50)                               |
| `status`    | string | `PENDING \| IN_PROGRESS \| COMPLETED`       |
| `priority`  | string | `LOW \| MEDIUM \| HIGH`                     |
| `search`    | string | `fix bug`                                   |
| `sortBy`    | string | `createdAt \| dueDate \| priority \| title` |
| `sortOrder` | string | `asc \| desc`                               |

**Task body (POST / PATCH):**

```json
{
  "title": "Build the API",
  "description": "Optional details",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2025-12-31"
}
```

### Security implementation

- Passwords hashed with **bcrypt** (cost 12) — never stored in plain text
- Access tokens expire in **15 minutes** — short window limits damage on theft
- Refresh tokens are **rotated on every use** — old token immediately revoked
- Refresh tokens stored in DB with `revoked` flag — fully revocable
- Auth routes rate-limited to **20 req / 15 min** per IP
- All inputs validated and sanitised before hitting the DB
- CORS locked to frontend origin; `helmet` sets security headers

---

## Part 2 — Frontend (Next.js 15 / React 19, Track A)

### Running locally

```bash
cd frontend

npm install

cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000

npm run dev
# → App at http://localhost:3000
```

### Features

**Authentication**

- `/register` — Name, email, password with real-time strength checklist
- `/login` — Email + password, show/hide toggle
- Tokens stored in `localStorage`; auto-refresh via Axios interceptor on every 401
- `AuthGuard` component blocks `/dashboard` without a valid session

**Dashboard**

- Stats bar: total / pending / in-progress / completed counts
- Search (debounced 350ms), status filter, priority filter, sort order
- Responsive grid layout — works on mobile and desktop

**Task CRUD**

- **Create** — modal form with title, description, status, priority, due date
- **Edit** — same modal pre-filled with existing values
- **Delete** — two-click confirmation (first click shows `!`, second confirms)
- **Toggle** — checkbox toggles PENDING ↔ COMPLETED with instant optimistic UI
- **Overdue** indicator — red clock icon on past-due incomplete tasks

**UX details**

- Staggered entrance animations on task cards
- Skeleton loader while fetching
- Empty states — different copy for "no tasks" vs "no filter results"
- Toast notifications for every action (success + error)
- Fully keyboard accessible

### Token refresh flow

```
Request → 401 received
         ↓
 isRefreshing? → queue request
         ↓ (no)
 Set isRefreshing = true
 POST /auth/refresh { refreshToken }
         ↓ success
 Save new accessToken + refreshToken
 Replay queued requests
         ↓ failure
 Clear tokens → redirect /login
```

---

## Production notes

1. **Database** — swap SQLite for PostgreSQL: change `provider = "postgresql"` in schema and update `DATABASE_URL`
2. **Secrets** — use random 64-char strings for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
3. **HTTPS** — terminate TLS at a reverse proxy (nginx / Caddy); never run Express directly on 443
4. **Cleanup job** — add a cron to purge expired/revoked `refresh_tokens` rows periodically
5. **Environment** — set `NODE_ENV=production` to disable verbose logging and stack traces in responses

---

## Running both together

```bash
# Terminal 1 — Backend
cd taskflow/backend && npm run dev

# Terminal 2 — Frontend
cd taskflow/frontend && npm run dev
```
