export const usd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Math.round(cents) / 100,
  );

export const inr = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Math.round(paise) / 100,
  );

export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function ago(iso: string, now = Date.now()) {
  const s = Math.max(1, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 60) return `${d} days ago`;
  return `${Math.floor(d / 30)} months ago`;
}

export const isoDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);
