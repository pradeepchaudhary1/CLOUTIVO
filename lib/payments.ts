/** Which payment methods are configured (server-side check; never exposes secrets). */
export function paymentMethods() {
  return {
    upi: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    card: Boolean(process.env.STRIPE_SECRET_KEY),
  };
}
export type Methods = ReturnType<typeof paymentMethods>;
