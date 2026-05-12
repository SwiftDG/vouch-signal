# Vouch Signal — Architecture

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React 19 + Vite | UI, routing, component rendering |
| Styling | Tailwind CSS v4 | Utility-first styling |
| Animation | Framer Motion | Scroll reveals, transitions, counters |
| Routing | React Router DOM | Client-side page routing |
| Backend | Node.js / Express (Emmanuel) | API endpoints, Squad integration, scoring |
| AI Scoring | Claude API | Transaction pattern analysis, score generation |
| Payments | Squad API | Virtual Accounts, Webhooks, Transfer, Recurring |
| Database | PostgreSQL (Emmanuel) | Trader profiles, transaction history, scores |
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
│   │   │   ├── ScoreDisplay.jsx
│   │   │   ├── SquadAPIs.jsx
│   │   │   └── CTA.jsx
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
| `backend/` | Emmanuel | All Squad API calls, scoring logic, database, webhooks |

## Data Flow

```
Customer pays trader
        ↓
Squad Payment Gateway
        ↓
Squad Webhook → Backend endpoint
        ↓
Scoring engine (Claude API) recalculates score
        ↓
Updated score stored in PostgreSQL
        ↓
Frontend polls or receives score update
        ↓
Dashboard re-renders with new score
```

## Squad API Integration Points

| API | Used By | Purpose |
|-----|---------|---------|
| Virtual Accounts | Backend | Create one per trader on registration |
| Payment Gateway | Backend | Process customer payments |
| Webhooks | Backend | Receive real-time transaction events |
| Transfer API | Backend | Disburse loans to trader accounts |
| Recurring Payments | Backend | Automate loan repayments and Ajo contributions |

## Invariants — Rules This Codebase Must Never Violate

1. **No Squad API calls from the frontend** — all payment operations go through the backend
2. **No API keys in frontend code** — environment variables are backend only
3. **Components receive data via props** — no direct database or API calls inside component files
4. **One component per file** — no multiple exports from a single component file
5. **Tailwind only for styling** — no inline styles, no separate CSS files per component
6. **Framer Motion for all animations** — no CSS keyframes or transition hacks
7. **HomePage.jsx composes sections** — it imports components, it does not define them
