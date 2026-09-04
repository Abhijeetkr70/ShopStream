import { Router } from "express";
import { z } from "zod";
import { db } from "@shopstream/db";
import { products, carts, cartItems } from "@shopstream/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { invalidate } from "@shopstream/lib/redis";

const LineSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const cartRouter = Router();

async function getOrCreateCart(userId: string) {
  const [existing] = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(carts).values({ userId }).returning();
  if (!created) throw new Error("cart create failed");
  return created;
}

cartRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user!.id);
    const items = await db
      .select({
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        slug: products.slug,
        title: products.title,
        images: products.images,
        priceSale: products.priceSale,
        priceMrp: products.priceMrp,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

cartRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = LineSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: { code: 400, message: "Bad line" } });
    const cart = await getOrCreateCart(req.user!.id);
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, parsed.data.productId)),
      )
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(cartItems)
        .set({ quantity: existing[0]!.quantity + parsed.data.quantity })
        .where(
          and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, parsed.data.productId)),
        );
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId: parsed.data.productId,
        quantity: parsed.data.quantity,
      });
    }
    await invalidate(`cart:${req.user!.id}`);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

cartRouter.delete("/:productId", requireAuth, async (req, res, next) => {
  try {
    const productId = String(req.params.productId ?? "");
    if (!productId) {
      return res.status(400).json({ error: { code: 400, message: "Missing productId" } });
    }
    const cart = await getOrCreateCart(req.user!.id);
    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
      );
    await invalidate(`cart:${req.user!.id}`);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
