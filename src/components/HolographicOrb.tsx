import { cn } from "@/lib/utils";

/**
 * HolographicOrb — A 3D abstract holographic sphere with iridescent reflections.
 * Use as a hero visual element or accent piece.
 */
export function HolographicOrb({ className, size = 300 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-[60px] opacity-30"
        style={{
          background: "conic-gradient(from 0deg, hsl(280 80% 65%), hsl(200 90% 60%), hsl(36 100% 55%), hsl(330 80% 60%), hsl(280 80% 65%))",
          animation: "holo-shift 8s ease-in-out infinite",
          backgroundSize: "300% 300%",
        }}
      />

      {/* Main sphere */}
      <div
        className="absolute inset-[15%] rounded-full"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, hsla(0 0% 100% / 0.2), transparent 50%),
            radial-gradient(circle at 70% 70%, hsla(280 80% 65% / 0.3), transparent 40%),
            conic-gradient(from 45deg, hsl(200 90% 60% / 0.6), hsl(36 100% 55% / 0.5), hsl(330 80% 60% / 0.6), hsl(280 80% 65% / 0.5), hsl(200 90% 60% / 0.6))
          `,
          backgroundSize: "100% 100%, 100% 100%, 300% 300%",
          animation: "orb-rotate 12s linear infinite",
          boxShadow: `
            inset 0 0 60px hsla(0 0% 100% / 0.1),
            inset -20px -20px 40px hsla(280 80% 65% / 0.2),
            0 0 40px hsla(200 90% 60% / 0.15)
          `,
        }}
      />

      {/* Glass highlight */}
      <div
        className="absolute rounded-full"
        style={{
          top: "18%",
          left: "20%",
          width: "35%",
          height: "25%",
          background: "linear-gradient(180deg, hsla(0 0% 100% / 0.25), transparent)",
          borderRadius: "50%",
          transform: "rotate(-20deg)",
          filter: "blur(3px)",
        }}
      />

      {/* Inner ring */}
      <div
        className="absolute inset-[25%] rounded-full border border-white/10"
        style={{
          animation: "orb-rotate 20s linear infinite reverse",
        }}
      />

      <style>{`
        @keyframes orb-rotate {
          0% { background-position: 0% 50%, 0% 0%, 0% 50%; }
          100% { background-position: 0% 50%, 100% 100%, 300% 50%; }
        }
      `}</style>
    </div>
  );
}
