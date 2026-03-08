import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ─── GPU-powered ripple wave canvas ─── */
function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let t = 0;
    let animId: number;

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      const waveCount = 5;
      for (let wave = 0; wave < waveCount; wave++) {
        const baseY = h * 0.5 + wave * 18;
        const amplitude = 30 + wave * 8;
        const frequency = 0.003 + wave * 0.0005;
        const speed = t * (1.2 + wave * 0.3);
        const alpha = 0.04 + (waveCount - wave) * 0.015;

        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 2) {
          const y = baseY
            + Math.sin(x * frequency + speed) * amplitude
            + Math.sin(x * frequency * 2.5 + speed * 0.7) * (amplitude * 0.3)
            + Math.cos(x * frequency * 0.5 + speed * 1.3) * (amplitude * 0.2);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, h);
        grad.addColorStop(0, `hsla(217, 91%, 50%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(199, 89%, 48%, ${alpha * 0.7})`);
        grad.addColorStop(1, `hsla(230, 70%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Central radial glow
      const glow = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, w * 0.4);
      glow.addColorStop(0, `hsla(217, 91%, 50%, ${0.06 + Math.sin(t * 2) * 0.02})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ─── Splash Screen ─── */
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 2400);
    const t3 = setTimeout(onComplete, 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background",
        "transition-opacity duration-700",
        phase === "exit" && "opacity-0 pointer-events-none"
      )}
    >
      {/* Wave background */}
      <WaveCanvas />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsla(217,91%,50%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(217,91%,50%,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo mark — animated ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase !== "enter" ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          <div className="h-20 w-20 rounded-full border border-primary/20 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full border border-primary/30 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_4px_hsla(217,91%,50%,0.4)]" />
            </div>
          </div>
          {/* Orbiting ring */}
          <div
            className={cn(
              "absolute inset-[-8px] rounded-full border border-primary/10 transition-all duration-[2000ms]",
              phase === "enter" ? "opacity-0 scale-50" : "opacity-100 scale-100"
            )}
            style={{ animation: phase !== "enter" ? "splash-orbit 4s linear infinite" : "none" }}
          />
        </motion.div>

        {/* Brand text */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={phase !== "enter" ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold tracking-[-0.04em] text-5xl sm:text-7xl md:text-8xl text-center"
        >
          Convo<span className="holo-text">Bridge</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={phase === "hold" ? { opacity: 0.5, y: 0 } : phase === "exit" ? { opacity: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-sm sm:text-base tracking-[0.25em] uppercase text-muted-foreground font-medium"
        >
          Intelligent Voice AI
        </motion.p>

        {/* Accent line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={phase !== "enter" ? { width: 192, opacity: 0.8 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(217 91% 50%), hsl(199 89% 48%), hsl(230 70% 55%), transparent)",
          }}
        />
      </div>

      <style>{`
        @keyframes splash-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
