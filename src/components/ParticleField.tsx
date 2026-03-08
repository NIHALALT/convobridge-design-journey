import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  targetAlpha: number;
}

export function ParticleField({ className, count = 60, color = "217,91%,50%" }: { className?: string; count?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.5,
        alpha: 0,
        targetAlpha: 0.15 + Math.random() * 0.25,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ps = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Ease alpha in
        p.alpha += (p.targetAlpha - p.alpha) * 0.02;

        // Mouse interaction — subtle push
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.15;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Friction
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color} / ${p.alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j];
          const cx = p.x - q.x;
          const cy = p.y - q.y;
          const d = cx * cx + cy * cy;
          const maxDist = 14000; // ~118px
          if (d < maxDist) {
            const lineAlpha = (1 - d / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${color} / ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    init();
    draw();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-auto", className)}
      style={{ zIndex: 0 }}
    />
  );
}
