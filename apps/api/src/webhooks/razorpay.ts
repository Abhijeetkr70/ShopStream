import type { Request, Response } from "express";
import crypto from "node:crypto";
import { db } from "@shopstream/db";
import { payments, orders } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";
import { env } from "../config";
import { enqueueEmail } from "../queues/index";

export async function razorpayWebhook(req: Request, res: Response) {
  const signature = req.header("x-razorpay-signature");
  if (!signature) return res.status(400).json({ error: "Missing signature" });
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (expected !== signature) return res.status(400).json({ error: "Bad signature" });

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
  }

  res.json({ ok: true });
}
