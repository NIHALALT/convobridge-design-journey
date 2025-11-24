# Frontend Integration Guide

This document shows how to integrate the backend API into each frontend component.

## 1. Login Page (`src/pages/Login.tsx`)

**Updated Component:**

```tsx
import { ArrowRight, Eye, EyeOff, Github, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient.login(email, password);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link to="/" className="font-bold text-xl hover:text-primary transition-colors">
          ConvoBridge
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center space-y-3">
            <h1 className="text-h1">Welcome back</h1>
            <p className="text-body-large text-muted-foreground">
              Sign in to your ConvoBridge account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-body-small font-semibold">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-body-small font-semibold">Password</label>
                <a href="#" className="text-caption text-primary hover:text-primary/80 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border border-gray-300 cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="remember" className="text-body-small text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="text-base" disabled={loading}>
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" size="lg" className="text-base" disabled={loading}>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="..." />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-body-small text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign up
            </a>
          </p>

          <div className="text-center text-caption text-muted-foreground space-y-2">
            <p>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              {" • "}
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </p>
            <p>Need help? <a href="/contact-us" className="text-primary hover:text-primary/80 transition-colors">Contact support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 2. Contact Us Page (`src/pages/ContactUs.tsx`)

**Key Changes:**

```tsx
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await apiClient.submitContact(formData);
    toast.success("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", company: "", message: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || "Failed to submit. Please try again.";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

// In form JSX:
<Button type="submit" size="lg" disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Sending...
    </>
  ) : (
    <>
      Send Message
      <ArrowRight className="ml-2 h-5 w-5" />
    </>
  )}
</Button>
```

## 3. Agent Builder Page (`src/pages/AgentBuilder.tsx`)

**Key Changes:**

```tsx
import { apiClient } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const navigate = useNavigate();
const [saving, setSaving] = useState(false);

const handleDeploy = async () => {
  setSaving(true);
  try {
    const agentData = {
      name: agentName,
      type: selectedTemplate.toLowerCase(),
      template: selectedTemplate,
      systemPrompt,
      voice: selectedVoice,
      languages,
      personality,
      integrations: connectedIntegrations,
    };

    const response = await apiClient.createAgent(agentData);
    toast.success("Agent created successfully!");
    navigate("/dashboard?tab=agents");
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || "Failed to create agent.";
    toast.error(errorMessage);
  } finally {
    setSaving(false);
  }
};

// When saving test calls:
const handleTestCallComplete = async (duration: number, transcript: string) => {
  try {
    await apiClient.createCall({
      agentId: "temp-agent-id", // Use actual agent ID when available
      agentName,
      phoneNumber: "+1-555-demo-call",
      duration,
      outcome: generateOutcome(testScenario),
      transcript,
      transcriptSnippet: transcript.substring(0, 150),
    });
    toast.success("Test call logged successfully");
    const newTestCall = {
      id: Date.now().toString(),
      timestamp: new Date(),
      scenario: testScenario,
      duration,
      outcome: generateOutcome(testScenario),
      transcript,
    };
    setTestCalls(prev => [newTestCall, ...prev]);
  } catch (err) {
    toast.error("Failed to log test call");
  }
  setShowLiveWidget(false);
  setIsTestCallActive(false);
};
```

## 4. Dashboard Page (`src/pages/Dashboard.tsx`)

**Key Changes:**

```tsx
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const navigate = useNavigate();
const [agents, setAgents] = useState([]);
const [calls, setCalls] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      // Check authentication
      if (!apiClient.isAuthenticated()) {
        navigate("/login");
        return;
      }

      // Fetch agents
      const agentsResponse = await apiClient.getAgents();
      setAgents(agentsResponse.agents);

      // Fetch recent calls
      const callsResponse = await apiClient.getCalls({ limit: 6 });
      setCalls(callsResponse.calls);

      // Fetch stats
      const statsResponse = await apiClient.getCallStats();
      setStats(statsResponse.stats);
    } catch (err) {
      toast.error("Failed to load dashboard data");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [navigate]);

// Replace hardcoded data with API responses:
// Instead of: const recentCalls = [...]
// Use: const recentCalls = calls;

// For metrics, use stats from API
const metrics = [
  {
    label: "Total Calls",
    value: stats?.totalCalls || "0",
    // ... rest
  },
  // ... etc
];

// Delete agent handler
const deleteAgent = async (agentId: string) => {
  try {
    await apiClient.deleteAgent(agentId);
    toast.success("Agent deleted");
    setAgents(agents.filter(a => a._id !== agentId));
  } catch (err) {
    toast.error("Failed to delete agent");
  }
};
```

## 5. Protected Routes Setup

**Create `src/components/ProtectedRoute.tsx`:**

```tsx
import { Navigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  if (!apiClient.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
}
```

**Update `src/App.tsx`:**

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

// In Routes:
<Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
<Route path="/dashboard/agents/new" element={<ProtectedRoute element={<AgentBuilder />} />} />
```

## 6. Context for Global State (Optional)

**Create `src/hooks/useAuth.ts`:**

```tsx
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const response = await apiClient.getCurrentUser();
          setUser(response.user);
        }
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, logout: () => apiClient.logout() };
}
```

## 7. Error Handling Pattern

**Best Practices:**

```tsx
try {
  const response = await apiClient.method(params);
  toast.success("Operation successful");
  // Use response data
} catch (err: any) {
  // API errors
  if (err.response?.status === 401) {
    apiClient.logout();
    navigate("/login");
  } else if (err.response?.status === 403) {
    toast.error("Unauthorized action");
  } else {
    const message = err.response?.data?.error || "An error occurred";
    toast.error(message);
  }
} finally {
  setLoading(false);
}
```

## 8. Loading States

**Standard Pattern:**

```tsx
const [loading, setLoading] = useState(false);

<Button disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Action"
  )}
</Button>
```

## 9. React Query Integration (Optional)

For more advanced caching and refetching:

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";

const { data: agents, refetch: refetchAgents } = useQuery({
  queryKey: ["agents"],
  queryFn: () => apiClient.getAgents(),
});

const createAgentMutation = useMutation({
  mutationFn: (agentData) => apiClient.createAgent(agentData),
  onSuccess: () => {
    refetchAgents();
    toast.success("Agent created");
  },
  onError: (err: any) => {
    toast.error(err.response?.data?.error);
  },
});

// Usage:
<Button onClick={() => createAgentMutation.mutate(data)}>
  {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
</Button>
```

## Testing API Integration

**Test each endpoint in browser console:**

```javascript
// Test login
const loginResult = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
});
const { token } = await loginResult.json();

// Test authenticated endpoint with token
const agentsResult = await fetch('http://localhost:3001/api/agents', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await agentsResult.json());
```

## Deployment Checklist

- [ ] All API URLs point to production domain
- [ ] No `console.log()` statements in production code
- [ ] Error messages are user-friendly
- [ ] Loading states display for all async operations
- [ ] Auth tokens are securely stored
- [ ] CORS is configured for production domain
- [ ] MongoDB indexes are created
- [ ] Environment variables are set in Vercel
- [ ] Email notifications configured (optional)
- [ ] Error monitoring set up (Sentry/LogRocket)

---

**Next Steps:**
1. Update pages incrementally following these patterns
2. Test each page locally with `npm run dev:all`
3. Verify API calls in browser DevTools Network tab
4. Deploy to Vercel and test production APIs

For more details, see `README_BACKEND.md`
