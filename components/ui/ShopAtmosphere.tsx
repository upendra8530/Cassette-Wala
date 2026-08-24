'use client';

import React, { useEffect, useRef } from 'react';

interface ShopAtmosphereProps {
  crtEnabled?: boolean;
}

export const ShopAtmosphere: React.FC<ShopAtmosphereProps> = ({
  crtEnabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle floating dust motes in warm cassette shop lighting
  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Dust particles
    const particleCount = 28;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.3 - 0.05,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

        // Wrap around screen
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 179, 58, ${Math.max(0.05, Math.min(0.5, p.opacity))})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(243, 179, 58, 0.4)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Floating dust canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10 opacity-70"
      />

      {/* Film Grain & Paper Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-20 opacity-20 mix-blend-overlay bg-[radial-gradient(#d99b26_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* CRT Scanline & Curved Glass Texture if enabled */}
      {crtEnabled && (
        <div className="pointer-events-none fixed inset-0 z-30 opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-flicker" />
      )}
    </>
  );
};
