# OpenGradient PFP Generator

A single-page web app that places OpenGradient-branded sunglasses on uploaded profile pictures using face detection and canvas compositing.

## What it does
- User uploads their profile picture
- face-api.js detects facial landmarks (eye positions) in the browser
- The OG sunglasses image is scaled, rotated, and composited precisely over the eyes
- User downloads the result and sets it as their profile picture

## Stack
- Pure HTML/CSS/JS — no framework, no build step
- face-api.js (CDN) for in-browser face landmark detection
- HTML5 Canvas for image compositing
- Run by opening `index.html` directly in a browser

## Assets
- `assets/sunglasses.png` — OG sunglasses with OpenGradient logo on the side (transparent PNG, tight crop)

## Implementation Phases

### Phase A — Project Setup
- [x] Create `assets/` folder
- [x] Save OG sunglasses as `assets/sunglasses.png` (transparent PNG)
- [x] Update CLAUDE.md

### Phase B — Face Detection
- [x] Load face-api.js from CDN (@vladmandic/face-api)
- [x] Load tinyFaceDetector + faceLandmark68 models
- [x] On image upload, run landmark detection to get left/right eye coordinates

### Phase C — Canvas Compositing Engine
- [x] Calculate sunglasses position from eye midpoint
- [x] Calculate rotation angle from eye-to-eye vector
- [x] Calculate scale from inter-eye distance (3.2x eyeDist)
- [x] White background removal from sunglasses PNG (threshold 235)
- [x] Draw user photo on canvas, overlay sunglasses
- [x] Export composited canvas as PNG for download

### Phase D — UI Cleanup
- [x] Remove Replicate API code
- [x] Simplified UI: upload → detect → composite → download
- [x] Loading state while face detection runs
- [x] Error state: no face detected

### Phase E — Polish & Edge Cases
- [ ] Handle multiple faces
- [ ] Fine-tune scale/offset constants for best fit
- [ ] Optional manual adjustment slider (scale/vertical offset)
- [ ] Final visual QA

## Commit Convention
Always use 1-liner with `;` (PowerShell): `git add . ; git commit -m "message" ; git push`

## Notes
- face-api.js models must be served over HTTP (not file://) — use VS Code Live Server or similar
- Do NOT commit `index.html` with Replicate token filled in
