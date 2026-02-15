import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * SplashScreen — Cinematic text-centric intro.
 * "ConvoBridge" breathes into existence with atmospheric background effects.
 */
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("hold"), 100);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const completeTimer = setTimeout(onComplete, 2900);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden",
        "bg-foreground transition-opacity duration-700",
        phase === "exit" && "opacity-0 pointer-events-none"
      )}
    >
      {/* Atmospheric particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `splash-float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Radial glow behind text */}
      <div
        className={cn(
          "absolute w-[600px] h-[300px] rounded-full blur-[100px] transition-all duration-[1500ms]",
          phase === "enter"
            ? "opacity-0 scale-50"
            : "opacity-100 scale-100"
        )}
        style={{
          background: "radial-gradient(ellipse, hsl(36 100% 50% / 0.15) 0%, transparent 70%)",
        }}
      />

      {/* The brand name */}
      <div className="relative z-10 text-center">
        <h1
          className={cn(
            "font-display font-extrabold tracking-[-0.04em] transition-all duration-[1200ms] ease-out",
            "text-5xl sm:text-7xl md:text-8xl",
            phase === "enter"
              ? "opacity-0 scale-95 blur-sm translate-y-4"
              : "opacity-100 scale-100 blur-0 translate-y-0"
          )}
          style={{ color: "hsl(40 20% 95%)" }}
        >
          Convo
          <span style={{ color: "hsl(36 100% 50%)" }}>Bridge</span>
        </h1>

        {/* Subtle tagline */}
        <p
          className={cn(
            "mt-4 text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-[1000ms] delay-500",
            phase === "enter"
              ? "opacity-0 translate-y-2"
              : phase === "hold"
              ? "opacity-40"
              : "opacity-0"
          )}
          style={{ color: "hsl(40 20% 70%)" }}
        >
          Intelligent Voice AI
        </p>

        {/* Breathing line */}
        <div
          className={cn(
            "mx-auto mt-6 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-[1200ms] delay-300",
            phase === "enter" ? "w-0 opacity-0" : "w-48 opacity-60"
          )}
        />
      </div>

      <style>{`
        @keyframes splash-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.3; }
          75% { transform: translateY(-30px) translateX(15px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
