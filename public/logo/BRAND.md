# Expatlix Brand Assets

## Logo files (canonical source of truth — v2)

| File | Background | Use |
|------|-----------|-----|
| `expatlix-mark.svg` | Dark `#0b0f0d` | Primary icon mark. Use on light pages, print, social avatars. |
| `expatlix-mark-inverse.svg` | White `#ffffff` | Icon mark on light bg. Use on dark sections or forced-light contexts. |
| `expatlix-favicon.svg` | Dark, rounded corners | Favicon, nav icon, app icon, small placements on any bg. |
| `expatlix-favicon-inverse.svg` | White, rounded corners | Favicon/icon on dark backgrounds. |
| `expatlix-lockup-horizontal.svg` | Dark `#0b0f0d` | Full lockup: mark + "expatlix" wordmark (Fraunces italic) + tagline. Headers, presentations, OG images, email banners. |
| `expatlix-lockup-horizontal-inverse.svg` | White `#ffffff` | Lockup on light backgrounds. |
| `expatlix-wordmark.svg` | Dark `#0b0f0d` | Wordmark + tagline only (no mark). Secondary use, co-branding. |
| `expatlix-wordmark-inverse.svg` | White `#ffffff` | Wordmark on light backgrounds. |

All files live at `/public/logo/` in the project and are served at `/logo/*.svg` on the live site.

## Brand colours

| Token | Hex | Usage |
|-------|-----|-------|
| Near-black | `#0b0f0d` | Logo background, deep contrast elements |
| White | `#ffffff` | Logo mark foreground, text on dark |

Site design-system colours (Tailwind tokens) are defined in `src/index.css`.

## Typefaces

| Role | Font | Style |
|------|------|-------|
| Wordmark / lockup | Fraunces | 500 italic, letter-spacing -2 |
| Tagline | Inter | 600, uppercase, letter-spacing 6–8 |

## Usage rules

- **Always use the SVG files** — never recreate or redraw the mark freehand.
- On **light backgrounds**: use dark-background variants (`expatlix-mark.svg`, `expatlix-favicon.svg`).
- On **dark/primary-colour backgrounds**: use inverse variants (`*-inverse.svg`).
- **Minimum clear space**: equal to the width of the dot (map pin circle) on all sides.
- **Minimum size**: 24 × 24 px for the favicon/mark; 200 px wide for the lockup.
- **Do not** stretch, recolour, add drop shadows, or modify the SVG paths.

## Web integration

### Nav logo (TopNav.tsx)
```tsx
<img src="/logo/expatlix-favicon.svg" alt="Expatlix" className="w-8 h-8 flex-shrink-0" />
```

### Footer logo (Footer.tsx)
```tsx
<img src="/logo/expatlix-favicon.svg" alt="Expatlix" className="w-12 h-12" />
```

### Email / marketing HTML banner (dark background)
```html
<img src="https://expatlix.com/logo/expatlix-lockup-horizontal.svg"
     alt="Expatlix" width="300" height="80" style="display:block;" />
```

### Email / marketing HTML banner (light background)
```html
<img src="https://expatlix.com/logo/expatlix-lockup-horizontal-inverse.svg"
     alt="Expatlix" width="300" height="80" style="display:block;" />
```

### Favicon (index.html)
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/logo/expatlix-favicon.svg" />
```

### OG / social card
Use `expatlix-lockup-horizontal.svg` at 1200 × 320 or generate a PNG from it for platforms that don't support SVG in og:image.
