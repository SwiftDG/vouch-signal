# Vouch Signal — Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Phase 1 — Landing Page (Homepage)

## Current Goal

Build the complete Vouch Signal homepage with all 8 sections, fully animated and responsive.

## Completed

- Project setup (Vite + React + Tailwind v4 + Framer Motion + React Router DOM)
- Folder structure created (components/, pages/)
- All 8 component stubs created (empty default exports)
- HomePage.jsx stub created
- Context files written (all 6)

## In Progress

- Nav.jsx — sticky navigation with logo, links, CTA button

## Next Up

1. Nav.jsx
2. Hero.jsx
3. Stats.jsx
4. Problem.jsx
5. HowItWorks.jsx
6. ScoreDisplay.jsx
7. SquadAPIs.jsx
8. CTA.jsx
9. Wire all components into HomePage.jsx
10. Set up React Router in App.jsx
11. Deploy to Vercel

## Open Questions

- Does Emmanuel's backend have a local dev URL yet? (needed to wire up live score updates)
- Confirmed deployment: Vercel for frontend, Render for backend?

## Architecture Decisions

- Tailwind v4 — uses `@import "tailwindcss"` in index.css, no config file needed
- Framer Motion for all animations — no CSS keyframes
- Google Fonts loaded via index.html link tag (Syne + DM Mono)
- React Router DOM for routing — currently only one route (HomePage)
- No state management library — useState/useEffect sufficient for current scope

## Session Notes

- Color palette locked: navy #060C18, orange #E85D04, teal #4AF0C4
- Font pair locked: Syne (headings) + DM Mono (body)
- Homepage section order: Nav → Hero → Stats → Problem → HowItWorks → ScoreDisplay → SquadAPIs → CTA
- Squad API calls are backend only — frontend never calls Squad directly
- Emmanuel owns backend folder, David owns frontend folder
- Repo: github.com/SwiftDG/vouch-signal (monorepo — frontend/ + backend/)
