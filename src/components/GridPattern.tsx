import { cn } from "@/lib/utils";

/**
 * GridPattern — A subtle engineering grid that adds depth and precision.
 * Inspired by Stripe's blueprint aesthetic. Use behind content sections.
 */
export function GridPattern({ className, fade = true }: { className?: string; fade?: boolean }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/40"
            />
          </pattern>
          {fade && (
            <radialGradient id="grid-fade" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          )}
          {fade && (
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#grid-fade)" />
            </mask>
          )}
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-pattern)"
          mask={fade ? "url(#grid-mask)" : undefined}
        />
      </svg>
    </div>
  );
}
