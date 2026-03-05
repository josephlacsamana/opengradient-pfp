# OpenGradient PFP Generator

A single-page web app that generates OpenGradient-branded profile pictures using the Replicate API.

## What it does
- User uploads their profile picture
- Optionally describes themselves and adds extra vibe/background
- Calls `google/nano-banana-pro` on Replicate to generate a stylized PFP with OpenGradient sunglasses
- User downloads the result and sets it as their profile picture

## Stack
- Pure HTML/CSS/JS — no framework, no build step
- Replicate API (`google/nano-banana-pro` image generation model)
- Run by opening `index.html` directly in a browser

## API
- **Provider:** Replicate (`https://api.replicate.com`)
- **Model:** `google/nano-banana-pro`
- **Token:** stored in `REPLICATE_TOKEN` const in `index.html`
- Supports optional `image` input (base64) for img2img if the model accepts it
- Falls back to text-to-image using the built prompt if no image input is supported

## Prompt structure
Built dynamically from user inputs:
```
Professional profile picture, portrait photo, [user description],
wearing stylish futuristic gradient sunglasses with purple-to-cyan gradient lens tint,
OpenGradient AI tech style, [extra vibe], high quality, photorealistic, 1:1 portrait
```

## Notes
- The Replicate token is hardcoded client-side — fine for personal/demo use, do not share publicly
- No server or dependencies required — just open the HTML file
