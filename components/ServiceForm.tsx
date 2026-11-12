"use client";

import { useState } from "react";

export default function ServiceForm() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("busy");
    setError("");
    try {
      const r = await fetch("/api/service/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f.entries())),
      });
      const j = await r.json();
      if (j.ok) setState("done");
      else { setError(j.error ?? "Could not send the request."); setState("idle"); }
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") return <p className="note" role="status">Request received. We will email you within one business day with scope and a payment link. Nothing has been charged.</p>;

  return (
    <form className="form-inline" onSubmit={submit}>
      <div className="field">
        <label htmlFor="sv-plan">Plan</label>
        <select id="sv-plan" name="plan" defaultValue="growth">
          <option value="starter">Starter: 25 directories</option>
          <option value="growth">Growth: 50 directories</option>
          <option value="scale">Scale: 100 directories</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="sv-email">Your email</label>
        <input id="sv-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="sv-site">Website to submit</label>
        <input id="sv-site" name="site_url" required inputMode="url" placeholder="yourproduct.com" autoCapitalize="none" />
      </div>
      <div className="field">
        <label htmlFor="sv-note">Notes <span className="muted">(optional)</span></label>
        <input id="sv-note" name="note" maxLength={300} />
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn btn-accent" type="submit" disabled={state === "busy"} aria-busy={state === "busy"}>
        {state === "busy" ? "Sending…" : "Send request (no payment yet)"}
      </button>
    </form>
  );
}
