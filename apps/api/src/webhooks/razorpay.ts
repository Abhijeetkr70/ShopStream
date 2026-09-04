import type { Request, Response } from "express";
import crypto from "node:crypto";
import { db } from "@shopstream/db";
import { payments, orders } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";
import { enqueueEmail } from "../queues/index";
import { slackAlert } from "../alerts/slack";

export async function razorpayWebhook(req: Request, res: Response) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.header("x-razorpay-signature");
  if (webhookSecret) {
    if (!signature) return res.status(400).json({ error: "Missing signature" });
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (expected !== signature) return res.status(400).json({ error: "Bad signature" });
  } else {
    console.warn("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET not set — accepting unsigned (dev only)");
  }

  const event = req.body?.event;
  if (event === "payment.captured" || event === "order.paid") {
    const entity =
      req.body?.payload?.payment?.entity ?? req.body?.payload?.order?.entity;
    if (!entity) return res.json({ ok: true });
    const rpOrderId = entity.order_id ?? entity.id;
    await db
      .update(payments)
      .set({
        status: "captured",
        razorpayPaymentId: entity.id,
        method: entity.method ?? null,
      })
      .where(eq(payments.razorpayOrderId, rpOrderId));
    const [pay] = await db.select().from(payments).where(eq(payments.razorpayOrderId, rpOrderId)).limit(1);
    if (pay) {
      await db.update(orders).set({ status: "paid" }).where(eq(orders.id, pay.orderId));
      await enqueueEmail("order-paid", { orderId: pay.orderId });
    }
  } else if (event === "payment.failed") {
    const entity = req.body?.payload?.payment?.entity;
    const rpOrderId = entity?.order_id ?? "unknown";
    const amount = typeof entity?.amount === "number" ? entity.amount / 100 : 0;
    const reason = entity?.error_description ?? entity?.error_reason ?? "unknown";
    await slackAlert(
      `:rotating_light: ShopStream payment failed\n` +
        `• order: \`${rpOrderId}\`\n` +
        `• amount: ₹${amount}\n` +
        `• reason: ${reason}`,
    );
  }

  res.json({ ok: true });
}
