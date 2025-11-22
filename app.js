import React, { useCallback, useMemo, useRef, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import Webcam from 'https://esm.sh/react-webcam@7.1.1';

const e = React.createElement;

const SwitchCameraIcon = ({ className = '' }) =>
  e(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      className,
    },
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
      onClick,
      className: `${base} ${styles}`,
      type: 'button',
    },
    label
  );
};

function App() {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');

  const videoConstraints = useMemo(() => ({ facingMode }), [facingMode]);

  const onUserMediaError = useCallback((err) => {
    console.error('Camera error', err);
    setError('Could not access the camera. Please check permissions.');
  }, []);

  const onUserMedia = useCallback(() => {
    setError('');
  }, []);

  const capture = useCallback(() => {
    const webcam = webcamRef.current;
    if (!webcam || typeof webcam.getScreenshot !== 'function') return;
    const shot = webcam.getScreenshot();
    if (shot) {
      setCapturedImage(shot);
      if (webcam.video && !webcam.video.paused) {
        webcam.video.pause();
      }
    }
  }, []);

  const retake = useCallback(() => {
    const webcam = webcamRef.current;
    setCapturedImage(null);
    if (webcam && webcam.video) {
      webcam.video.play().catch(() => {});
    }
  }, []);

  const saveImage = useCallback(() => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `camera-shot-${Date.now()}.png`;
    link.click();
  }, [capturedImage]);

  const toggleCamera = useCallback(() => {
    setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'));
  }, []);

  const renderOverlay = () => {
    if (capturedImage) {
      return e(
        'div',
        { className: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 space-y-3' },
        e('div', { className: 'flex justify-center space-x-3' }, [
          e(OverlayButton, { key: 'retake', label: 'Retake', onClick: retake, variant: 'dark' }),
          e(OverlayButton, { key: 'save', label: 'Save', onClick: saveImage }),
        ])
      );
    }
    return e(
      'div',
      { className: 'absolute inset-0 pointer-events-none flex items-end justify-center pb-8' },
      e(
        'div',
        {
          className:
            'w-24 h-24 rounded-full bg-white border-4 border-gray-200 shadow-lg scale-100 active:scale-95 transition transform pointer-events-auto flex items-center justify-center',
        },
        e(
          'button',
          {
            onClick: capture,
            className:
              'w-16 h-16 rounded-full bg-white shadow-inner border border-gray-300 hover:scale-105 active:scale-95 transition focus:outline-none',
            type: 'button',
            'aria-label': 'Capture photo',
          },
          ''
        )
      )
    );
  };

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
          : e(Webcam, {
              ref: webcamRef,
              audio: false,
              screenshotFormat: 'image/png',
              screenshotQuality: 1,
              videoConstraints,
              mirrored: facingMode === 'user',
              onUserMediaError,
              onUserMedia,
              forceScreenshotSourceSize: true,
              className: 'absolute inset-0 w-full h-full object-cover',
              playsInline: true,
            })
      ),
      error
        ? e(
            'div',
            { key: 'error', className: 'absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow' },
            error
          )
        : null,
      e(
        'button',
        {
          key: 'switch',
          onClick: toggleCamera,
          className:
            'absolute top-4 right-4 bg-white/10 backdrop-blur rounded-full p-2 border border-white/20 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50',
          type: 'button',
          'aria-label': 'Switch camera',
        },
        e(SwitchCameraIcon, { className: 'w-6 h-6' })
      ),
      renderOverlay(),
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
