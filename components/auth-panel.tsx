"use client";

import {
  AuthError,
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  signup,
  type User,
} from "@netlify/identity";
import { FormEvent, useEffect, useState } from "react";

export function AuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        await handleAuthCallback();
        const current = await getUser();
        if (active) setUser(current);
      } catch {
        if (active) {
          setMessage(
            "Account sign-in becomes available on a configured Netlify preview or production deployment.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    const unsubscribe = onAuthChange((_event, current) => {
      if (active) setUser(current);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "");
    setMessage(mode === "login" ? "Signing in…" : "Creating account…");

    try {
      const current =
        mode === "login"
          ? await login(email, password)
          : await signup(email, password, { full_name: name });
      setUser(current);
      setMessage(
        current.confirmedAt
          ? "Welcome to your MpaMpe dashboard."
          : "Check your email to confirm your account.",
      );
    } catch (error) {
      setMessage(
        error instanceof AuthError
          ? error.message
          : "Sign-in is not configured in this environment yet.",
      );
    }
  }

  if (loading) {
    return <div className="form-card">Loading your account…</div>;
  }

  if (user) {
    const roles = user.roles?.length ? user.roles : ["member"];
    return (
      <div className="dashboard-shell">
        <aside className="dashboard-nav">
          <span className="eyebrow">Your account</span>
          <h2 style={{ marginTop: 12, fontSize: "1.7rem" }}>
            {user.name || user.email}
          </h2>
          <ul>
            <li>
              <a href="#overview">Overview</a>
            </li>
            <li>
              <a href="#donations">Donations</a>
            </li>
            <li>
              <a href="#campaigns">Campaigns</a>
            </li>
            <li>
              <a href="#mavericks">Mavericks</a>
            </li>
          </ul>
          <button
            className="button button-secondary button-full"
            style={{ marginTop: 22 }}
            onClick={async () => {
              await logout();
              setUser(null);
            }}
          >
            Sign out
          </button>
        </aside>
        <section className="dashboard-content" id="overview">
          <span className="eyebrow">Dashboard</span>
          <h1 style={{ marginTop: 12, fontSize: "2.6rem", color: "var(--teal-dark)" }}>
            Welcome back.
          </h1>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>
            Roles: {roles.join(", ")}. Donation history, campaign applications,
            Maverick assignments and receipts will appear here as live records
            are connected.
          </p>
          <div className="admin-stats">
            <div className="admin-stat">
              <strong>0</strong>
              <span>Donations</span>
            </div>
            <div className="admin-stat">
              <strong>0</strong>
              <span>Campaigns</span>
            </div>
            <div className="admin-stat">
              <strong>0</strong>
              <span>Assignments</span>
            </div>
            <div className="admin-stat">
              <strong>0</strong>
              <span>Receipts</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="two-column">
      <div className="content-panel">
        <span className="eyebrow">MpaMpe account</span>
        <h2>One account for giving, campaigning and volunteering.</h2>
        <p>
          Sign in to view donation confirmations, campaign applications,
          Maverick opportunities and account updates.
        </p>
      </div>
      <form className="form-card" onSubmit={authenticate}>
        {mode === "signup" ? (
          <label>
            Full name
            <input name="name" autoComplete="name" required />
          </label>
        ) : null}
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </label>
        <button className="button" type="submit">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
        <button
          className="text-link"
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
  );
}
