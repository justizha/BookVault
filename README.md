# BookVault

A full-stack book store management system built as a hands-on learning project — covering backend API design, authentication, database performance tuning, and a modern React frontend.

## Stack

**Backend**
- Laravel 10 (PHP 8.1)
- PostgreSQL
- Laravel Sanctum (API token authentication)

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- React Router
- TanStack Query
- Zustand
- Axios

**Tooling**
- Bun (frontend package manager)
- ESLint
- GitHub Actions (CI for both frontend and backend)

## Features

- Role-based user accounts (admin, staff, cashier) with Sanctum token auth
- Book catalog with stock and pricing as separate related tables
- Paginated, filterable book listings with eager-loaded relationships
- Login / register / logout flow with persisted client-side session
- Protected routes on the frontend, gated by auth token

## Project structure

```
Book_Store/
├── backend/          # Laravel API
└── frontend/         # React SPA
```

Backend and frontend are separate applications — the frontend talks to the backend purely over HTTP (no shared server-rendered views).

## Getting started

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# configure DB_* values in .env, then:
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend
```bash
cd frontend
bun install
bun run dev
```

The frontend expects the API at `http://localhost:8000/api` by default (see `src/lib/axios.ts`).

## Why this project exists

Built as a practice project to work through a full application lifecycle end to end: schema design, query performance tuning (indexing, `EXPLAIN ANALYZE`, avoiding correlated subqueries), API authentication, and a modern TypeScript React frontend — deliberately choosing React over Vue to build skills outside of day-to-day work.