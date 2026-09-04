import { Router } from "express";
import { z } from "zod";
import { db } from "@shopstream/db";
import { orders, orderItems, payments, addresses, products } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { enqueueEmail } from "../queues/index";
import { razorpay } from "../payments/razorpay";

const CreateSchema = z.object({
  addressId: z.string().uuid(),
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1) })).min(1),
});

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, req.user!.id));
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

ordersRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = CreateSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: { code: 400, message: "Bad order" } });

    const [addr] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, parsed.data.addressId))
      .limit(1);
    if (!addr || addr.userId !== req.user!.id) {
      return res.status(400).json({ error: { code: 400, message: "Bad address" } });
    }

    let subtotal = 0;
    const lines: { productId: string; title: string; unitPrice: number; quantity: number; lineTotal: number }[] = [];
    for (const line of parsed.data.items) {
      const [p] = await db.select().from(products).where(eq(products.id, line.productId)).limit(1);
      if (!p) continue;
      const lineTotal = p.priceSale * line.quantity;
      subtotal += lineTotal;
      lines.push({
        productId: p.id,
        title: p.title,
        unitPrice: p.priceSale,
        quantity: line.quantity,
        lineTotal,
      });
    }
    const shipping = subtotal > 49900 || subtotal === 0 ? 0 : 4900;
    const total = subtotal + shipping;

    const [order] = await db
      .insert(orders)
      .values({
        userId: req.user!.id,
        addressId: addr.id,
        subtotal,
        shipping,
        total,
        status: "created",
      })
      .returning();
    if (!order) return res.status(500).json({ error: { code: 500, message: "order create failed" } });

    for (const l of lines) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: l.productId,
        title: l.title,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      });
    }

    let razorpayOrderId: string;
    if (razorpay) {
      const rpOrder = await razorpay.orders.create({
        amount: total,
        currency: "INR",
        receipt: order.id,
        notes: { userId: req.user!.id, orderId: order.id },
      });
      razorpayOrderId = rpOrder.id;
    } else {
      // Mock mode (no RAZORPAY_KEY_SECRET set): use a deterministic fake ID.
      razorpayOrderId = `mock_${order.id.replace(/-/g, "").slice(0, 16)}`;
      console.warn("[orders] razorpay mock mode — order pending manual fulfillment");
    }

    await db.insert(payments).values({
      orderId: order.id,
      razorpayOrderId,
      amount: total,
      status: "pending",
    });

    await enqueueEmail("order-created", { orderId: order.id, email: req.user!.email });

    res.json({ orderId: order.id, razorpayOrderId, amount: total });
  } catch (e) {
    next(e);
  }
});
