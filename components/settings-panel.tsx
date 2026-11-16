"use client";

import type { User } from "@supabase/supabase-js";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/toast-provider";

export function SettingsPanel() {
  const toast = useToast();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const missingConfigMessage =
    "Supabase Auth is not configured locally. Add Supabase keys to .env.local to edit settings.";
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    phone: string | null;
    role: string;
  } | null>(null);
  const [message, setMessage] = useState(
    supabase ? "Loading settings…" : missingConfigMessage,
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getUser().then(async ({ data, error }) => {
      setUser(data.user);
      if (error || !data.user) {
        setMessage(error?.message || "Sign in to manage your settings.");
        return;
      }
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name,phone,role")
        .eq("id", data.user.id)
        .single();
      setProfile(profileData);
      setMessage(profileError ? profileError.message : "");
    });
  }, [supabase]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user) return;
    const data = new FormData(event.currentTarget);
    setMessage("Saving settings…");
    const fullName = String(data.get("fullName") || "");
    const phone = String(data.get("phone") || "");
    const [authResult, profileResult] = await Promise.all([
      supabase.auth.updateUser({ data: { full_name: fullName, phone } }),
      supabase
        .from("profiles")
        .update({ full_name: fullName, phone: phone || null })
        .eq("id", user.id)
        .select("full_name,phone,role")
        .single(),
    ]);

    if (authResult.error || profileResult.error) {
      const errorMessage = authResult.error?.message || profileResult.error?.message || "Unable to save settings.";
      setMessage(errorMessage);
      toast({ title: "Settings not saved", message: errorMessage, tone: "error" });
      return;
    }

    setUser(authResult.data.user);
    setProfile(profileResult.data);
    setMessage("Settings saved.");
    toast({ title: "Settings saved", tone: "success" });
  }

  if (!user) {
    return (
      <div className="form-card">
        <h2>Account settings</h2>
        <p>{message || "Sign in to manage your settings."}</p>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={save}>
      <span className="eyebrow">Settings</span>
      <h2>Manage your MpaMpe profile</h2>
      <div className="form-grid">
        <label>
          Full name
          <input
            name="fullName"
            defaultValue={String(profile?.full_name || user.user_metadata?.full_name || "")}
            autoComplete="name"
          />
        </label>
        <label>
          Phone
          <input
            name="phone"
            defaultValue={String(profile?.phone || user.user_metadata?.phone || "")}
            autoComplete="tel"
          />
        </label>
        <label>
          Email
          <input value={user.email ?? ""} readOnly />
        </label>
        <label>
          Account role
          <input value={profile?.role || "donor"} readOnly />
        </label>
      </div>
      <button className="button" type="submit">
        Save settings
      </button>
      {message ? <p className="form-notice">{message}</p> : null}
    </form>
  );
}
