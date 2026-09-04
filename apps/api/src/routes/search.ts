import { Router } from "express";
import { db } from "@shopstream/db";
import { products } from "@shopstream/db/schema";
import { ilike, or } from "drizzle-orm";

export const searchRouter = Router();

searchRouter.get("/", async (req, res, next) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const limit = Math.min(50, Number(req.query.limit ?? 24));
    if (!q) return res.json({ items: [] });
    const rows = await db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.title, `%${q}%`),
          ilike(products.brand, `%${q}%`),
          ilike(products.description, `%${q}%`),
        ),
      )
      .limit(limit);
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});
