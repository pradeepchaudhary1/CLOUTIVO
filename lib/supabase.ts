import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let pub: SupabaseClient | null = null;

export const hasDb = Boolean(url && anon);

/** Read-only client (RLS enforced). Safe for server components. */
export function publicClient(): SupabaseClient | null {
  if (!url || !anon) return null;
  pub ??= createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  return pub;
}

/** Service-role client. Server-only: payments, webhooks, clicks. Never import in a client component. */
export function adminClient(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin env vars are missing");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
