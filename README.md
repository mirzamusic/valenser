# Valenser Web App

Full stack TypeScript app:
- Frontend: React + React Query + Context + styled-components
- Backend: Node.js + Express + PostgreSQL + TypeORM

## Run both with one command

```bash
npm install
npm run install:all
npm run dev
```

This starts backend and frontend together from the project root.

## Backend setup

1. Create database `valenser` in PostgreSQL.
2. Configure env:

```bash
cd backend
cp .env.example .env
```

3. Install and run:

```bash
npm install
npm run dev
```

Backend starts on `http://localhost:4000` by default.

Notes:
- Allowed registration domains are configured in `ALLOWED_EMAIL_DOMAINS`.
- Verification/reset email codes are currently logged to backend console (`[EMAIL] ... code=XXXXXX`).
- Seeded super admins:
  - `mirza@valens.dev`
  - `branko@valens.dev`
- Seed password is `SEED_SUPERADMIN_PASSWORD` (default `Admin123!`).

## Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend starts on `http://localhost:5173` by default.

## Implemented flows

- Register request code -> verify code + set password
- Login with JWT auth
- Reset password request code -> verify code + set new password
- Role model: `employee`, `manager`, `hr`, `super_admin`
- Dashboard shows logged-in user email and role
- Protected API example for role authorization: `GET /api/auth/admin-only`
