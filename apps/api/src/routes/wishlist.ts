import { Router } from "express";
import { z } from "zod";
import { db } from "@shopstream/db";
import { wishlists, products } from "@shopstream/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

export const wishlistRouter = Router();

const Body = z.object({ productId: z.string().uuid() });

wishlistRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const rows = await db
      .select({ product: products })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .where(eq(wishlists.userId, req.user!.id));
    res.json({ items: rows.map((r) => r.product) });
  } catch (e) {
    next(e);
  }
});

wishlistRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: { code: 400, message: "Bad body" } });
    try {
      await db.insert(wishlists).values({
        userId: req.user!.id,
        productId: parsed.data.productId,
      });
    } catch {
      /* duplicate, ignore */
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

wishlistRouter.delete("/:productId", requireAuth, async (req, res, next) => {
  try {
    const productId = String(req.params.productId ?? "");
    if (!productId) {
      return res.status(400).json({ error: { code: 400, message: "Missing productId" } });
    }
    await db
      .delete(wishlists)
      .where(
        and(
          eq(wishlists.userId, req.user!.id),
          eq(wishlists.productId, productId),
        ),
      );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
