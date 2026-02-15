import { cn } from "@/lib/utils";

/**
 * AuroraBackground — A premium ambient gradient animation.
 * Creates slowly shifting, organic color blobs that feel alive.
 * Use as a background layer behind hero sections or key areas.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Primary warm blob */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] dark:opacity-[0.12] blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(36 100% 50%) 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
          animation: "aurora-drift-1 18s ease-in-out infinite",
        }}
      />
      {/* Secondary cool blob */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.08] blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(220 80% 60%) 0%, transparent 70%)",
          bottom: "5%",
          left: "-8%",
          animation: "aurora-drift-2 22s ease-in-out infinite",
        }}
      />
      {/* Accent warm blob */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] dark:opacity-[0.06] blur-[80px]"
        style={{
          background: "radial-gradient(circle, hsl(28 100% 55%) 0%, transparent 70%)",
          top: "40%",
          left: "30%",
          animation: "aurora-drift-3 15s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(1.1); }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
