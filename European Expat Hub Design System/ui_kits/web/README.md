# Expatflix — Web UI kit

An interactive click-thru recreation of the Expatflix website. Built with inline React + Babel; components split into small files and loaded via `<script type="text/babel" src>` in `index.html`.

## Flow

`index.html` boots the component chain. The top nav switches between six views:

- **Home** — editorial hero, index, how-it-works, featured cities, countries.
- **Quiz** — 4-step quiz with progress rail and inline selection states.
- **Results** — top 3 city matches with score strips.
- **Compare** — two-city side-by-side with subtle "Better" markers.
- **Calculator** — gross-to-net salary for NL/FR/DE/HU with 30% ruling toggle.
- **Settle down** — long-form guides grid.

## Files

- `index.html` — shell + React/Babel bootstrap + script imports.
- `styles.css` — all styling, derived from root `colors_and_type.css`.
- `data.jsx` — cities, countries, quiz data, icon set.
- `chrome.jsx` — `TopNav`, `Footer`, `PageHead` shared chrome.
- `home.jsx` — `Home` page sections.
- `quiz.jsx` — `Quiz` + `Results` pages.
- `compare.jsx` — `Compare` page.
- `calc.jsx` — `SalaryCalc` page.
- `guides.jsx` — `Guides` page.
- `app.jsx` — top-level `App` that composes everything. Loaded last.

## Design direction

- **Sharp, editorial.** 2px corner radii on buttons + inputs, 4px on cards. No soft shadows — hairline borders do the separation.
- **Uppercase tracked labels** for nav, buttons, eyebrows. Matte ink primary, deep forest accent used surgically.
- **Serif display / sans body.** Fraunces for headlines, Inter for body, JetBrains Mono for numerics + meta labels.
- **Dark editorial hero** with an "issue index" mini-table on the home page — echoes a printed journal.
