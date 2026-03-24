'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 121;
const FRAME_PATH = '/images/hero-frames/frame_';
const BASE_FPS = 24;

function getFrameSrc(index: number): string {
  const padded = String(index + 1).padStart(3, '0');
  return `${FRAME_PATH}${padded}.webp`;
}

export default function HeroScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scrollYRef = useRef(0);
  const isVisibleRef = useRef(true);
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images[i] = img;
    }

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Visibility observer — pause animation when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Cache canvas size on resize instead of per-frame getBoundingClientRect
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasSizeRef.current = {
        w: rect.width * dpr,
        h: rect.height * dpr,
      };
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Draw a frame on the canvas (cover-fit)
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete) return;

    const { w, h } = canvasSizeRef.current;
    if (w === 0 || h === 0) return;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // Cover-fit calculation
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgRatio > canvasRatio) {
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }, []);

  // Track scroll
  useEffect(() => {
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animation loop — pauses when off-screen
  useEffect(() => {
    if (!loaded) return;

    drawFrame(0);
    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      // Skip rendering when not visible
      if (!isVisibleRef.current) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = now - lastTimeRef.current;

      const heroHeight = containerRef.current?.offsetHeight || window.innerHeight;
      const scrollProgress = Math.min(1, scrollYRef.current / heroHeight);
      const speedMultiplier = 1 - scrollProgress * 0.6;

      const interval = 1000 / (BASE_FPS * Math.max(0.2, speedMultiplier));

      if (delta >= interval) {
        lastTimeRef.current = now - (delta % interval);
        const nextFrame = (currentFrameRef.current + 1) % TOTAL_FRAMES;
        currentFrameRef.current = nextFrame;
        drawFrame(nextFrame);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, drawFrame]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#0a0a0a',
          }}
        />
      )}
    </div>
  );
}
