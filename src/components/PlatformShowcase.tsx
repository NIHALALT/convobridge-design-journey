import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Phone, Globe2, Zap, TrendingUp, Users, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Animated number counter ─── */
function AnimatedNumber({ value, suffix = "", prefix = "", duration = 2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString());
    });
    return unsub;
  }, [spring]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ─── Comparison bar ─── */
function ComparisonBar({ label, ours, theirs, unit = "%" }: { label: string; ours: number; theirs: number; unit?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{theirs}{unit} → <span className="text-primary font-semibold">{ours}{unit}</span></span>
      </div>
      <div className="relative h-2 rounded-full bg-muted/60 overflow-hidden">
        {/* Theirs */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/20"
          initial={{ width: 0 }}
          animate={inView ? { width: `${theirs}%` } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Ours */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(199 89% 48%))",
            boxShadow: "0 0 12px hsla(217 91% 50% / 0.3)",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${ours}%` } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/* ─── Floating feature tag ─── */
function FeatureTag({ icon: Icon, label, delay }: { icon: typeof Zap; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card text-sm font-medium text-foreground"
    >
      <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-primary/[0.08] border border-primary/[0.1]">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <span>{label}</span>
      <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 ml-1" />
    </motion.div>
  );
}

/* ─── Live connection line (SVG) ─── */
function ConnectionLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(217 91% 50%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(217 91% 50%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 50, 70].map((y, i) => (
        <line key={i} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="url(#line-grad)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0;0.6;0" dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
        </line>
      ))}
    </svg>
  );
}

/* ─── Main showcase ─── */
export function PlatformShowcase() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { icon: Phone, value: 94, suffix: "%", label: "Fewer missed calls", description: "AI agents answer every call within 2 rings, 24/7" },
    { icon: TrendingUp, value: 340, suffix: "%", label: "More qualified leads", description: "Intelligent qualification before human handoff" },
    { icon: Clock, value: 5, suffix: " min", label: "Setup to first call", description: "From signup to your first AI-handled call" },
    { icon: Globe2, value: 40, suffix: "+", label: "Languages supported", description: "Native-quality voice in every major language" },
  ];

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => setActiveMetric((p) => (p + 1) % metrics.length), 3500);
    return () => clearInterval(interval);
  }, [inView, metrics.length]);

  return (
    <section ref={containerRef} className="relative py-28 md:py-36 lg:py-44 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsl(217 91% 50%), transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(199 89% 48%), transparent 70%)" }} />
      </div>
      <ConnectionLines />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-20"
        >
          <p className="text-caption text-primary mb-4 uppercase tracking-[0.2em] font-semibold">Why ConvoBridge</p>
          <h2 className="text-h2 !tracking-[-0.03em] mb-6">
            The platform built to
            <br />
            <span className="holo-text">outperform everything else.</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-xl !leading-[1.8]">
            We didn't just build another voice AI. We re-engineered the entire call experience from the ground up.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-8 xl:gap-14">
          {/* Left — Interactive metric showcase */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-8 md:p-10 holo-border relative overflow-hidden">
              {/* Top glow line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Active metric display */}
              <div className="mb-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMetric}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/[0.08] border border-primary/[0.1]">
                        {(() => { const Icon = metrics[activeMetric].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
                      </div>
                      <div className="text-5xl md:text-6xl font-extrabold font-display holo-text">
                        <AnimatedNumber value={metrics[activeMetric].value} suffix={metrics[activeMetric].suffix} duration={1.5} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{metrics[activeMetric].label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{metrics[activeMetric].description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Metric selector pills */}
              <div className="flex flex-wrap gap-2">
                {metrics.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMetric(i)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border",
                      i === activeMetric
                        ? "bg-primary/[0.08] border-primary/20 text-primary shadow-[0_0_16px_-4px_hsla(217,91%,50%,0.2)]"
                        : "bg-transparent border-border/60 text-muted-foreground hover:border-primary/10 hover:text-foreground"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 mt-8">
                {metrics.map((_, i) => (
                  <div key={i} className="h-1 rounded-full overflow-hidden bg-muted/50 flex-1">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: i === activeMetric ? "100%" : i < activeMetric ? "100%" : "0%" }}
                      transition={i === activeMetric ? { duration: 3.5, ease: "linear" } : { duration: 0.3 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Comparison + feature tags */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Comparison card */}
            <div className="glass-card rounded-3xl p-8 md:p-10 space-y-7">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">ConvoBridge vs Traditional</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/20" /> Others
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" /> ConvoBridge
                  </span>
                </div>
              </div>
              <ComparisonBar label="Call answer rate" ours={99} theirs={42} />
              <ComparisonBar label="Lead qualification" ours={94} theirs={28} />
              <ComparisonBar label="Response time" ours={98} theirs={15} unit="% instant" />
              <ComparisonBar label="Language coverage" ours={95} theirs={20} />
            </div>

            {/* Feature cloud */}
            <div className="flex flex-wrap gap-3">
              <FeatureTag icon={Zap} label="Zero latency" delay={0.4} />
              <FeatureTag icon={Users} label="Multi-agent" delay={0.5} />
              <FeatureTag icon={Globe2} label="40+ languages" delay={0.6} />
              <FeatureTag icon={Phone} label="Call routing" delay={0.7} />
            </div>

            {/* Bottom CTA link */}
            <motion.a
              href="/pricing"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 group"
            >
              See full comparison
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
