"use client";

import { useRef, useEffect } from "react";

const BASE_R = 240;
const BASE_G = 237;
const BASE_B = 232;

const GRID_W = 64;
const GRID_H = 40;
const SPREAD = 0.25;
const DAMPING = 0.992;
const IMPULSE_MOUSE = 80;
const IMPULSE_RANDOM = 35;
const MOUSE_THROTTLE_MS = 120;
const RANDOM_MIN_MS = 3000;
const RANDOM_MAX_MS = 5000;
const HEIGHT_TO_RGB = 0.2; // subtle: height ±30 → RGB ±6

export default function WaterRipple() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let gridW = GRID_W;
    let gridH = GRID_H;
    let cellW = 0;
    let cellH = 0;

    // Triple buffer: previous, current, next (avoid read/write conflict)
    let current = new Float32Array(gridW * gridH);
    let previous = new Float32Array(gridW * gridH);
    let next = new Float32Array(gridW * gridH);

    const idx = (i: number, j: number) => i + j * gridW;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      gridW = GRID_W;
      gridH = GRID_H;
      cellW = w / gridW;
      cellH = h / gridH;
      current = new Float32Array(gridW * gridH);
      previous = new Float32Array(gridW * gridH);
      next = new Float32Array(gridW * gridH);
    };

    resize();
    window.addEventListener("resize", resize);

    const addImpulse = (gridX: number, gridY: number, strength: number) => {
      const i = Math.max(0, Math.min(gridW - 1, Math.floor(gridX)));
      const j = Math.max(0, Math.min(gridH - 1, Math.floor(gridY)));
      current[idx(i, j)] += strength;
      // Slight spread to neighbors for smoother look
      if (i > 0) current[idx(i - 1, j)] += strength * 0.3;
      if (i < gridW - 1) current[idx(i + 1, j)] += strength * 0.3;
      if (j > 0) current[idx(i, j - 1)] += strength * 0.3;
      if (j < gridH - 1) current[idx(i, j + 1)] += strength * 0.3;
    };

    let lastMouseTime = 0;
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < MOUSE_THROTTLE_MS) return;
      lastMouseTime = now;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const gx = (x / rect.width) * gridW;
      const gy = (y / rect.height) * gridH;
      addImpulse(gx, gy, IMPULSE_MOUSE);
    };

    const onTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < MOUSE_THROTTLE_MS) return;
      lastMouseTime = now;
      const t = e.touches[0];
      if (!t) return;
      const rect = container.getBoundingClientRect();
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      const gx = (x / rect.width) * gridW;
      const gy = (y / rect.height) * gridH;
      addImpulse(gx, gy, IMPULSE_MOUSE);
    };

    const scheduleRandom = () => {
      const delay = RANDOM_MIN_MS + Math.random() * (RANDOM_MAX_MS - RANDOM_MIN_MS);
      return window.setTimeout(() => {
        const i = Math.floor(Math.random() * gridW);
        const j = Math.floor(Math.random() * gridH);
        addImpulse(i, j, IMPULSE_RANDOM);
        randomTimeoutRef = scheduleRandom();
      }, delay);
    };

    let randomTimeoutRef = scheduleRandom();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let rafId = 0;
    const step = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h || !cellW || !cellH) {
        rafId = requestAnimationFrame(step);
        return;
      }

      // Compute next from previous and current (2D wave equation)
      for (let j = 1; j < gridH - 1; j++) {
        for (let i = 1; i < gridW - 1; i++) {
          const laplacian =
            previous[idx(i + 1, j)] +
            previous[idx(i - 1, j)] +
            previous[idx(i, j + 1)] +
            previous[idx(i, j - 1)] -
            4 * previous[idx(i, j)];
          next[idx(i, j)] =
            (2 * previous[idx(i, j)] - current[idx(i, j)] + SPREAD * laplacian) * DAMPING;
        }
      }
      const tmp = previous;
      previous = current;
      current = next;
      next = tmp;

      // Draw: base #F0EDE8 with subtle variation per cell
      for (let j = 0; j < gridH; j++) {
        for (let i = 0; i < gridW; i++) {
          const hVal = current[idx(i, j)];
          const r = Math.round(Math.max(0, Math.min(255, BASE_R + hVal * HEIGHT_TO_RGB)));
          const g = Math.round(Math.max(0, Math.min(255, BASE_G + hVal * HEIGHT_TO_RGB)));
          const b = Math.round(Math.max(0, Math.min(255, BASE_B + hVal * HEIGHT_TO_RGB)));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1);
        }
      }

      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (randomTimeoutRef) clearTimeout(randomTimeoutRef);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-[1] h-full w-full"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
