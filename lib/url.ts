export class UrlError extends Error {}

export type Normalized = { url: string; host: string; slug: string };

// Hosts where the path identifies the product (so different repos/apps do not share a rank).
const PATH_KEYED = new Set([
  "github.com", "gitlab.com", "x.com", "twitter.com", "apps.apple.com", "play.google.com",
  "producthunt.com", "youtube.com", "linkedin.com", "instagram.com", "tiktok.com",
  "medium.com", "substack.com", "huggingface.co", "npmjs.com", "pypi.org",
  "chromewebstore.google.com", "reddit.com", "behance.net", "dribbble.com",
]);

// Chat / invite links are not products (same rule as the public rules page).
const CHAT_HOSTS = new Set([
  "t.me", "telegram.me", "telegram.org", "wa.me", "whatsapp.com", "chat.whatsapp.com",
  "discord.gg", "discord.com", "discordapp.com", "signal.me", "signal.group", "m.me", "messenger.com",
]);

const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "rebrand.ly",
  "cutt.ly", "shorturl.at", "lnkd.in", "rb.gy", "tiny.cc", "s.id", "linktr.ee", "bio.link",
]);

const ADULT_TLDS = [".xxx", ".porn", ".sex", ".adult", ".sexy"];
const ADULT_WORDS = ["porn", "xvideos", "xnxx", "xhamster", "onlyfans", "chaturbate", "nsfw", "hentai", "escort"];

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

const stripWww = (h: string) => h.replace(/^www\./, "");

export function normalizeListingUrl(input: string): Normalized {
  let raw = String(input ?? "").trim();
  if (!raw) throw new UrlError("Enter your website URL or X handle.");
  if (raw.length > 300) throw new UrlError("That URL is too long.");

  // @handle -> X profile
  if (/^@/.test(raw)) {
    const handle = raw.slice(1);
    if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) throw new UrlError("That X handle is not valid.");
    raw = `https://x.com/${handle}`;
  }
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = `https://${raw}`;

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new UrlError("That does not look like a valid URL.");
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new UrlError("Only http(s) links are allowed.");
  if (u.username || u.password) throw new UrlError("Remove the username/password from the URL.");

  const host = stripWww(u.hostname.toLowerCase());
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host === "localhost")
    throw new UrlError("Use a public website address.");
  if (IPV4.test(host) || host.includes(":") || host.startsWith("[")) throw new UrlError("IP addresses are not allowed.");
  if (!/^[a-z0-9.-]+$/.test(host)) throw new UrlError("That domain name has unsupported characters.");

  if (CHAT_HOSTS.has(host)) throw new UrlError("Chat and invite links are not allowed. List a product or profile.");
  if (SHORTENERS.has(host)) throw new UrlError("Link shorteners are not allowed. Use the final URL.");
  if (ADULT_TLDS.some((t) => host.endsWith(t)) || ADULT_WORDS.some((w) => host.includes(w)))
    throw new UrlError("Adult content is not allowed on this board.");

  // Query strings, hashes and tracking params are always stripped.
  const segments = u.pathname.split("/").filter(Boolean).map((s) => s.toLowerCase());
  const pathKeyed = PATH_KEYED.has(host);
  const keptPath = segments.map((s) => s.replace(/[^a-z0-9._@~-]/g, "")).filter(Boolean);
  if (host === "x.com" || host === "twitter.com") keptPath.splice(1); // only the profile

  const slugParts = [host, ...(pathKeyed ? keptPath : [])];
  const slug = slugParts.join("--").slice(0, 100).replace(/[.-]+$/, "");
  if (!slug) throw new UrlError("Could not build a listing address from that URL.");

  const canonicalHost = host === "twitter.com" ? "x.com" : host;
  const path = pathKeyed && keptPath.length ? `/${keptPath.join("/")}` : segments.length ? `/${segments.join("/")}` : "";
  const url = `https://${canonicalHost}${path}`.replace(/\/+$/, "");
  return { url, host: canonicalHost, slug: slug.replace(/^twitter\.com/, "x.com") };
}

export function cleanText(input: unknown, max: number): string {
  return String(input ?? "")
    .replace(/[\u0000-\u001f\u007f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
