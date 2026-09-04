import Razorpay from "razorpay";
import { env } from "../config";

const hasSecret = !!env.RAZORPAY_KEY_SECRET && env.RAZORPAY_KEY_SECRET.length >= 8;

export const razorpay: Razorpay | null = hasSecret
  ? new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET as string,
    })
  : null;

export function isRazorpayLive(): boolean {
  return razorpay !== null;
}

export function mountRazorpay(_app: unknown) {
  /* Webhook handler lives at /api/v1/webhooks/razorpay (see webhooks/razorpay.ts). */
}
