# OpenGradient PFP Generator

A single-page web app that generates OpenGradient-branded profile pictures.

## What it does
1. User uploads their profile picture
2. Background is removed via Replicate API (`cjwbw/rembg`)
3. Person is composited onto an OpenGradient-branded background using HTML5 Canvas
4. Output is a 1:1 square PNG ready to download and use as a profile picture

## Stack
- Pure HTML/CSS/JS — no framework, no build step
- Replicate API (`cjwbw/rembg`) for background removal
- HTML5 Canvas for image compositing
- Node.js proxy server (`server.js`) to bypass CORS — run with `node server.js`, visit `http://localhost:3000`

## API
- **Provider:** Replicate (`https://api.replicate.com`)
- **Model:** `cjwbw/rembg` — background removal, ~$0.0003/image
- **Token:** stored in `REPLICATE_TOKEN` const in `index.html` — never commit a real token
- Proxy prefix: frontend calls `/replicate/v1/...`, server forwards to `https://api.replicate.com/v1/...`

## Brand
### Colors
- `#24BCE3` — Caribbean Blue (PRIMARY — main brand color)
- `#0E4B5B` — Teal Dark Blue (dark background)
- `#E9F8FC` — Clear Skies (light accent)
- `#FFFFFF` — White

### Gradients
- Background: `linear-gradient(135deg, #0E4B5B, #0a2f3a)`
- Accent glow: radial from `#24BCE3` to transparent

### Fonts
- Primary: Geist (load from Bunny Fonts CDN)
- Secondary: Geist Mono

### Assets
- `assets/og-symbol-white.svg` — OG symbol (diamond/knot) in white, used as watermark on dark backgrounds

## Canvas Compositing
Output canvas: 1080×1080px (1:1 square)

Background layers (bottom to top):
1. Dark gradient fill: `#0E4B5B` → `#0a2f3a` (top-left to bottom-right)
2. Subtle radial glow: `#24BCE3` soft circle, ~0.15 opacity, centered bottom
3. OG symbol watermark: white SVG, bottom-right corner, ~20% canvas width, ~0.12 opacity
4. Subject: rembg-processed PNG, centered, scaled to fill ~80-85% of canvas height

## Cost Estimate
- `cjwbw/rembg`: ~$0.0003/image
- 1,000 users: ~$0.30
- 15,000 users: ~$4.50

## Notes
- Run `node server.js` to start the proxy (port 3000)
- REPLICATE_TOKEN must be set in `index.html` at runtime — never commit a real token
- Output canvas should be 1080×1080 for best PFP quality
- Caribbean Blue (`#24BCE3`) is the PRIMARY brand color — use it for UI accents, CTAs, highlights
