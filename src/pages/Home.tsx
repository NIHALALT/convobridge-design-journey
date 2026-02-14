import { ArrowRight, Phone, BarChart3, Calendar, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveDemoWidget } from "@/components/LiveDemoWidget";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.3fr,1fr] gap-16 items-start">
            <div className="space-y-8">
              <h1 className="text-display">
                Your AI agent
                <br />
                <span className="gradient-text">answers every call.</span>
              </h1>

              <p className="text-body-large text-muted-foreground max-w-lg">
                ConvoBridge deploys intelligent AI agents that answer calls, qualify leads,
                and book appointments — 24/7 in 40+ languages.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="rounded-lg text-base px-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-lg text-base px-6">
                  Watch Demo
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Deploy in under 5 minutes. No credit card required.
              </p>
            </div>

            <div className="lg:mt-4">
              <LiveDemoWidget variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Editorial stacked layout */}
      <section className="section-spacing border-t">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <p className="text-caption text-primary mb-3 uppercase tracking-wider">How it works</p>
            <h2 className="text-h2">Three steps to<br />24/7 coverage.</h2>
          </div>

          <div className="space-y-20">
            {[
              {
                step: "01",
                title: "Build your agent",
                description: "Use the visual builder to create an AI agent tailored to your business. Configure personality, voice, language, and response logic — no code required.",
                icon: Phone,
              },
              {
                step: "02",
                title: "Connect your number",
                description: "Forward your existing business number or get a new one. Integration takes minutes with any phone system or VoIP provider.",
                icon: Globe2,
              },
              {
                step: "03",
                title: "Watch it work",
                description: "Your agent answers calls, qualifies leads, books meetings, and logs everything to your dashboard. You focus on closing deals.",
                icon: BarChart3,
              },
            ].map((item, i) => (
              <div key={item.step} className={`grid md:grid-cols-[120px,1fr] gap-8 items-start ${i !== 2 ? 'pb-20 border-b' : ''}`}>
                <div className="text-6xl font-extrabold text-border/60" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {item.step}
                </div>
                <div className="max-w-xl">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-h3 mb-3">{item.title}</h3>
                  <p className="text-body text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics band */}
      <section className="border-t border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "40+", label: "Languages" },
              { value: "<5 min", label: "Setup time" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Availability" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-caption text-primary mb-3 uppercase tracking-wider">Use Cases</p>
            <h2 className="text-h2">Built for teams<br />that talk to customers.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Sales",
                description: "Qualify inbound leads instantly. Your AI agent asks the right questions and routes hot prospects to your team.",
                icon: BarChart3,
              },
              {
                title: "Support",
                description: "Handle common inquiries, collect information, and escalate complex issues to human agents seamlessly.",
                icon: Phone,
              },
              {
                title: "Scheduling",
                description: "Book, reschedule, and confirm appointments automatically. Integrates with your existing calendar.",
                icon: Calendar,
              },
            ].map((item) => (
              <div key={item.title} className="stripe-card space-y-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-h4">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative grain bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
          <h2 className="text-h2 mb-6">Ready to never miss another call?</h2>
          <p className="text-body-large opacity-70 mb-10 max-w-lg mx-auto">
            Join hundreds of businesses using ConvoBridge to scale customer communication.
          </p>
          <Button size="lg" className="rounded-lg text-base px-8 bg-primary text-primary-foreground">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}