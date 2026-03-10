'use client';

import { useEffect, useRef } from 'react';

export default function BlueprintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Line = {
      x1: number; y1: number; x2: number; y2: number;
      progress: number; speed: number; delay: number;
      opacity: number; width: number;
    };

    let lines: Line[] = [];

    const createLines = () => {
      lines = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 1; i < 8; i++) {
        lines.push({ x1: 0, y1: (h/8)*i, x2: w, y2: (h/8)*i, progress: 0, speed: 0.012, delay: i*0.03, opacity: 0.1, width: 1.0 });
      }
      for (let i = 1; i < 12; i++) {
        lines.push({ x1: (w/12)*i, y1: 0, x2: (w/12)*i, y2: h, progress: 0, speed: 0.012, delay: i*0.02, opacity: 0.1, width: 1.0 });
      }
      const accents = [
        { x1: w*0.1, y1: h*0.2, x2: w*0.35, y2: h*0.45 },
        { x1: w*0.65, y1: h*0.1, x2: w*0.9, y2: h*0.4 },
        { x1: w*0.15, y1: h*0.7, x2: w*0.4, y2: h*0.9 },
        { x1: w*0.6, y1: h*0.6, x2: w*0.85, y2: h*0.85 },
        { x1: w*0.3, y1: h*0.1, x2: w*0.5, y2: h*0.3 },
      ];
      accents.forEach((a, i) => {
        lines.push({ ...a, progress: 0, speed: 0.01, delay: 0.3+i*0.1, opacity: 0.12, width: 1.0 });
      });
      for (let i = 0; i < 15; i++) {
        const x = (w/12)*Math.floor(Math.random()*11+1);
        const y = (h/8)*Math.floor(Math.random()*7+1);
        const size = 6+Math.random()*8;
        lines.push({ x1: x-size, y1: y, x2: x+size, y2: y, progress: 0, speed: 0.025, delay: 0.4+Math.random()*0.4, opacity: 0.18, width: 1.0 });
        lines.push({ x1: x, y1: y-size, x2: x, y2: y+size, progress: 0, speed: 0.025, delay: 0.4+Math.random()*0.4, opacity: 0.18, width: 1.0 });
      }
    };

    createLines();
    window.addEventListener('resize', createLines);

    let elapsed = 0;
    let raf: number;

    const draw = () => {
      if (!ctx || !canvas) return;
      elapsed += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(line => {
        const age = elapsed - line.delay;
        if (age < 0) return;
        if (line.progress < 1) line.progress = Math.min(1, age * line.speed * 60);
        const p = line.progress;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x1 + (line.x2-line.x1)*p, line.y1 + (line.y2-line.y1)*p);
        ctx.strokeStyle = `rgba(92, 52, 32, ${line.opacity})`;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });
      if (lines.every(l => l.progress >= 1) && elapsed > 2) {
        elapsed = 0;
        lines.forEach(l => { l.progress = 0; });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', createLines);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }} />;
}
