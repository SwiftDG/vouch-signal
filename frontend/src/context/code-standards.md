# Vouch Signal — Code Standards

## Component Structure

Every component follows this exact pattern:

```jsx
import { motion } from "framer-motion";

export default function ComponentName() {
  return <section className="...">{/* content */}</section>;
}
```

- Named exports are never used — always `export default`
- Component name matches filename exactly
- No props drilling beyond one level — if data needs to go deeper, lift it to HomePage

## Naming Conventions

| Type        | Convention              | Example                               |
| ----------- | ----------------------- | ------------------------------------- |
| Components  | PascalCase              | `ScoreDisplay.jsx`                    |
| Pages       | PascalCase              | `HomePage.jsx`                        |
| CSS classes | Tailwind utilities only | `className="flex items-center gap-4"` |
| Variables   | camelCase               | `const traderScore = 714`             |
| Constants   | UPPER_SNAKE_CASE        | `const MAX_SCORE = 1000`              |

## Tailwind Patterns

Always use Tailwind utility classes. Never write custom CSS except in `index.css` for global resets.

```jsx
// ✅ Correct
<div className="flex flex-col gap-6 px-6 py-12 bg-[#060C18]">

// ❌ Wrong
<div style={{ display: 'flex', flexDirection: 'column' }}>
```

Custom color values use bracket notation:

```jsx
className = "bg-[#060C18] text-[#E85D04] border-[#1E3459]";
```

## Color Tokens (use these consistently)

| Token               | Value     | Usage                    |
| ------------------- | --------- | ------------------------ |
| Background          | `#060C18` | Page background          |
| Surface             | `#0D1A2E` | Card backgrounds         |
| Surface2            | `#112240` | Hover states             |
| Border              | `#1E3459` | All borders              |
| Accent Orange       | `#E85D04` | Primary CTAs, highlights |
| Accent Orange Light | `#FF8C42` | Hover states             |
| Accent Teal         | `#4AF0C4` | Secondary accents        |
| Text                | `#C8D6E8` | Body text                |
| Muted               | `#4A6080` | Secondary text, labels   |
| White               | `#EAF2FF` | Headlines                |

## Typography

| Element        | Font                | Weight | Size                                |
| -------------- | ------------------- | ------ | ----------------------------------- |
| Hero headline  | Bricolage_Grotesque | 800    | `text-7xl` to `text-9xl`            |
| Section titles | Bricolage_Grotesque | 700    | `text-4xl` to `text-6xl`            |
| Card titles    | Bricolage_Grotesque | 700    | `text-base`                         |
| Body text      | DM Mono             | 400    | `text-sm`                           |
| Labels/tags    | DM Mono             | 400    | `text-xs` uppercase tracking-widest |
| Numbers/stats  | Bricolage_Grotesque | 800    | `text-5xl` to `text-7xl`            |

Fonts are loaded via Google Fonts in `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Bricolage_Grotesque:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

## Framer Motion Patterns

### Standard scroll reveal (use on every section):

```jsx
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
```

### Staggered children:

```jsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

<motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  <motion.div variants={fadeUp}>Card 1</motion.div>
  <motion.div variants={fadeUp}>Card 2</motion.div>
</motion.div>
```

## File Rules

- Never import from `../../../` — keep imports shallow
- Always import Framer Motion from `'framer-motion'`
- Always import React Router from `'react-router-dom'`
- No unused imports — clean them before committing
