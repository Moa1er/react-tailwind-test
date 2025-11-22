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
