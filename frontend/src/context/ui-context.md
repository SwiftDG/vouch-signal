# Vouch Signal — UI Context

## Aesthetic Direction

Dark, institutional, data-forward. Vouch Signal looks like what it is — financial infrastructure. Not a consumer app, not a startup with rounded corners and gradients everywhere. Think Stripe meets Nigerian fintech: serious, credible, technically confident.

The one thing judges must feel in 3 seconds: **this is a real product built by people who understand the problem.**

## Color System

```
Background:     #060C18   — deep navy, page background
Surface:        #0D1A2E   — card and section backgrounds
Surface2:       #112240   — hover states, active states
Border:         #1E3459   — all dividers and card borders
Accent Orange:  #E85D04   — primary CTAs, highlights, active states
Orange Light:   #FF8C42   — orange hover states
Accent Teal:    #4AF0C4   — secondary accents, success states
Text:           #C8D6E8   — all body text
Muted:          #4A6080   — labels, secondary text, placeholders
White:          #EAF2FF   — headlines and high-emphasis text
```

In Tailwind bracket notation:

```jsx
bg-[#060C18]     // background
bg-[#0D1A2E]     // surface
bg-[#112240]     // surface2
border-[#1E3459] // borders
text-[#E85D04]   // accent orange
text-[#4AF0C4]   // accent teal
text-[#C8D6E8]   // body text
text-[#4A6080]   // muted
text-[#EAF2FF]   // white/headlines
```

## Typography

**Display / Headlines:** Bricolage_Grotesque, weight 700–800
**Body / Labels / Code:** DM Mono, weight 300–500

```jsx
// Section headline
<h2 className="font-['Bricolage_Grotesque'] font-bold text-5xl text-[#EAF2FF]">

// Body text
<p className="font-['DM_Mono'] text-sm text-[#C8D6E8] leading-relaxed">

// Label / tag
<span className="font-['DM_Mono'] text-xs uppercase tracking-widest text-[#E85D04]">

// Stat number
<span className="font-['Bricolage_Grotesque'] font-extrabold text-6xl text-[#E85D04]">
```

## Spacing System

Use Tailwind spacing consistently:

- Section vertical padding: `py-24` (desktop) `py-16` (mobile)
- Section horizontal padding: `px-6` (mobile) `px-12` (desktop via `md:px-12`)
- Max content width: `max-w-6xl mx-auto`
- Card internal padding: `p-8` (desktop) `p-6` (mobile)
- Gap between cards: `gap-1` (for grid with visible border between cells) or `gap-6` (for spaced cards)

## Component Patterns

### Section tag (appears above every section title):

```jsx
<div className="flex items-center gap-2 mb-4">
  <div className="w-6 h-px bg-[#E85D04]" />
  <span className="font-['DM_Mono'] text-xs uppercase tracking-widest text-[#E85D04]">
    Section Label
  </span>
</div>
```

### Section headline:

```jsx
<h2 className="font-['Bricolage_Grotesque'] font-bold text-5xl md:text-6xl text-[#EAF2FF] leading-tight mb-6">
  Headline <span className="text-[#E85D04]">highlight</span>
</h2>
```

### Card (surface card with orange top accent):

```jsx
<div className="relative bg-[#0D1A2E] border border-[#1E3459] p-8 hover:bg-[#112240] transition-colors">
  <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#E85D04]" />
  {/* card content */}
</div>
```

### Primary button:

```jsx
<button className="font-['DM_Mono'] text-xs uppercase tracking-widest px-8 py-4 bg-[#E85D04] text-[#EAF2FF] hover:bg-[#FF8C42] transition-colors">
  Get Started
</button>
```

### Secondary button:

```jsx
<button className="font-['DM_Mono'] text-xs uppercase tracking-widest px-8 py-4 bg-transparent text-[#EAF2FF] border border-[#1E3459] hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">
  Learn More
</button>
```

### Grid with visible dividers (like stats row):

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#1E3459] border border-[#1E3459]">
  {/* items */}
</div>
```

## Layout Patterns

**Full-width section with max-width content:**

```jsx
<section className="bg-[#060C18] py-24">
  <div className="max-w-6xl mx-auto px-6 md:px-12">{/* content */}</div>
</section>
```

**Two-column text + visual:**

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
  <div>{/* text */}</div>
  <div>{/* visual / mockup */}</div>
</div>
```

**Three-column card grid:**

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#1E3459]">
  {/* cards with bg-[#0D1A2E] */}
</div>
```

## Background Effects

The main page background uses a subtle grid overlay. Apply to the root wrapper in `App.jsx`:

```jsx
<div
  className="min-h-screen bg-[#060C18]"
  style={{
    backgroundImage: `
      linear-gradient(rgba(232,93,4,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,93,4,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px'
  }}
>
```

## Animation Defaults

Standard scroll reveal — use on every section and card:

```jsx
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
```

Stagger container — use when revealing multiple cards:

```jsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
```

Counter animation — use for stat numbers:

```jsx
// Use framer-motion's useMotionValue and useSpring to animate numbers counting up
// from 0 to target value on scroll into view
```
