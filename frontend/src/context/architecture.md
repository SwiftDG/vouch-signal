# Vouch Signal — Architecture

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React 19 + Vite | UI, routing, component rendering |
| Styling | Tailwind CSS v4 | Utility-first styling |
| Animation | Framer Motion | Scroll reveals, transitions, counters |
| Routing | React Router DOM | Client-side page routing |
| Backend | Node.js / Express / TypeScript | Profile, evidence, and confirmation endpoints |
| Authentication | Supabase Auth | Email/password and Google sign-in; JWT for owner APIs |
| Database | Supabase PostgreSQL via Prisma | Business profiles, evidence, confirmation requests |
| Deployment | Vercel (frontend) + Render (backend) | Production hosting |

## Repository Structure

```
vouch-signal/
├── frontend/                    ← David owns this
│   ├── context/                 ← AI context files (this folder)
│   ├── public/
│   ├── src/
│   │   ├── components/          ← Reusable UI components
│   │   │   ├── Nav.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── Problem.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── ...
│   │   ├── pages/               ← Route-level page components
│   │   │   └── HomePage.jsx
│   │   ├── App.jsx              ← Router setup
│   │   ├── index.css            ← Tailwind import only
│   │   └── main.jsx             ← React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── backend/                     ← Emmanuel owns this
    └── ...
```

## System Boundaries

| Boundary | Owner | Responsibility |
|----------|-------|---------------|
| `frontend/src/components/` | David | All reusable UI components. No API calls inside components — data comes via props or context |
| `frontend/src/pages/` | David | Route-level components. HomePage imports and composes all section components |
| `frontend/src/App.jsx` | David | React Router setup only. No business logic |
| `backend/` | Backend | Profile, evidence, confirmation APIs and persistence |

## Data Flow

```
Owner signs in with Supabase Auth
        ↓
Frontend sends Supabase JWT to Express API
        ↓
Owner creates profile and completed-work records
        ↓
Customer confirms one record through an expiring link
        ↓
Public profile displays deliberately public fields and confirmed work
```

## API Boundaries

| API | Access | Purpose |
|-----|--------|---------|
| `/api/v1/profiles/*` | Supabase JWT | Owner profile and evidence actions |
| `/api/v1/confirmations/:token` | Public token | Read and confirm one work record |
| `/api/v1/public/profiles/:slug` | Public slug | Read deliberately public profile data |

## Invariants — Rules This Codebase Must Never Violate

1. No payment, lending, or financial-product integrations.
2. Never put secrets or Supabase service-role keys in frontend code.
3. Owner APIs derive identity from the verified JWT, never a caller-supplied owner ID.
4. Public endpoints use explicit response projections and omit private evidence.
5. Self-reported evidence is never presented as customer-confirmed.
6. Confirmation tokens are unguessable, unique, expiring, and single-use.
