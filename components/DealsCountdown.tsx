"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** A real countdown to a real deadline (endIso comes from config). Renders nothing after the deadline. */
export default function DealsCountdown({ endIso, label }: { endIso: string; label: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, []);
  const end = new Date(endIso).getTime();
  if (now === null) return <div className="countdown" aria-hidden="true">&nbsp;</div>;
  if (now >= end) return null;
  const p = parts(end - now);
  return (
    <div className="countdown" role="timer" aria-live="off">
      <span>{label}</span>
      <strong>{p.d}d {String(p.h).padStart(2, "0")}h {String(p.m).padStart(2, "0")}m {String(p.s).padStart(2, "0")}s</strong>
      <span className="muted">Ends {new Date(endIso).toUTCString().replace(" GMT", " UTC")}</span>
    </div>
  );
}
