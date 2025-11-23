# Camera PWA

A minimal full-screen camera Progressive Web App built with React, Tailwind CSS, and `react-webcam`. It streams the device camera, lets you capture a still frame, retake, or save the image locally, and is optimized for mobile browsers.

## Running locally

This project does not require a build step. Start a static file server from the project root (for example, with Python):

```bash
python -m http.server 4173
```

Then open `http://localhost:4173` in your browser. The app pulls React, React DOM, Tailwind, and `react-webcam` from ESM/CDN endpoints, so an active internet connection is required on first load. The service worker caches local assets for quick reloads.

## Features
- Full-screen camera preview with front/back toggle.
- Large capture button that freezes the frame.
- Captured photo overlay with **Retake** and **Save** options.
- Automatic image download on save.
- PWA manifest and service worker for installability.

## AI suggestions with ChatGPT
The stand editor now requests marketing copy from ChatGPT without exposing your key to the browser. Configure it with the steps below:

1. Create an `OPENAI_API_KEY` project environment variable in Vercel (Settings → Environment Variables) or a local `.env` file based on `.env.example`. Never commit the actual key.
2. Deploy as usual; the Edge function at `/api/chatgpt` reads the key server-side and returns description, pros, and cons JSON.
3. For local development, run `vercel dev` (or configure your preferred Vite proxy) so the `/api/chatgpt` route is available. If the API is unreachable, the UI falls back to built-in sample suggestions.
