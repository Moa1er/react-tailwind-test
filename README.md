# Camera PWA

A minimal full-screen camera Progressive Web App built with React, Tailwind CSS, and `react-webcam`. It streams the device camera, lets you capture a still frame, retake, or save the image locally, and is optimized for mobile browsers.

## Running locally

No build step is required. Start a static file server from the project root (the provided helper matches the required `ng serve` command):

```bash
node ./bin/ng.js serve
```

Or use Python directly:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173` in your browser. On first load, tap **Enable camera** and accept the permission prompt. If the preview stays black, try switching cameras or refreshing after granting access.

## Features
- Full-screen camera preview with front/back toggle.
- Large capture button that freezes the frame.
- Captured photo overlay with **Retake** and **Save** options.
- Automatic image download on save.
- PWA manifest and service worker for installability.
- In-app loading hint when the camera stream is still initializing.
