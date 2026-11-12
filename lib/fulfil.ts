import { revalidatePath } from "next/cache";
import { adminClient } from "./supabase";
import { pingIndexNow } from "./indexnow";

export type FulfilResult = { ok: true; slug: string } | { ok: false; reason: string };

/** Credits a paid order exactly once (the SQL function is idempotent) and refreshes caches + search engines. */
export async function fulfilOrder(
  orderId: string,
  provider: "stripe" | "razorpay",
  providerRef: string,
  paidProviderAmount: number,
): Promise<FulfilResult> {
  const { data, error } = await adminClient().rpc("fulfill_order", {
    p_order_id: orderId,
    p_provider: provider,
    p_ref: providerRef,
    p_paid: paidProviderAmount,
  });
  if (error) throw new Error(error.message);
  const result = String(data);
  if (!result.startsWith("ok:")) return { ok: false, reason: result };
  const slug = result.slice(3);
  revalidatePath("/", "layout");
  void pingIndexNow(["/", "/today", `/product/${slug}`]);
  return { ok: true, slug };
}
