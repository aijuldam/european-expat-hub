# European Expat Hub — Developer Notes

## How to add a new route and its SEO metadata

1. **Add the wouter `<Route>`** in `src/App.tsx` (routing stays there — don't change the router).
2. **Register the route** in `src/routes.ts` → `staticRoutes` array with a `path`, `title`, `description`, and optionally a `schema` object for JSON-LD. Dynamic routes (new country, new city) are generated automatically by `expandRoutes()` from the data files — no manual entry needed.
3. **Run `pnpm build`** (or `npm run build`). The build runs `vite build` followed by `node scripts/prerender.mjs`, which server-renders every route in `src/routes.ts`, injects per-route `<title>`, Open Graph, Twitter Card, and canonical `<link>` tags into each `dist/public/<route>/index.html`, and emits `sitemap.xml` + `robots.txt`.
4. The CI workflow (`deploy.yml`) spot-checks that `<h1>` is present in the home page, a country page, and a tool page after the build — it will fail fast if prerendering breaks.
