import { Router } from "express";
import { db } from "@shopstream/db";
import { products, categories } from "@shopstream/db/schema";
import { eq, asc } from "drizzle-orm";

export const productsRouter = Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const url = new URL(req.url, "http://x");
    const category = url.searchParams.get("category");
    const limit = Math.min(100, Number(url.searchParams.get("limit") ?? 24));
    const rows = category
      ? await db
          .select()
          .from(products)
          .innerJoin(categories, eq(products.categoryId, categories.id))
          .where(eq(categories.slug, category))
          .orderBy(asc(products.title))
          .limit(limit)
      : await db.select().from(products).orderBy(asc(products.title)).limit(limit);
    res.json({ items: rows.map((r) => (r && "products" in r ? r.products : r)) });
  } catch (e) {
    next(e);
  }
});

productsRouter.get("/:slug", async (req, res, next) => {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, req.params.slug))
      .limit(1);
    if (!row) return res.status(404).json({ error: { code: 404, message: "Not found" } });
    res.json({ item: row });
  } catch (e) {
    next(e);
  }
});
