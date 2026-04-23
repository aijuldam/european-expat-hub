# Expatlix Brand Assets

## Logo files (canonical source of truth)

| File | Use |
|------|-----|
| `expatlix-mark.svg` | Primary icon mark — dark background (`#0b0f0d`). Use on light pages, print, social avatars. |
| `expatlix-mark-inverse.svg` | Icon mark — white background. Use on dark sections, email headers, dark-mode contexts. |
| `expatlix-lockup-horizontal.svg` | Full horizontal lockup (mark + EXPATLIX wordmark + tagline). Use in headers, presentations, OG images, email banners. |
| `expatlix-favicon.svg` | Icon mark with rounded corners, 64×64 optimised. Use as favicon, app icon, small placements. |

All files live at `/public/logo/` in the project and are served at `/logo/*.svg` on the live site.

## Brand colours

| Token | Hex | Usage |
|-------|-----|-------|
| Near-black | `#0b0f0d` | Logo background, deep contrast elements |
| White | `#ffffff` | Logo mark foreground, text on dark |

Site design-system colours (Tailwind tokens) are defined in `src/index.css`.

## Usage rules

- **Always use the SVG files** — never recreate or redraw the mark freehand.
- On **light backgrounds**: use `expatlix-mark.svg` (dark icon) or `expatlix-mark-inverse.svg`.
- On **dark/primary-colour backgrounds**: use `expatlix-mark-inverse.svg` (dark mark on white) or embed the mark SVG inline and override fill via CSS.
- **Minimum clear space**: equal to the width of the dot (map pin circle) on all sides.
- **Minimum size**: 24 × 24 px for the favicon/mark; 200 px wide for the lockup.
- **Do not** stretch, recolour, add drop shadows, or modify the SVG paths.

## Web integration

### Nav logo (TopNav.tsx)
```tsx
<img src="/logo/expatlix-favicon.svg" alt="Expatlix" className="w-8 h-8 flex-shrink-0" />
```

### Email / marketing HTML banner
```html
<img src="https://expatlix.com/logo/expatlix-lockup-horizontal.svg"
     alt="Expatlix" width="300" height="80" style="display:block;" />
```

### Favicon (index.html)
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/logo/expatlix-favicon.svg" />
```

### OG / social card
Use `expatlix-lockup-horizontal.svg` at 1200 × 630 px cropped, or generate a PNG from it for platforms that don't support SVG in og:image.
