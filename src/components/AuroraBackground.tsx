import { cn } from "@/lib/utils";

/**
 * AuroraBackground — Holographic ambient gradient with 3D depth.
 * Multiple iridescent orbs create a living, shifting atmosphere.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Primary holographic orb */}
      <div
        className="floating-orb w-[700px] h-[700px] opacity-[0.12]"
        style={{
          background: "radial-gradient(circle, hsl(280 80% 65%) 0%, hsl(200 90% 60%) 40%, transparent 70%)",
          top: "-20%",
          right: "-10%",
          animationDuration: "18s",
        }}
      />
      {/* Warm accent orb */}
      <div
        className="floating-orb w-[500px] h-[500px] opacity-[0.1]"
        style={{
          background: "radial-gradient(circle, hsl(36 100% 55%) 0%, hsl(330 80% 60%) 50%, transparent 70%)",
          bottom: "-5%",
          left: "-8%",
          animationDuration: "25s",
          animationDelay: "-5s",
        }}
      />
      {/* Teal/cyan accent */}
      <div
        className="floating-orb w-[400px] h-[400px] opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, hsl(180 70% 50%) 0%, hsl(220 80% 55%) 50%, transparent 70%)",
          top: "50%",
          left: "40%",
          animationDuration: "22s",
          animationDelay: "-10s",
        }}
      />
      {/* Subtle pink orb for holographic feel */}
      <div
        className="floating-orb w-[350px] h-[350px] opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, hsl(330 80% 65%) 0%, transparent 70%)",
          top: "20%",
          left: "10%",
          animationDuration: "30s",
          animationDelay: "-15s",
        }}
      />
    </div>
  );
}
