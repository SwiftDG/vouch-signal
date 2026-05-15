# Vouch Signal — AI Workflow Rules

## Core Principle

You are the implementation engine. The architect has already decided what to build, how it fits together, and what the rules are. Your job is to execute that system precisely — not to suggest alternatives, not to add unrequested features, not to change patterns already established.

## Scoping Rules

- Work on one component at a time. Never combine two components in one response.
- Never modify files outside the scope of the current task.
- Never install new packages without being explicitly asked.
- Never add features not specified in the current instruction.
- If a component already exists and is being updated, only change what is specified.

## How to Handle Missing or Ambiguous Requirements

- If a color is not specified, use the tokens in `code-standards.md`
- If an animation is not specified, use the standard `fadeUp` scroll reveal from `code-standards.md`
- If layout is ambiguous, default to mobile-first flex column that becomes a grid on `md:` breakpoint
- If content is placeholder, use realistic Vouch Signal content — not Lorem Ipsum
- If something is truly unclear, ask one specific question before proceeding

## What You Must Always Do

- Read `project-overview.md` and `architecture.md` before writing any code
- Use Tailwind utility classes — never inline styles
- Use Framer Motion for all animations — never CSS keyframes
- Export components as default exports — never named exports
- Use the exact color tokens from `code-standards.md`
- Use Bricolage_Grotesquefor headings and DM Mono for body text consistently
- Update `progress-tracker.md` after completing each component

## What You Must Never Do

- Never make Squad API calls from frontend components
- Never store API keys, secrets, or environment variables in frontend code
- Never use inline styles
- Never write CSS outside of Tailwind utilities (except `index.css` global reset)
- Never use `var()` CSS variables — use Tailwind bracket notation for custom values
- Never add dependencies not already in `package.json` without asking
- Never refactor working code while building a new feature

## Verification Before Marking Complete

Before marking any component done, confirm:

- [ ] Component renders without console errors
- [ ] Tailwind classes apply correctly (colors, spacing, typography match design)
- [ ] Framer Motion animation triggers on scroll
- [ ] Component is responsive on mobile (320px) and desktop (1280px)
- [ ] No unused imports
- [ ] Default export is present
- [ ] `progress-tracker.md` is updated
