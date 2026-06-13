# Feedback Board

A modern, production-ready frontend for the Feedback API, built with React 19, TypeScript, Vite, TanStack Query, React Hook Form + Zod, and TailwindCSS with a soft, minimalist SaaS-style UI.

> Note that this application also contains a UI in this repo:
> https://github.com/Ryan-PG/basalam-entry-app-api

## Features

- **Public feedback submission** (`/`) — anyone can submit feedback (title + message) with client-side validation.
- **Admin login** (`/login`) — JWT-based authentication.
- **Protected dashboard** (`/dashboard`) — overview stats: total, submitted, under review, resolved.
- **Feedback list** (`/dashboard/feedbacks`) — pagination, status filtering, client-side search, loading skeletons, empty & error states.
- **Feedback details** (`/dashboard/feedbacks/:id`) — full details, status badge, status update with confirmation dialog.
- Global Axios instance with request/response interceptors (auto Authorization header, 401 auto-logout).
- Toast notifications, accessible forms, responsive layout (mobile, tablet, desktop).

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

Create a `.env` file (an `.env.example` is provided):

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

This should point to your running instance of the Feedback API.

## Project Structure

```
src/
├── api/            # Axios client, interceptors, error parsing
├── components/
│   ├── common/     # ErrorBoundary
│   └── ui/         # Reusable UI primitives (Button, Input, Table, Modal, etc.)
├── hooks/          # React Query hooks for feedbacks & auth
├── layouts/        # PublicLayout, DashboardLayout
├── lib/            # utils, token storage, zod validation schemas
├── pages/          # Route-level pages (public, auth, dashboard)
├── routes/         # AppRoutes, ProtectedRoute
├── services/       # API service modules (auth, feedback)
├── store/          # AuthContext (React Context for auth state)
├── types/          # Types derived from the OpenAPI spec
├── App.tsx
└── main.tsx
```

## Tech Stack

- React 19 + TypeScript (strict mode)
- Vite
- React Router
- Axios
- TanStack Query (React Query)
- React Hook Form + Zod
- TailwindCSS
- Lucide React Icons
- react-hot-toast

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Notes on API Integration

All types, endpoints, and validation rules were derived directly from the provided OpenAPI specification:

- `POST /auth/register`, `POST /auth/login`
- `POST /feedbacks` (public), `GET /feedbacks` (admin, paginated + status filter)
- `GET /feedbacks/{id}` (admin)
- `PATCH /feedbacks/{id}/status` (admin)

Validation rules (title 3–200 chars, message 5–5000 chars, email format, password min length) mirror the backend's Pydantic models via Zod schemas.
