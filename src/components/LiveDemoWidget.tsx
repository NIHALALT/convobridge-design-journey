import React from 'react';
import { Phone, PhoneOff, Volume2, AlertCircle, Loader2, Mic } from "lucide-react";
import { useLiveApi } from '@/hooks/useLiveApi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type WidgetProps = {
  variant?: "floating" | "hero";
  agentConfig?: {
    name: string;
    voice: string;
    systemPrompt?: string;
    context?: string;
    languages: string[];
    personality: string;
    template: string;
  };
  testScenario?: string;
  onCallEnd?: (duration: number, transcript: string) => void;
};

function WaveformBars({ active, count = 5 }: { active: boolean; count?: number }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-full transition-all duration-300",
            active ? "bg-primary" : "bg-muted-foreground/20"
          )}
          style={active ? {
            height: `${14 + Math.random() * 26}px`,
            animation: `waveform-bar 1.2s ease-in-out ${i * 0.15}s infinite alternate`,
          } : { height: "6px" }}
        />
      ))}
      <style>{`
        @keyframes waveform-bar {
          0% { height: 8px; }
          100% { height: 32px; }
        }
      `}</style>
    </div>
  );
}

function CallTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  return <span className="font-mono text-sm text-muted-foreground tabular-nums">{mins}:{secs}</span>;
}

export function LiveDemoWidget({ variant = "floating", agentConfig, testScenario, onCallEnd }: WidgetProps) {
  const { connectionState, connect, disconnect, volume, setVolume, error } = useLiveApi();
  const [callStartTime, setCallStartTime] = React.useState<number | null>(null);
  const [callTranscript, setCallTranscript] = React.useState<string>("");

  const handleCall = () => {
    setCallStartTime(Date.now());
    setCallTranscript("");
    connect({
      systemPrompt: agentConfig?.systemPrompt || undefined,
      testScenario: testScenario || undefined,
      voice: agentConfig?.voice || undefined,
      context: agentConfig?.context || undefined,
      agentName: agentConfig?.name || undefined,
    });
  };

  const handleEnd = () => {
    if (callStartTime && onCallEnd) {
      const duration = Math.round((Date.now() - callStartTime) / 1000);
      onCallEnd(duration, callTranscript || "Call completed.");
    }
    disconnect();
    setCallStartTime(null);
  };

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";
  const isIdle = connectionState === "idle" || connectionState === "error";

  if (variant === "hero") {
    return (
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {agentConfig?.name || "ConvoBridge Agent"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isConnected ? "Active call" : isConnecting ? "Connecting..." : "Ready"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && callStartTime && <CallTimer startTime={callStartTime} />}
            <div className={cn(
              "h-2.5 w-2.5 rounded-full",
              isConnected ? "bg-green-500 animate-pulse" :
              isConnecting ? "bg-amber-400 animate-pulse" : "bg-muted-foreground/30"
            )} />
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isIdle && (
            <div className="space-y-6 animate-fade-in">
              {/* Visual waveform preview */}
              <div className="flex flex-col items-center py-8 space-y-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="h-6 w-6 text-primary/60" />
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">Try a live conversation</p>
                  <p className="text-xs text-muted-foreground">Talk to our AI agent in real-time</p>
                </div>
              </div>
              <Button onClick={handleCall} size="lg" className="w-full rounded-xl">
                <Phone className="mr-2 h-4 w-4" />
                Start Live Call
              </Button>
            </div>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center py-10 space-y-5 animate-fade-in">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" />
              </div>
              <p className="text-sm text-muted-foreground">Establishing connection...</p>
              <Button onClick={handleEnd} variant="outline" size="sm" className="rounded-xl">
                Cancel
              </Button>
            </div>
          )}

          {isConnected && (
            <div className="space-y-5 animate-fade-in">
              {/* Waveform visualizer */}
              <div className="flex flex-col items-center py-6 space-y-3">
                <WaveformBars active={true} count={7} />
                <p className="text-xs text-muted-foreground">Listening...</p>
              </div>

              {/* Volume control */}
              <div className="flex items-center gap-3 px-1">
                <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-primary"
                />
              </div>

              {/* Agent info */}
              {agentConfig && (
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Agent:</span> {agentConfig.name}</p>
                  <p><span className="font-medium text-foreground">Voice:</span> {agentConfig.voice}</p>
                </div>
              )}

              <Button onClick={handleEnd} variant="destructive" size="lg" className="w-full rounded-xl">
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Floating Variant
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-80 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-green-500 animate-pulse" :
              isConnecting ? "bg-amber-400 animate-pulse" : "bg-muted-foreground/30"
            )} />
            <span className="text-sm font-semibold text-foreground">ConvoBridge</span>
          </div>
          {!isIdle && (
            <button onClick={handleEnd} className="text-muted-foreground hover:text-destructive transition-colors">
              <PhoneOff className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="p-4">
          {error && <p className="text-xs text-destructive mb-2">{error}</p>}

          {isIdle && (
            <Button onClick={handleCall} className="w-full rounded-xl" size="sm">
              <Phone className="mr-2 h-3.5 w-3.5" />
              Connect
            </Button>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center py-4 space-y-2">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Connecting...</p>
            </div>
          )}

          {isConnected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <WaveformBars active={true} count={5} />
                {callStartTime && <CallTimer startTime={callStartTime} />}
              </div>
              <div className="flex items-center gap-2 px-1">
                <Volume2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <input
                  type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1 rounded-full appearance-none bg-border cursor-pointer accent-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
