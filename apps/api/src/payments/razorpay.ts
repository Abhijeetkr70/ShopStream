import Razorpay from "razorpay";
import { env } from "../config";

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export function mountRazorpay(_app: unknown) {
  /* Webhook handler lives at /api/v1/webhooks/razorpay (see webhooks/razorpay.ts). */
}
