import React, { useCallback, useEffect, useMemo, useRef, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const e = React.createElement;

const SwitchCameraIcon = ({ className = '' }) =>
  e(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor', className },
    e('path', {
      d: 'M12 6c1.03 0 2.02.24 2.9.7l1.45-1.45A7.963 7.963 0 0 0 12 4C8.69 4 5.86 6.05 4.95 9H2l3 3 3-3H5.06C5.86 7.19 8.09 6 12 6zm7 3h-2.05c-.8-1.81-3.03-3-6.95-3-.99 0-1.95.15-2.83.43l1.48 1.48C9.2 7.66 10.09 7.5 11 7.5c3.31 0 6 2.69 6 6 0 1.38-.47 2.65-1.26 3.65l1.46 1.46C18.83 17.04 19.5 15.59 19.5 14c0-2.21-1.79-4-4-4l1.86-1.86L18 9z',
    })
  );

const OverlayButton = ({ label, onClick, variant = 'light' }) => {
  const base =
    'px-4 py-2 rounded-full font-semibold text-sm shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
  const styles =
    variant === 'light'
      ? 'bg-white text-black hover:bg-gray-100 focus:ring-white'
      : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-200';
  return e(
    'button',
    {
      type: 'button',
      onClick,
      className: `${base} ${styles}`,
    },
    label
  );
};

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const videoConstraints = useMemo(
    () => ({ facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }),
    [facingMode]
  );

  const stopStream = useCallback(() => {
    const current = streamRef.current;
    if (current) {
      current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser.');
      return;
    }

    setIsRequesting(true);
    setError('');

    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      setPermissionGranted(true);
      setIsReady(true);
    } catch (err) {
      console.error('Camera permission error', err);
      setPermissionGranted(false);
      setIsReady(false);
      setError('Camera permission is required. Please allow access and try again.');
    } finally {
      setIsRequesting(false);
    }
  }, [stopStream, videoConstraints]);

  const requestCameraAccess = useCallback(async () => {
    await startStream();
  }, [startStream]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = canvasRef.current ?? (canvasRef.current = document.createElement('canvas'));
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const shot = canvas.toDataURL('image/png');
    setCapturedImage(shot);
    video.pause();
  }, []);

  const retake = useCallback(() => {
    setCapturedImage(null);
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    } else if (permissionGranted) {
      startStream();
    }
  }, [permissionGranted, startStream]);

  const saveImage = useCallback(() => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `camera-shot-${Date.now()}.png`;
    link.click();
  }, [capturedImage]);

  const toggleCamera = useCallback(() => {
    setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'));
    setIsReady(false);
  }, []);

  useEffect(() => {
    if (!capturedImage && videoRef.current?.paused && streamRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [capturedImage]);

  useEffect(() => {
    if (permissionGranted && !capturedImage) {
      startStream();
    }
  }, [permissionGranted, capturedImage, startStream]);

  useEffect(() => () => stopStream(), [stopStream]);

  return e(
    'div',
    { className: 'relative h-full w-full bg-black text-white overflow-hidden select-none' },
    [
      e(
        'div',
        { key: 'viewer', className: 'relative h-full w-full' },
        capturedImage
          ? e('img', {
              src: capturedImage,
              alt: 'Captured photograph',
              className: 'absolute inset-0 w-full h-full object-cover',
            })
          : e('video', {
              ref: videoRef,
              muted: true,
              autoPlay: true,
              playsInline: true,
              className: 'absolute inset-0 w-full h-full object-cover bg-black',
            })
      ),
      (!isReady || !permissionGranted) && !capturedImage
        ? e(
            'div',
            {
              key: 'loading',
              className:
                'absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-black/80 to-black/40 text-center px-6 space-y-4',
            },
            [
              e('div', { className: 'text-lg font-semibold' }, 'Enable your camera to get started'),
              e(
                'p',
                { className: 'text-sm text-gray-200 max-w-xs' },
                'Tap the button below and accept the permission prompt. If the preview stays black, try switching cameras or refreshing after granting access.',
              ),
              e(
                'button',
                {
                  type: 'button',
                  onClick: requestCameraAccess,
                  disabled: isRequesting,
                  className:
                    'px-5 py-2 rounded-full bg-white text-black font-semibold shadow disabled:opacity-70 disabled:cursor-not-allowed',
                },
                isRequesting ? 'Requesting…' : 'Enable camera'
              ),
            ]
          )
        : null,
      error
        ? e(
            'div',
            {
              key: 'error',
              className:
                'absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow text-sm',
            },
            error
          )
        : null,
      e(
        'button',
        {
          key: 'switch',
          type: 'button',
          onClick: toggleCamera,
          className:
            'absolute top-4 right-4 bg-white/10 backdrop-blur rounded-full p-2 border border-white/20 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50',
          'aria-label': 'Switch camera',
        },
        e(SwitchCameraIcon, { className: 'w-6 h-6' })
      ),
      capturedImage
        ? e(
            'div',
            {
              key: 'overlay',
              className: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 space-y-3',
            },
            e(
              'div',
              { className: 'flex justify-center space-x-3' },
              [
                e(OverlayButton, { key: 'retake', label: 'Retake', onClick: retake, variant: 'dark' }),
                e(OverlayButton, { key: 'save', label: 'Save', onClick: saveImage }),
              ]
            )
          )
        : e(
            'div',
            { key: 'capture', className: 'absolute inset-0 pointer-events-none flex items-end justify-center pb-8' },
            e(
              'div',
              {
                className:
                  'w-24 h-24 rounded-full bg-white border-4 border-gray-200 shadow-lg scale-100 active:scale-95 transition transform pointer-events-auto flex items-center justify-center',
              },
              e('button', {
                type: 'button',
                onClick: capture,
                disabled: !isReady || !permissionGranted,
                className:
                  'w-16 h-16 rounded-full bg-white shadow-inner border border-gray-300 hover:scale-105 active:scale-95 transition focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed',
                'aria-label': 'Capture photo',
              })
            )
          ),
    ]
  );
}

const root = createRoot(document.getElementById('root'));
root.render(e(App));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('Service worker registration failed', err);
    });
  });
}
