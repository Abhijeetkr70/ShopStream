import { Router } from "express";
import { db } from "@shopstream/db";
import { categories } from "@shopstream/db/schema";
import { asc } from "drizzle-orm";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.position));
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});
