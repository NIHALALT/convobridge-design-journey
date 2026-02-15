# ConvoBridge — Manual Supabase Backend Migration Guide

This guide explains how to manually migrate ConvoBridge from the current MongoDB/Express backend to Supabase for authentication, database, storage, and admin functionality.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Schema](#database-schema)
4. [Authentication (Sign Up / Sign In)](#authentication)
5. [Row Level Security (RLS)](#row-level-security)
6. [User Roles & Admin](#user-roles--admin)
7. [Frontend Integration](#frontend-integration)
8. [Dashboard Data](#dashboard-data)
9. [Edge Functions](#edge-functions)
10. [File Storage](#file-storage)
11. [Environment Variables](#environment-variables)

---

## Prerequisites

- A Supabase project (create at https://supabase.com)
- Node.js 18+
- The existing ConvoBridge frontend codebase

## Project Setup

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Environment Variables

Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Database Schema

Run these SQL statements in the Supabase SQL Editor (Dashboard → SQL Editor).

### Profiles Table

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  company text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### User Roles Table

```sql
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles (avoids RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Auto-assign 'user' role on signup
create or replace function public.assign_default_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created_role
  after insert on auth.users
  for each row execute function public.assign_default_role();
```

### Agents Table

```sql
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null default 'inbound',
  system_prompt text,
  voice text default 'alloy',
  languages text[] default '{"en"}',
  personality text default 'professional',
  template text default 'custom',
  status text default 'draft',
  asterisk_extension text,
  integrations jsonb default '{}',
  stats jsonb default '{"totalCalls": 0, "avgDuration": 0}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.agents enable row level security;
```

### Calls Table

```sql
create table public.calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete set null,
  caller_number text,
  duration integer default 0,
  status text default 'pending',
  outcome text,
  sentiment text,
  transcript text,
  recording_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.calls enable row level security;
```

### Leads Table

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  call_id uuid references public.calls(id) on delete set null,
  name text not null,
  email text,
  phone text,
  status text default 'new',
  score integer default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads enable row level security;
```

### Agent Context Table

```sql
create table public.agent_contexts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  source_type text not null, -- 'file', 'website', 'manual'
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.agent_contexts enable row level security;
```

### Contact Submissions Table

```sql
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.contact_submissions enable row level security;
```

---

## Row Level Security

```sql
-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

-- Agents: users can CRUD their own agents
create policy "Users can view own agents"
  on public.agents for select to authenticated using (user_id = auth.uid());

create policy "Users can create agents"
  on public.agents for insert to authenticated with check (user_id = auth.uid());

create policy "Users can update own agents"
  on public.agents for update to authenticated using (user_id = auth.uid());

create policy "Users can delete own agents"
  on public.agents for delete to authenticated using (user_id = auth.uid());

-- Calls: users can view their own calls
create policy "Users can view own calls"
  on public.calls for select to authenticated using (user_id = auth.uid());

create policy "Users can create calls"
  on public.calls for insert to authenticated with check (user_id = auth.uid());

-- Leads: users can CRUD their own leads
create policy "Users can view own leads"
  on public.leads for select to authenticated using (user_id = auth.uid());

create policy "Users can create leads"
  on public.leads for insert to authenticated with check (user_id = auth.uid());

create policy "Users can update own leads"
  on public.leads for update to authenticated using (user_id = auth.uid());

create policy "Users can delete own leads"
  on public.leads for delete to authenticated using (user_id = auth.uid());

-- Agent Context: users can manage context for their own agents
create policy "Users can view own agent context"
  on public.agent_contexts for select to authenticated
  using (agent_id in (select id from public.agents where user_id = auth.uid()));

create policy "Users can create agent context"
  on public.agent_contexts for insert to authenticated
  with check (agent_id in (select id from public.agents where user_id = auth.uid()));

create policy "Users can delete own agent context"
  on public.agent_contexts for delete to authenticated
  using (agent_id in (select id from public.agents where user_id = auth.uid()));

-- Contact submissions: anyone can insert, only admins can read
create policy "Anyone can submit contact form"
  on public.contact_submissions for insert to anon, authenticated with check (true);

create policy "Admins can view contact submissions"
  on public.contact_submissions for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- User Roles: users can read their own roles, admins can manage all
create policy "Users can view own roles"
  on public.user_roles for select to authenticated using (user_id = auth.uid());

create policy "Admins can manage all roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Admin policies for viewing all data
create policy "Admins can view all agents"
  on public.agents for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can view all calls"
  on public.calls for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can view all profiles"
  on public.profiles for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
```

---

## Authentication

### Replace `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, company?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check admin role
          const { data } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, company?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name, company },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### Replace `src/pages/Login.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background p-12 flex-col justify-between">
        <h2 className="text-3xl font-display font-bold">ConvoBridge</h2>
        <div>
          <h3 className="text-2xl font-bold mb-4">Never miss another call.</h3>
          <p className="text-background/60">AI agents that answer, qualify, and convert — 24/7.</p>
        </div>
        <p className="text-sm text-background/40">© ConvoBridge</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <h1 className="text-2xl font-bold">Sign in</h1>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
```

---

## Dashboard Data

### Replace API calls with Supabase queries

Create `src/hooks/useSupabaseData.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Agents
export function useAgents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['agents', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (agent: any) => {
      const { data, error } = await supabase
        .from('agents')
        .insert({ ...agent, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  });
}

// Calls
export function useCalls() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['calls', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calls')
        .select('*, agents(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Leads
export function useLeads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Dashboard Stats
export function useDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      const [agents, calls, leads] = await Promise.all([
        supabase.from('agents').select('id', { count: 'exact' }),
        supabase.from('calls').select('id, duration', { count: 'exact' }),
        supabase.from('leads').select('id', { count: 'exact' }),
      ]);
      return {
        totalAgents: agents.count || 0,
        totalCalls: calls.count || 0,
        totalLeads: leads.count || 0,
        avgCallDuration: calls.data?.length
          ? Math.round(calls.data.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.data.length)
          : 0,
      };
    },
    enabled: !!user,
  });
}
```

---

## Edge Functions

For server-side logic (sending emails, processing files, Gemini API proxy), use Supabase Edge Functions.

### Create a Gemini API proxy

```bash
supabase functions new gemini-proxy
```

File: `supabase/functions/gemini-proxy/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { prompt, context } = await req.json();
  const apiKey = Deno.env.get("GEMINI_API_KEY");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${context}\n\n${prompt}` }] }],
      }),
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Deploy:
```bash
supabase functions deploy gemini-proxy
supabase secrets set GEMINI_API_KEY=your-key-here
```

---

## File Storage

### Create a storage bucket for call recordings and context files

In Supabase Dashboard → Storage → New Bucket:
- Name: `context-files`
- Public: No

```sql
-- Storage policies
create policy "Users can upload context files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'context-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own context files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'context-files' and (storage.foldername(name))[1] = auth.uid()::text);
```

### Upload files from frontend:

```typescript
const uploadContextFile = async (file: File, agentId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const path = `${user!.id}/${agentId}/${file.name}`;

  const { error } = await supabase.storage
    .from('context-files')
    .upload(path, file);

  if (error) throw error;
  return path;
};
```

---

## Environment Variables

### `.env.local` (frontend):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

### Supabase Edge Function secrets:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets set STRIPE_SECRET_KEY=sk_live_...  # if using payments
```

---

## Migration Checklist

- [ ] Create Supabase project
- [ ] Run all SQL schema statements
- [ ] Install `@supabase/supabase-js`
- [ ] Create `src/lib/supabase.ts`
- [ ] Replace `AuthContext.tsx` with Supabase auth
- [ ] Replace `apiClient.ts` calls with Supabase queries
- [ ] Create `useSupabaseData.ts` hooks
- [ ] Update `Login.tsx` and `Signup.tsx` to use `supabase.auth`
- [ ] Update `Dashboard.tsx` to use new hooks
- [ ] Update `AgentBuilder.tsx` to save to Supabase
- [ ] Create Edge Functions for server-side logic
- [ ] Set up storage bucket for files
- [ ] Configure RLS policies
- [ ] Set up admin role for first user
- [ ] Test all flows end-to-end
- [ ] Remove `backend/` folder and Express dependencies

### Making yourself admin

After signing up, run this in the SQL Editor:

```sql
insert into public.user_roles (user_id, role)
values ('YOUR_USER_UUID_HERE', 'admin');
```

Find your UUID in Authentication → Users in the Supabase Dashboard.

---

## Files to Remove After Migration

- `backend/` — entire folder
- `api/` — entire folder  
- `src/lib/apiClient.ts` — replaced by Supabase client
- `src/hooks/useDashboardData.ts` — replaced by `useSupabaseData.ts`
- Express/MongoDB dependencies from `package.json`

## Files to Modify

- `src/contexts/AuthContext.tsx` — use Supabase auth
- `src/pages/Login.tsx` — use Supabase signIn
- `src/pages/Signup.tsx` — use Supabase signUp  
- `src/pages/Dashboard.tsx` — use Supabase queries
- `src/pages/AgentBuilder.tsx` — use Supabase for CRUD
- `src/components/ContextManager.tsx` — use Supabase storage
- `src/pages/Admin.tsx` — use has_role() for admin checks
- `src/pages/Settings.tsx` — use Supabase profile updates
