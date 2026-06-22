"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setMessage("Shared.");
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Campaign link copied.");
      }
    } catch {
      setMessage("");
    }
  }

  return (
    <span>
      <button className="button button-secondary" type="button" onClick={share}>
        <Share2 /> Share
      </button>
      {message ? <span className="sr-only" role="status">{message}</span> : null}
    </span>
  );
}
