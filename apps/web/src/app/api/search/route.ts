import { NextResponse } from "next/server";
import { db } from "@shopstream/db";
import { products } from "@shopstream/db/schema";
import { and, gt, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(20, Number(url.searchParams.get("limit") ?? 10));

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.status, "active"), gt(products.stock, 0)))
    .limit(200);

  const term = q.toLowerCase();
  const items = rows
    .filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term),
    )
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      brand: p.brand,
      image: p.images[0] ?? null,
      priceSale: p.priceSale,
      priceMrp: p.priceMrp,
    }));

  return NextResponse.json({ items });
}
