import { useRef } from "react";
import { ArrowRight, Phone, BarChart3, Calendar, Globe2, Zap, Shield, Clock, ChevronRight, Play, Star } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LiveDemoWidget } from "@/components/LiveDemoWidget";
import { AuroraBackground } from "@/components/AuroraBackground";
import { GridPattern } from "@/components/GridPattern";
import { HolographicOrb } from "@/components/HolographicOrb";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { PlatformShowcase } from "@/components/PlatformShowcase";
import { ParticleField } from "@/components/ParticleField";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

/* ─── Reusable scroll-reveal wrapper ─── */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Trusted logos strip ─── */
function TrustStrip() {
  const brands = ["Google", "Stripe", "Shopify", "Slack", "Notion"];
  return (
    <Reveal delay={0.5}>
      <div className="flex flex-col items-center gap-4 pt-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">Trusted by teams at</p>
        <div className="flex items-center gap-8 md:gap-12 opacity-30">
          {brands.map((b) => (
            <span key={b} className="text-sm md:text-base font-semibold tracking-wide text-foreground/60">{b}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Feature pill ─── */
function FeaturePill({ icon: Icon, label }: { icon: typeof Zap; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/[0.04] border border-primary/[0.08] text-muted-foreground">
      <Icon className="h-3 w-3 text-primary" />
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <NavBar />

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Layered GPU backgrounds */}
        <AuroraBackground />
        <GridPattern className="opacity-30" />

        {/* Interactive particle field */}
        <ParticleField className="opacity-60" count={50} />

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <BackgroundPaths title="" />
        </div>

        <motion.div
          style={{ scale: orbScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block opacity-[0.12] pointer-events-none"
        >
          <HolographicOrb size={900} />
        </motion.div>

        <div className="absolute bottom-12 right-12 hidden xl:block opacity-30 pointer-events-none w-[360px] h-[180px]">
          <CpuArchitecture text="AI" className="text-primary/40" />
        </div>

        {/* Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20"
        >
          <div className="grid lg:grid-cols-[1.4fr,1fr] gap-16 xl:gap-20 items-center">
            <div className="space-y-8">
              <Reveal>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card"
                  style={{ border: "1px solid hsla(217 91% 50% / 0.12)" }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">Now with 40+ language support</span>
                </motion.div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="text-display !leading-[1.04] !tracking-[-0.04em]">
                  Your AI agent
                  <br />
                  <span className="holo-text">answers every call.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-body-large text-muted-foreground max-w-[520px] !leading-[1.8]">
                  ConvoBridge deploys intelligent AI agents that answer calls, qualify leads,
                  and book appointments — 24/7 in 40+ languages. Deploy in minutes, not months.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="group rounded-2xl text-base px-7 h-13 bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_40px_-8px_hsla(217,91%,50%,0.35)] transition-all duration-300 hover:shadow-[0_0_60px_-8px_hsla(217,91%,50%,0.5)]">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-2xl text-base px-7 h-13 border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] hover:border-primary/25 text-foreground backdrop-blur-sm">
                    <Play className="mr-2 h-4 w-4 text-primary" />
                    Watch Demo
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="flex flex-wrap gap-3">
                  <FeaturePill icon={Zap} label="5-min setup" />
                  <FeaturePill icon={Shield} label="Enterprise-grade" />
                  <FeaturePill icon={Clock} label="No credit card" />
                </div>
              </Reveal>
            </div>

            {/* Demo widget */}
            <Reveal delay={0.3} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-8 rounded-[32px] bg-gradient-to-br from-primary/[0.04] to-transparent blur-2xl" />
                <div className="relative">
                  <LiveDemoWidget variant="hero" />
                </div>
              </div>
            </Reveal>
          </div>

          <TrustStrip />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative py-28 md:py-36 lg:py-44 overflow-hidden">
        <GridPattern className="opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="max-w-2xl mb-20">
              <p className="text-caption text-primary mb-4 uppercase tracking-[0.2em] font-semibold">How it works</p>
              <h2 className="text-h2 !tracking-[-0.03em]">
                Three steps to
                <br />
                <span className="holo-text">24/7 coverage.</span>
              </h2>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Build your agent",
                description: "Use the visual builder to create an AI agent tailored to your business. Configure personality, voice, language, and response logic — no code required.",
                icon: Phone,
                gradient: "from-primary/[0.06] via-primary/[0.02] to-transparent",
              },
              {
                step: "02",
                title: "Connect your number",
                description: "Forward your existing business number or get a new one. Integration takes minutes with any phone system or VoIP provider.",
                icon: Globe2,
                gradient: "from-[hsla(199,89%,48%,0.06)] via-[hsla(199,89%,48%,0.02)] to-transparent",
              },
              {
                step: "03",
                title: "Watch it work",
                description: "Your agent answers calls, qualifies leads, books meetings, and logs everything to your dashboard. You focus on closing deals.",
                icon: BarChart3,
                gradient: "from-[hsla(230,70%,55%,0.06)] via-[hsla(230,70%,55%,0.02)] to-transparent",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className={`group glass-card-hover rounded-3xl p-8 md:p-10 bg-gradient-to-r ${item.gradient}`}>
                  <div className="grid md:grid-cols-[100px,1fr] gap-6 items-start">
                    <div className="text-5xl font-extrabold font-display holo-text opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      {item.step}
                    </div>
                    <div className="max-w-xl">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-5 bg-primary/[0.06] border border-primary/[0.1] group-hover:bg-primary/[0.1] group-hover:border-primary/[0.2] transition-all duration-500">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-h3 mb-3 !tracking-[-0.02em]">{item.title}</h3>
                      <p className="text-body text-muted-foreground !leading-[1.8]">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PLATFORM SHOWCASE ═══════════ */}
      <PlatformShowcase />

      {/* ═══════════ METRICS BAND ═══════════ */}
      <section className="relative border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: "40+", label: "Languages supported", icon: Globe2 },
              { value: "<5 min", label: "Average setup time", icon: Zap },
              { value: "99.9%", label: "Platform uptime", icon: Shield },
              { value: "24/7", label: "Always available", icon: Clock },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="glass-card-hover rounded-2xl p-7 text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/[0.06] border border-primary/[0.08] group-hover:bg-primary/[0.1] transition-colors duration-500">
                      <stat.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold mb-2 font-display holo-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ USE CASES with Particles ═══════════ */}
      <section className="relative py-28 md:py-36 lg:py-44 overflow-hidden">
        <AuroraBackground className="opacity-40" />
        <ParticleField className="opacity-40" count={35} color="199,89%,48%" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <p className="text-caption text-primary mb-4 uppercase tracking-[0.2em] font-semibold">Use Cases</p>
              <h2 className="text-h2 !tracking-[-0.03em]">
                Built for teams
                <br />
                <span className="holo-text">that talk to customers.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 perspective-deep">
            {[
              {
                title: "Sales",
                description: "Qualify inbound leads instantly. Your AI agent asks the right questions and routes hot prospects to your team.",
                icon: BarChart3,
                accent: "217 91% 50%",
              },
              {
                title: "Support",
                description: "Handle common inquiries, collect information, and escalate complex issues to human agents seamlessly.",
                icon: Phone,
                accent: "199 89% 48%",
              },
              {
                title: "Scheduling",
                description: "Book, reschedule, and confirm appointments automatically. Integrates with your existing calendar.",
                icon: Calendar,
                accent: "230 70% 55%",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="group relative glass-card-hover rounded-3xl p-8 space-y-5 hover-lift-3d holo-border h-full">
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `linear-gradient(90deg, transparent, hsla(${item.accent} / 0.4), transparent)` }}
                  />
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/[0.06] border border-primary/[0.08] group-hover:bg-primary/[0.1] group-hover:border-primary/[0.15] transition-all duration-500">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-h4 !tracking-[-0.02em]">{item.title}</h3>
                  <p className="text-body text-muted-foreground !leading-[1.8]">{item.description}</p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                      Learn more <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <section className="relative py-28 md:py-36 border-t border-border/50 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-caption text-primary mb-4 uppercase tracking-[0.2em] font-semibold">What people say</p>
              <h2 className="text-h2 !tracking-[-0.03em]">
                Loved by teams <span className="holo-text">everywhere.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "ConvoBridge cut our missed calls by 94%. The AI agent handles everything from scheduling to lead qualification perfectly.",
                name: "Sarah Chen",
                role: "VP of Sales, TechFlow",
                stars: 5,
              },
              {
                quote: "Setup took 3 minutes. Within the first week, we captured 40+ leads that would have gone to voicemail. Game-changing.",
                name: "Marcus Rivera",
                role: "Founder, GrowthLab",
                stars: 5,
              },
              {
                quote: "Our customers can't tell they're talking to AI. The multilingual support was the deciding factor for our global team.",
                name: "Aiko Tanaka",
                role: "Head of CX, NovaTrade",
                stars: 5,
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="glass-card-hover rounded-3xl p-8 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-primary/80 text-primary/80" />
                    ))}
                  </div>
                  <p className="text-body text-foreground/80 !leading-[1.8] flex-1 mb-6">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <BackgroundPaths title="" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-28 md:py-36 text-center">
          <Reveal>
            <div className="glass-card rounded-[32px] p-12 md:p-20 holo-border glass-shimmer relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <h2 className="text-h2 mb-6 !tracking-[-0.03em]">
                Ready to never miss
                <br />
                <span className="holo-text">another call?</span>
              </h2>
              <p className="text-body-large text-muted-foreground mb-10 max-w-lg mx-auto !leading-[1.8]">
                Join hundreds of businesses using ConvoBridge to scale customer communication with AI that feels human.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="group rounded-2xl text-base px-8 h-13 bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_40px_-8px_hsla(217,91%,50%,0.35)] transition-all duration-300 hover:shadow-[0_0_60px_-8px_hsla(217,91%,50%,0.5)]">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl text-base px-8 h-13 border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] text-foreground">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
