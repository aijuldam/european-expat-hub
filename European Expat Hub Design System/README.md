# Expatflix — Design System

**Expatflix** is a relocation intelligence platform for expats moving within Europe. It helps individuals and families choose the right destination, understand how life works there, and set themselves up quickly without costly mistakes or wasted time.

The product is a **static-prerendered React web app** (Vite + wouter + shadcn/ui + Tailwind v4). It is structured around a handful of decision tools that work together:

- **City Match Quiz** — 9–10 questions about lifestyle and priorities; produces a ranked list of European cities that fit.
- **City & Country Browser** — profiles for 12 countries and 35+ cities covering cost of living, taxes, weather, safety, and salaries.
- **Side-by-side Compare** — pick two cities and see them judged across dimensions (safety, CoL, salary, weather, transport). Shareable + embeddable.
- **Salary Calculator** — gross→net estimates for the Netherlands, France, Germany, and Hungary with current tax parameters.
- **Guides** — long-form help for Cost of Living, Settle Down (housing, banking, visas), and Schools & Family.

The tone is calm, numerate, and honest — closer to a civic research site than a lifestyle blog. The brand feels **trusted, simple, European**.

---

## Sources

- **GitHub repo:** [`aijuldam/european-expat-hub`](https://github.com/aijuldam/european-expat-hub) — Vite + React 19, shadcn/ui "new-york" style, Tailwind v4. Prerendered to static HTML via `scripts/prerender.mjs`.
- **Existing design tokens:** `src/index.css` in the repo (rethemed here — see Caveats).
- **No Figma file was provided.**

## Caveats & substitutions

- The repo ships with a **navy + amber** palette (`--primary: 215 60% 11%` navy, `--accent: 38 92% 50%` amber). The brief asked for a **green + black** direction for a trusted, simple feel — so this design system rethemes accordingly. **Primary = near-black ink, accent = brand green.** If you want to revert to the original navy+amber, update `colors_and_type.css` only.
- The repo has **no custom logo** — only a round navy favicon with a generic green landmass and a compass. I drew a minimal placeholder lockup (`assets/logo-*.svg`) in the new palette. **Please replace with the real logo when available.**
- The repo loads **Inter** from Google Fonts. I kept Inter and added **Fraunces** as the display serif (home page uses `font-serif font-bold` for headlines — Georgia in the repo; Fraunces is a better brand fit and stays in the "trusted editorial" family). Flag if you'd rather stay on Georgia.
- No icon font is bundled; the app uses **`lucide-react`**. Linked from CDN in previews; document usage in ICONOGRAPHY below.

---

## Index

Root:
- `README.md` — this file.
- `colors_and_type.css` — color + type tokens (CSS variables) and semantic element styles.
- `SKILL.md` — cross-compatible skill manifest.
- `assets/` — logos, favicon, OpenGraph image.
- `preview/` — small design-system cards surfaced in the Design System tab.
- `ui_kits/web/` — the UI kit for the web product (only surface).

Preview cards (registered in the Design System tab):
- `preview/colors-primary.html` — ink + green brand ramps.
- `preview/colors-semantic.html` — semantic token swatches.
- `preview/type-display.html` — Fraunces display specimens.
- `preview/type-body.html` — Inter body specimens.
- `preview/type-scale.html` — the full type scale.
- `preview/spacing.html` — spacing tokens.
- `preview/radius-shadow.html` — radius + shadow tokens.
- `preview/buttons.html` — button states.
- `preview/badges-chips.html` — badges and chips.
- `preview/cards.html` — city card, country card, compare row.
- `preview/forms.html` — inputs and selects.
- `preview/logo.html` — logo lockups.
- `preview/iconography.html` — icon set (lucide).

UI kits:
- `ui_kits/web/` — marketing + product web surfaces. Click-thru of quiz → results → compare → salary calc.

---

## CONTENT FUNDAMENTALS

**Voice.** Calm, informed, practical. The product helps people make an expensive life decision; copy never hypes. It tells you what it knows, admits what it doesn't, and shows its math (there is a public `/methodology` page).

**Second person.** The reader is always **"you"** — "Find the best European city for **your** life, family, and finances." The brand rarely uses "we"; when it does, it's to reference the team's methodology ("How **we** score cities").

**Sentence case.** Titles and buttons are **sentence case**, not Title Case. Allowed exceptions: proper nouns (Netherlands, Berlin), brand name (Expatflix), and section labels that read as headings ("Best For", "Family Fit" — sparingly).

**Numbers are first-class.** Copy foregrounds concrete numbers over adjectives. "12 countries available now", "{safetyIndex}/100", "€{k}k median salary", "{sunnyDaysPerYear} sunny days". Never "world-class", "best-in-class", "amazing".

**Short, declarative headlines + one supporting line.** The home hero is `h1` + single paragraph; section intros are `h2` + a 10–15 word sentence. Never stacked taglines.

**Button labels are verbs.** "Take the quiz", "Browse countries", "Compare cities", "Explore". Not "Click here", not "Learn more" as a fallback.

**No emoji in product chrome.** Flags (🇳🇱 🇫🇷 🇩🇪) appear as `country.flagEmoji` inside country tiles and that's it. No decorative emoji in nav, CTAs, empty states, or microcopy.

**Honest disclaimers.** Footers and methodology pages say things like "Data provided for informational purposes only. Not financial or legal advice." Keep that posture anywhere a user might act on a number.

**Example copy lifted from the repo:**
- Hero: *"Find the best European city for your life, family, and finances"* / *"A structured decision tool that combines personalized recommendations, salary estimation, and city comparison to help you choose where to live in Europe."*
- Nav: "Where to Move" · "Calculate Salary" · "Compare Cities" · "Settle Down" · "Schools & Family"
- How it works: *"1. Take the Quiz — Answer 10 questions about your preferences, lifestyle, and priorities to get personalized city recommendations."*
- Empty state: *"Select two cities above to see their comparison"*
- Footer: *"A relocation intelligence tool."*

---

## VISUAL FOUNDATIONS

**Palette.** Two-token system: **ink** (near-black `#0a0f0d`, cool slight-green cast) and **green** (`#12b76a` primary, `#039855` hover). Everything else is paper (`#fafaf7` ground, `#ffffff` card) and a neutral ink ramp for borders/meta. The accent green is used **surgically** — active nav underline, primary CTAs, "Better" markers in comparisons, icon accent color on "how it works" tiles. Never for full-screen backgrounds. This is deliberate: the brand posture is trusted + sober, not vibrant.

**Dark sections for hero emphasis only.** The home hero is a full-bleed `bg-primary` (ink) block with white text and a green CTA; the rest of the page is light. Use dark reversal for one hero per page max.

**Type.** Display is **Fraunces** (serif, semibold 600) — `h1`/`h2`/`h3` in the editorial-headline slot. Body is **Inter** (400/500/600/700). Mono is **JetBrains Mono** for numerics-heavy tools (calculator outputs, embed code). Serif + sans pairing signals "research, not startup."

**Scale.** `12 · 14 · 16 · 18 · 20 · 24 · 32 · 40 · 52 · 64`. Tight tracking (`-0.02em`) on display sizes; normal on body. Line-height is generous (1.5 body, 1.65 long-form paragraphs).

**Spacing.** 4px base grid (`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`). Section vertical padding is `py-16` (64px) on light sections, `py-20`–`py-28` on hero blocks. Card internal padding is `p-6` (24px).

**Backgrounds.** No gradients. No hand-drawn illustrations. No repeating patterns. The ground is a flat warm off-white (`--brand-paper` `#fafaf7`); alternating sections use white (`--bg-2`) and ink-50 (`--bg-3`) to separate rhythm. Imagery, when present, is **editorial photography of European cities** — wide, slightly cool, natural light, never filtered/warmed.

**Corner radii.** Medium. Cards `rounded-xl` (12px), buttons/inputs `rounded-md` (6–8px), small pills `rounded-full`. Never sharp 0px; never iOS-level 20px+ on body surfaces (only on modals).

**Shadows.** Very light. `shadow-sm` on cards at rest; `hover:shadow-md` with a `-translate-y-0.5` lift on city cards. No heavy drop shadows or glows. The existing repo even uses a subtle "hover-elevate" pseudo-element that lightly washes on hover instead of casting shadow — we keep that spirit.

**Borders.** Present, not bold. 1px solid `--border-1` (`#e5e9e7`). Compare rows, inputs, cards, and dropdowns all lean on borders rather than shadows for separation. Dividers inside cards use `--border-1` too.

**Hover states.** For cards: `shadow-sm → shadow-md` + 2px lift, title color shifts ink → green. For links/nav: text color shifts muted → green, and active nav items gain a 2px **green underline** below text. For buttons: a subtle internal overlay (the repo's `hover-elevate` pattern — 3% black wash on top) rather than full color change.

**Press / active states.** Overlay darkens to ~8% black (`hover-elevate-2`); no shrink/scale. Destructive buttons keep their red fill, no shift.

**Focus.** Green ring, 3px, 25% alpha: `0 0 0 3px hsl(152 96% 36% / 0.25)`. Always visible on keyboard focus.

**Transparency + blur.** Sparingly. Header gets a `shadow-sm` after scroll (no blur backdrop). Compact "count" pills in the hero use `bg-white/10` on the dark block. No frosted-glass modals.

**Animation.** Subtle, functional. Card lift + shadow on hover (150ms). Nav underline appears instantly (no slide). No bouncy springs, no entrance animations, no scroll-linked parallax. `framer-motion` is a dependency but is used for quiz-step transitions only (gentle fade + 8px slide).

**Cards.** `rounded-xl`, white background, 1px border (`--border-1`), `shadow-sm` at rest. Hover: `shadow-md` + 2px lift. No colored left-border accents. No tinted backgrounds. No gradient headers. City cards have a small 2×2 stat grid inside with `bg-muted/50 rounded-md` cells.

**Compare row (signature pattern).** Three columns: left value | label (center, bordered) | right value. Winning side gets a subtle `bg-accent/10` wash and a "Better" tag with a green check. No bars, no percentages — just the number and the delta.

**Layout.** Center-aligned, max-width `container mx-auto px-4` (Tailwind container). Long-form pages cap at `max-w-3xl` or `max-w-4xl`. No full-bleed-content on body surfaces (only heroes).

**Fixed elements.** A single sticky top nav (`sticky top-0 z-50`). No floating help widgets, no cookie banners in the design surface (handled by a separate first-visit banner if required).

**Color vibe of imagery.** Cool daylight, natural contrast, European urban. Avoid: warm filters, heavy grain, black & white, golden-hour editorialization. Think: overcast Amsterdam at 11am, not "Instagram Lisbon".

---

## ICONOGRAPHY

**System.** The repo uses **`lucide-react`** exclusively (plus `react-icons` for a few brand marks). Stroke-based, 1.5–2px, rounded caps, 24px grid, sized via Tailwind `w-{n} h-{n}`.

**Where used.**
- In CTAs: `<ArrowRight>` after "Explore"/"Take the Quiz", `<Compass>` before "Take the Quiz", `<Calculator>` in salary tools, `<Scale>` for compare.
- In section headers: `<Globe>`, `<BarChart3>`, `<MapPin>`.
- In comparison rows: `<Check>` for "Better", `<Minus>` for "Equal".
- As empty-state decoration: large (`w-12 h-12`), `opacity-30`, muted-foreground color.

**Color.** Icons inherit `currentColor`. In the ink-on-white palette that means `--fg-1` by default, `--accent-foreground` inside green CTAs, and `text-accent` for the decorative "how it works" tiles (green on `bg-accent/10`).

**Sizing conventions.**
- Inline in nav/buttons: `w-4 h-4` (16px) or `w-3.5 h-3.5` (14px) for compact rows.
- Next to `size="lg"` buttons: `w-5 h-5`.
- "How it works" tiles: `w-7 h-7` inside a `w-14 h-14` rounded square.
- Empty-state hero icons: `w-12 h-12` with `opacity-30`.

**Custom assets.**
- `assets/favicon-original.svg` — the repo's existing globe favicon (kept for reference).
- `assets/logo-mark.svg` / `logo-horizontal.svg` / `logo-horizontal-green.svg` — placeholder lockups in the new palette. **Replace with real logo.**
- `assets/opengraph.jpg` — the repo's existing OG image.

**Emoji.** Country flags (🇳🇱 🇫🇷 🇩🇪…) are used **inside country-card avatar squares only**, via `country.flagEmoji` from the data file. Nowhere else in the product.

**Unicode.** `€` for euros (never "EUR" or "Euros"). `·` as a soft separator in meta rows. `/` as the delimiter in `{value}/100` scores. Avoid em-dashes in microcopy (too editorial for numeric rows).

**Don't.** Don't mix icon libraries mid-surface. Don't fill lucide outlines. Don't recolor icons to semantic reds/ambers unless the context is already destructive/warning.

---

## Skill

See `SKILL.md` to use this system as an Agent Skill in Claude Code.
