/**
 * Static prerender script — runs after `vite build`.
 *
 * react-helmet-async v3 renders <head> tags inline at the *start* of the
 * renderToString output; we split there so they land in <head>, not in <body>.
 *
 * For each route in src/routes.ts:
 *   1. Renders React app via Vite's SSR module loader (no Puppeteer).
 *   2. Splits Helmet head tags from body HTML at the first block element.
 *   3. Injects both into the built index.html template.
 *   4. Writes dist/public/<route>/index.html.
 *
 * Also emits dist/public/sitemap.xml and dist/public/robots.txt.
 */
import { createServer } from "vite";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root    = path.resolve(__dirname, "..");
const outDir  = path.resolve(root, "dist/public");
const rawBase = process.env.BASE_PATH ?? "/";
const SITE    = "https://expatlix.com";

/** Split point: Helmet head tags appear before the first block-level element. */
const BODY_START_RE = /<(div|header|main|section|article|nav|footer|ul|ol)\b/;

/** Extract body HTML — the react-helmet-async inline head precedes the first block element. */
function extractBody(rawHtml) {
  const m = rawHtml.match(BODY_START_RE);
  return m ? rawHtml.slice(m.index) : rawHtml;
}

/**
 * Build canonical <head> tags from route.seo.
 * We always derive head tags from our route data (not from Helmet's SSR output)
 * so dynamic routes (/countries/netherlands, etc.) get their specific titles.
 */
function buildHead(route) {
  const esc = (s) => String(s).replace(/"/g, "&quot;");
  const t = esc(route.seo.title);
  const d = esc(route.seo.description);
  const url = `${SITE}${route.path}`;
  return [
    `<title>${route.seo.title}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary" />`,
    route.seo.schema
      ? `<script type="application/ld+json">${JSON.stringify(route.seo.schema)}</script>`
      : null,
  ].filter(Boolean).join("\n    ");
}

async function main() {
  // ── 1. Vite dev server — handles TS/JSX/CSS/path-aliases via ssrLoadModule ──
  const vite = await createServer({
    root,
    base: rawBase,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "warn",
  });

  // ── 2. Load route list, data files, and the SSR render function ─────────────
  const [{ expandRoutes }, { countries }, { cities }, { render }] = await Promise.all([
    vite.ssrLoadModule("/src/routes.ts"),
    vite.ssrLoadModule("/src/data/countries.ts"),
    vite.ssrLoadModule("/src/data/cities.ts"),
    vite.ssrLoadModule("/src/entry-server.tsx"),
  ]);

  const routes   = expandRoutes(countries, cities);
  const template = await fs.readFile(path.join(outDir, "index.html"), "utf-8");
  // Strip the generic <title> from the template; each route gets its own.
  const baseTemplate = template.replace(/\s*<title>[^<]*<\/title>/, "");

  // ── 3. Render each route ─────────────────────────────────────────────────────
  let ok = 0, skipped = 0;
  for (const route of routes) {
    let bodyHtml = "";
    try {
      const { html: rawHtml } = await render(route.path);
      bodyHtml = extractBody(rawHtml);
      ok++;
    } catch (err) {
      // One broken route must not abort the entire build — omit body, keep head.
      console.warn(`  ⚠  ${route.path}: ${err.message.split("\n")[0]}`);
      skipped++;
    }

    // Head tags always come from route.seo — correct for static AND dynamic routes.
    const html = baseTemplate
      .replace("</head>", `  ${buildHead(route)}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

    const dir = route.path === "/" ? outDir : path.join(outDir, route.path);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.html"), html);
  }

  await vite.close();

  // ── 4. sitemap.xml ──────────────────────────────────────────────────────────
  const sitemap = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...routes.map((r) => `  <url><loc>${SITE}${r.path}</loc></url>`),
    `</urlset>`,
  ].join("\n");
  await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap + "\n");

  // ── 5. robots.txt ───────────────────────────────────────────────────────────
  await fs.writeFile(
    path.join(outDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`,
  );

  console.log(`✓ Prerendered ${ok} routes (${skipped} with fallback head only)`);
  console.log(`✓ sitemap.xml + robots.txt → dist/public/`);
}

main().catch((err) => { console.error(err); process.exit(1); });
