"use client";

import type { User } from "@supabase/supabase-js";
import {
  CheckCircle2,
  HeartHandshake,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { authenticatedUserFromResponse } from "@/lib/auth-state";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/toast-provider";

export function AuthPanel({ nextPath = "/dashboard" }: { nextPath?: string }) {
  const router = useRouter();
  const toast = useToast();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const missingConfigMessage =
    "Supabase Auth is not configured locally yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local to enable signups.";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState(supabase ? "" : missingConfigMessage);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    router.replace(nextPath);
    router.refresh();
  }, [nextPath, router, user]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage("Supabase Auth keys are missing in this local environment.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "");

    setMessage(mode === "login" ? "Signing in…" : "Creating account…");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
              emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
            },
          });

    if (result.error) {
      setMessage(result.error.message);
      toast({ title: mode === "login" ? "Sign in failed" : "Account not created", message: result.error.message, tone: "error" });
      return;
    }

    setUser(authenticatedUserFromResponse(result.data));
    setMessage(
      mode === "signup"
        ? "Account created. Check your email to confirm your MpaMpe account."
        : "Welcome to your MpaMpe dashboard.",
    );
    if (mode === "login" && result.data.session) {
      toast({ title: "Welcome back", message: "You are now signed in.", tone: "success" });
      router.push(nextPath);
      router.refresh();
    } else if (mode === "signup") {
      toast({ title: "Account created", message: "Check your email to confirm your account.", tone: "success" });
    }
  }

  if (loading) {
    return <div className="form-card">Loading your account…</div>;
  }

  if (user) {
    return <div className="form-card">Opening your dashboard…</div>;
  }

  return (
    <div className="auth-shell">
      <div className="auth-intro" data-reveal>
        <div className="auth-intro-icon" aria-hidden="true">
          <HeartHandshake />
        </div>
        <span className="eyebrow">Your MpaMpe account</span>
        <h2>One place for giving, campaigning and volunteering.</h2>
        <p>
          Join a community built around trusted stories, transparent support and
          practical impact.
        </p>
        <ul className="auth-benefits">
          <li><CheckCircle2 /> Follow your giving and campaign activity</li>
          <li><CheckCircle2 /> Prepare and manage campaign applications</li>
          <li><CheckCircle2 /> Stay connected to Mavericks opportunities</li>
        </ul>
      </div>
      <div className="auth-card" data-reveal>
        <div className="auth-mode-tabs" role="tablist" aria-label="Account action">
          <button
            className={mode === "login" ? "active" : undefined}
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "signup" ? "active" : undefined}
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>
        <div className="auth-card-heading">
          <span>{mode === "login" ? "Welcome back" : "Join MpaMpe"}</span>
          <h2>{mode === "login" ? "Sign in to continue." : "Create your account."}</h2>
          <p>
            {mode === "login"
              ? "Access your campaigns, giving activity and settings."
              : "Start giving, organising campaigns or volunteering with the community."}
          </p>
        </div>
        <form className="auth-form" onSubmit={authenticate}>
          {mode === "signup" ? (
            <label>
              Full name
              <span className="auth-input">
                <UserRound aria-hidden="true" />
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                />
              </span>
            </label>
          ) : null}
          <label>
            Email address
            <span className="auth-input">
              <Mail aria-hidden="true" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </span>
          </label>
          <label>
            Password
            <span className="auth-input">
              <LockKeyhole aria-hidden="true" />
              <input
                name="password"
                type="password"
                minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="At least 8 characters"
                required
              />
            </span>
          </label>
          <button className="button button-full" type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
          <button
            className="auth-switch"
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login"
              ? "New to MpaMpe? Create an account"
              : "Already have an account? Sign in"}
          </button>
          {message ? <p className="form-notice">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}
