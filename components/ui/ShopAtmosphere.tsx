'use client';

import React, { useEffect, useRef } from 'react';

interface ShopAtmosphereProps {
  isRainActive?: boolean;
}

export const ShopAtmosphere: React.FC<ShopAtmosphereProps> = ({
  isRainActive = false,
}) => {
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);

  // Atmospheric Rain & Lightning Engine
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const dropCount = 120;
    const drops: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 18 + 10,
        speed: Math.random() * 10 + 12,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    // Occasional lightning flash
    let lightningTimer: NodeJS.Timeout | null = null;
    const triggerLightning = () => {
      if (!isRainActive || !flashOverlayRef.current) return;
      flashOverlayRef.current.style.opacity = '0.35';
      setTimeout(() => {
        if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0';
        setTimeout(() => {
          if (flashOverlayRef.current && Math.random() > 0.4) {
            flashOverlayRef.current.style.opacity = '0.2';
            setTimeout(() => {
              if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0';
            }, 60);
          }
        }, 80);
      }, 70);

      const nextDelay = Math.random() * 14000 + 8000;
      lightningTimer = setTimeout(triggerLightning, nextDelay);
    };

    if (isRainActive) {
      lightningTimer = setTimeout(triggerLightning, 4000);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isRainActive) {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';

        drops.forEach((d) => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.length);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 1.5;

          if (d.y > height) {
            d.y = -20;
            d.x = Math.random() * (width + 100);
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (lightningTimer) clearTimeout(lightningTimer);
    };
  }, [isRainActive]);

  return (
    <>
      {/* Authentic Indian 1990s Cassette Shop Background Banner (Responsive Desktop & Mobile) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#120806]">
        <picture className="w-full h-full block">
          {/* Mobile Screens (< 640px): Dedicated vertical 9:16 portrait banner */}
          <source
            media="(max-width: 640px)"
            srcSet="/cassette-shop-bg-mobile.jpg"
          />
          {/* Desktop & Tablets (>= 640px): Wide landscape 16:9 banner */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cassette-shop-bg.jpg"
            alt="Dubeyji Music Center 1990s Indian Cassette Shop Background Banner"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
          />
        </picture>

        {/* Subtle top & bottom edge vignette to keep header & music player perfectly readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />
      </div>

      {/* Rain canvas */}
      <canvas
        ref={rainCanvasRef}
        id="rainCanvas"
        className={isRainActive ? 'active' : ''}
      />

      {/* Lightning screen flash */}
      <div ref={flashOverlayRef} id="lightningFlashOverlay" />

      {/* Subtle warm analog grain */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-15 mix-blend-overlay bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
    </>
  );
};
