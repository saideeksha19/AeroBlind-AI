import { useEffect, useRef } from 'react';

interface DriftNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  tone: 'teal' | 'blue';
}

export function AtmosphericCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    const nodes: DriftNode[] = [];
    const NODE_COUNT = 28;

    const initSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * (width || 1200),
          y: Math.random() * (height || 640),
          vx: (Math.random() - 0.5) * 0.14 + 0.05,
          vy: (Math.random() - 0.5) * 0.1,
          radius: Math.random() * 1.4 + 0.8,
          alpha: Math.random() * 0.18 + 0.08,
          tone: i % 2 === 0 ? 'teal' : 'blue',
        });
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle scientific contour arcs in light teal & slate blue
      ctx.save();
      ctx.strokeStyle = 'rgba(20, 125, 128, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width * 0.78, height * 1.1, Math.max(width, height) * 0.68, Math.PI * 1.05, Math.PI * 1.9);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(100, 140, 166, 0.08)';
      ctx.beginPath();
      ctx.arc(width * 0.78, height * 1.1, Math.max(width, height) * 0.82, Math.PI * 1.08, Math.PI * 1.88);
      ctx.stroke();
      ctx.restore();

      for (const n of nodes) {
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x > width + 8) n.x = -8;
          if (n.x < -8) n.x = width + 8;
          if (n.y > height + 8) n.y = -8;
          if (n.y < -8) n.y = height + 8;
        }

        ctx.fillStyle =
          n.tone === 'teal'
            ? `rgba(20, 125, 128, ${n.alpha})`
            : `rgba(100, 140, 166, ${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(drawFrame);
      }
    };

    initSize();
    seedNodes();
    drawFrame();

    const handleResize = () => {
      initSize();
      if (prefersReducedMotion) {
        drawFrame();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
