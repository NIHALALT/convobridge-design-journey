import { cn } from "@/lib/utils";

/**
 * OrbitalRings — Concentric rotating rings with subtle dots.
 * Creates a sense of intelligence and precision. 
 * Perfect for hero sections or behind product demos.
 */
export function OrbitalRings({ className, size = 500 }: { className?: string; size?: number }) {
  const rings = [
    { r: size * 0.3, duration: 30, direction: 1, dots: 3 },
    { r: size * 0.42, duration: 45, direction: -1, dots: 5 },
    { r: size * 0.55, duration: 60, direction: 1, dots: 2 },
  ];

  return (
    <div className={cn("absolute pointer-events-none", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="opacity-[0.15] dark:opacity-[0.2]"
      >
        {rings.map((ring, i) => (
          <g key={i}>
            {/* Ring path */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={ring.r}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-foreground/30"
              strokeDasharray="4 8"
            />
            {/* Orbiting dots */}
            <g
              style={{
                transformOrigin: `${size / 2}px ${size / 2}px`,
                animation: `orbital-spin ${ring.duration}s linear infinite ${ring.direction === -1 ? "reverse" : ""}`,
              }}
            >
              {Array.from({ length: ring.dots }).map((_, d) => {
                const angle = (d / ring.dots) * Math.PI * 2;
                const x = size / 2 + Math.cos(angle) * ring.r;
                const y = size / 2 + Math.sin(angle) * ring.r;
                return (
                  <circle
                    key={d}
                    cx={x}
                    cy={y}
                    r={2}
                    className="fill-primary/60"
                  />
                );
              })}
            </g>
          </g>
        ))}
        <style>{`
          @keyframes orbital-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </svg>
    </div>
  );
}
